"""
utils.py — shared helpers: paths, logging, value cleaning, env loading.

Centralizes configuration so preprocess.py and watch.py read from a single
source of truth. Config precedence: CLI flag > env var > .env file > default.
"""
from __future__ import annotations

import logging
import logging.handlers
import math
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any, Iterable, Optional

import pandas as pd

try:
    from dotenv import load_dotenv
except ImportError:  # dotenv is a runtime dep — fail loudly if missing
    raise SystemExit(
        "python-dotenv is not installed. Run: pip install -r requirements.txt"
    )


# ---------------------------------------------------------------------------
# Paths — resolved from BACKEND_ROOT so they work regardless of cwd
# ---------------------------------------------------------------------------

# utils.py lives at backend/app/pipeline/utils.py → parents[2] is backend/
BACKEND_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = BACKEND_ROOT.parent  # market_intelligence/
FRONTEND_ROOT = PROJECT_ROOT / "frontend"

# Load .env from backend/.env (if present)
load_dotenv(BACKEND_ROOT / ".env")


def _env_path(key: str, default: Path) -> Path:
    """Read a path from env, resolve relative to BACKEND_ROOT when relative."""
    raw = os.environ.get(key)
    if not raw:
        return default
    p = Path(raw).expanduser()
    if not p.is_absolute():
        p = (BACKEND_ROOT / p).resolve()
    return p


def _env_int(key: str, default: int) -> int:
    raw = os.environ.get(key)
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


RAW_DATA_DIR: Path = _env_path("RAW_DATA_DIR", BACKEND_ROOT / "data" / "raw")
PROCESSED_DIR: Path = _env_path(
    "PROCESSED_DIR", BACKEND_ROOT / "data" / "processed"
)
FRONTEND_DATA_PATH: Path = _env_path(
    "FRONTEND_DATA_PATH", FRONTEND_ROOT / "public" / "data" / "final_data.json"
)
SAMPLE_DATA_PATH: Path = _env_path(
    "SAMPLE_DATA_PATH",
    FRONTEND_ROOT / "public" / "data" / "final_data.sample.json",
)
PROCESSED_JSON_PATH: Path = PROCESSED_DIR / "final_data.json"
LOG_DIR: Path = _env_path("LOG_DIR", BACKEND_ROOT / "logs")

CHUNK_SIZE: int = _env_int("CHUNK_SIZE", 5_000)
TABLE_ROWS: int = _env_int("TABLE_ROWS", 100)
WATCH_DEBOUNCE_SEC: int = _env_int("WATCH_DEBOUNCE_SEC", 2)
SAMPLE_ROWS: int = _env_int("SAMPLE_ROWS", 10)


def ensure_dirs() -> None:
    """Create required folders if missing — idempotent."""
    for p in (RAW_DATA_DIR, PROCESSED_DIR, LOG_DIR, FRONTEND_DATA_PATH.parent):
        p.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Logging — console + rotating file handler
# ---------------------------------------------------------------------------

def setup_logger(
    name: str = "mi_pipeline", level: int = logging.INFO
) -> logging.Logger:
    """Configure a logger with stdout + rotating file handler. Idempotent."""
    logger = logging.getLogger(name)
    logger.setLevel(level)
    if logger.handlers:
        return logger

    fmt = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-7s | %(message)s",
        datefmt="%H:%M:%S",
    )

    stream = sys.stdout
    try:
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="backslashreplace")
    except Exception:
        pass
    console = logging.StreamHandler(stream)
    console.setFormatter(fmt)
    logger.addHandler(console)

    try:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        file_handler = logging.handlers.RotatingFileHandler(
            LOG_DIR / "pipeline.log",
            maxBytes=2_000_000,
            backupCount=3,
            encoding="utf-8",
        )
        file_handler.setFormatter(fmt)
        logger.addHandler(file_handler)
    except Exception:
        pass

    logger.propagate = False
    return logger


# ---------------------------------------------------------------------------
# Column + value cleaning
# ---------------------------------------------------------------------------

_COL_NORM_RE = re.compile(r"[^a-z0-9]+")


def normalize_column_name(name: Any) -> str:
    """Lowercase, collapse non-alphanumerics to underscores, trim edges."""
    if name is None:
        return ""
    s = str(name).strip().lower()
    s = _COL_NORM_RE.sub("_", s)
    return s.strip("_")


def clean_string(value: Any, max_len: Optional[int] = None) -> Optional[str]:
    """Trim, collapse whitespace, discard empties and obvious sentinels."""
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    s = str(value).strip()
    if not s:
        return None
    s = re.sub(r"\s+", " ", s)
    if s in {"-", "--", "N/A", "NA", "None", "null", "NULL", "Not Available", "N/M"}:
        return None
    if max_len is not None and len(s) > max_len:
        s = s[:max_len].rstrip() + "…"
    return s


def safe_float(value: Any, default: float = 0.0) -> float:
    """Best-effort conversion to float; returns `default` on failure/NaN."""
    if value is None:
        return default
    if isinstance(value, (int, float)):
        if isinstance(value, float) and math.isnan(value):
            return default
        return float(value)
    try:
        cleaned = re.sub(r"[,\s$]", "", str(value))
        if not cleaned or cleaned in {"-", "--"}:
            return default
        return float(cleaned)
    except (TypeError, ValueError):
        return default


def standardize_date(value: Any) -> Optional[str]:
    """Convert many date formats to ISO `YYYY-MM-DD`. Returns None on failure."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    try:
        ts = pd.to_datetime(value, errors="coerce", dayfirst=False)
        if ts is pd.NaT or ts is None:
            return None
        return ts.date().isoformat()
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Category inference (from filename, when the sheet lacks one)
# ---------------------------------------------------------------------------

_CATEGORY_RULES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"encapsulant|eva_film|poe_film|pvdf|polyolefin|polyvinyl|epe_film", re.I),
     "Encapsulant Film"),
    (re.compile(r"solar_glass|pv_glass", re.I), "Solar Glass"),
    (re.compile(r"aluminium_frame|aluminum_frame|solar_frame", re.I), "Aluminium Frame"),
    (re.compile(r"productdesc", re.I), "Solar Module"),
    (re.compile(r"hs4or8", re.I), "HS Trade Records"),
]


def infer_category_from_filename(filename: str) -> str:
    """Guess a human-friendly category label from a Volza filename."""
    name = Path(filename).stem
    for pattern, label in _CATEGORY_RULES:
        if pattern.search(name):
            return label
    return "Other"


# ---------------------------------------------------------------------------
# Misc
# ---------------------------------------------------------------------------

def chunked(iterable: Iterable, size: int) -> Iterable[list]:
    """Yield lists of at most `size` items from an iterable."""
    buf: list = []
    for item in iterable:
        buf.append(item)
        if len(buf) >= size:
            yield buf
            buf = []
    if buf:
        yield buf


def human_bytes(num: int) -> str:
    """Format a byte count for log output."""
    for unit in ("B", "KB", "MB", "GB"):
        if num < 1024:
            return f"{num:.1f} {unit}"
        num /= 1024
    return f"{num:.1f} TB"
