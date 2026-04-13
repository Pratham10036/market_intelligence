"""
preprocess.py — main pipeline entrypoint.

Usage
-----
    python -m app.pipeline.preprocess
    python -m app.pipeline.preprocess --input "D:/custom/path"
    python -m app.pipeline.preprocess --chunk-size 10000 --table-rows 150

What it does
------------
1. Walks the input folder for *.xlsx files (non-recursive, ignores ~$ lock files).
2. Streams each workbook chunk-by-chunk (openpyxl read_only) through the
   unified 6-column schema via transform.normalize_chunk.
3. Folds chunks into a streaming `Aggregator` that maintains KPI totals,
   monthly trend, country/category/product distributions, and a bounded
   table preview — O(unique-keys) memory, independent of row count.
4. Writes two artifacts:
     - backend/data/processed/final_data.json  (canonical copy)
     - frontend/public/data/final_data.json    (served by Vite → React app)
5. Writes a trimmed fixture:
     - frontend/public/data/final_data.sample.json  (for offline/dev)
"""
from __future__ import annotations

import argparse
import json
import logging
import time
import traceback
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import pandas as pd

from .transform import normalize_chunk, stream_workbook_chunks
from .utils import (
    CHUNK_SIZE,
    FRONTEND_DATA_PATH,
    PROCESSED_JSON_PATH,
    RAW_DATA_DIR,
    SAMPLE_DATA_PATH,
    SAMPLE_ROWS,
    TABLE_ROWS,
    ensure_dirs,
    human_bytes,
    infer_category_from_filename,
    setup_logger,
)

logger = setup_logger()


# ---------------------------------------------------------------------------
# Streaming aggregator
# ---------------------------------------------------------------------------

class Aggregator:
    """Accumulates running aggregates across streamed chunks.

    Memory footprint is bounded by cardinality (unique countries / products /
    months), not by total row count.
    """

    def __init__(self, table_limit: int = 100) -> None:
        self.total_value: float = 0.0
        self.total_quantity: float = 0.0
        self.row_count: int = 0
        self.files_processed: int = 0

        def _bucket() -> dict[str, float]:
            return {"value": 0.0, "quantity": 0.0, "count": 0}

        self.monthly: dict[str, dict[str, float]] = defaultdict(_bucket)
        self.country: dict[str, dict[str, float]] = defaultdict(_bucket)
        self.category: dict[str, dict[str, float]] = defaultdict(_bucket)
        self.product: dict[str, dict[str, float]] = defaultdict(_bucket)

        self._min_date: Optional[str] = None
        self._max_date: Optional[str] = None

        self.table_limit = table_limit
        self.table_preview: list[dict[str, Any]] = []

    def update(self, df: pd.DataFrame) -> None:
        if df.empty:
            return
        self.row_count += len(df)
        self.total_value += float(df["value"].sum())
        self.total_quantity += float(df["quantity"].sum())

        valid_dates = df["date"].dropna()
        if not valid_dates.empty:
            local_min = valid_dates.min()
            local_max = valid_dates.max()
            if self._min_date is None or local_min < self._min_date:
                self._min_date = local_min
            if self._max_date is None or local_max > self._max_date:
                self._max_date = local_max

        dated = df[df["date"].notna()].copy()
        if not dated.empty:
            dated["month"] = dated["date"].str[:7]
            self._fold(dated.groupby("month"), self.monthly)

        self._fold(df.groupby("country"), self.country)
        self._fold(df.groupby("category"), self.category)
        self._fold(df.groupby("product"), self.product)

        if len(self.table_preview) < self.table_limit:
            needed = self.table_limit - len(self.table_preview)
            preview_rows = df.head(needed)[
                ["date", "product", "category", "country",
                 "value", "quantity", "description"]
            ].to_dict(orient="records")
            for r in preview_rows:
                r["value"] = round(float(r["value"] or 0), 2)
                r["quantity"] = round(float(r["quantity"] or 0), 2)
            self.table_preview.extend(preview_rows)

    @staticmethod
    def _fold(grouped, target: dict[str, dict[str, float]]) -> None:
        agg = grouped.agg(
            value=("value", "sum"),
            quantity=("quantity", "sum"),
            count=("value", "size"),
        )
        for key, row in agg.iterrows():
            if key is None or (isinstance(key, float) and pd.isna(key)):
                key = "Unknown"
            bucket = target[str(key)]
            bucket["value"] += float(row["value"])
            bucket["quantity"] += float(row["quantity"])
            bucket["count"] += int(row["count"])

    def finalize(self, top_n: int = 20) -> dict[str, Any]:
        def _sorted(bucket, limit):
            items = [
                {
                    "name": name,
                    "value": round(b["value"], 2),
                    "quantity": round(b["quantity"], 2),
                    "count": int(b["count"]),
                }
                for name, b in bucket.items()
            ]
            items.sort(key=lambda x: x["value"], reverse=True)
            if limit is not None:
                items = items[:limit]
            return items

        monthly = [
            {
                "month": month,
                "value": round(b["value"], 2),
                "quantity": round(b["quantity"], 2),
                "count": int(b["count"]),
            }
            for month, b in sorted(self.monthly.items())
        ]

        country_sorted = _sorted(self.country, top_n)
        product_sorted = _sorted(self.product, top_n)
        category_sorted = _sorted(self.category, None)

        top_country = country_sorted[0]["name"] if country_sorted else "—"
        top_product = product_sorted[0]["name"] if product_sorted else "—"

        return {
            "meta": {
                "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "files_processed": self.files_processed,
                "row_count": self.row_count,
                "date_range": {"min": self._min_date, "max": self._max_date},
            },
            "kpi": {
                "total_value_usd": round(self.total_value, 2),
                "total_quantity": round(self.total_quantity, 2),
                "row_count": self.row_count,
                "unique_countries": len(self.country),
                "unique_products": len(self.product),
                "top_country": top_country,
                "top_product": top_product,
            },
            "monthly": monthly,
            "country": country_sorted,
            "category": category_sorted,
            "product": product_sorted,
            "table": self.table_preview[: self.table_limit],
        }


# ---------------------------------------------------------------------------
# File-level processing
# ---------------------------------------------------------------------------

def process_file(path: Path, agg: Aggregator, chunk_size: int) -> int:
    category = infer_category_from_filename(path.name)
    size_str = human_bytes(path.stat().st_size)
    logger.info("Processing %s (%s, category=%s)", path.name, size_str, category)

    rows_in_file = 0
    try:
        for raw_chunk in stream_workbook_chunks(path, chunk_size=chunk_size):
            unified = normalize_chunk(raw_chunk, category=category)
            agg.update(unified)
            rows_in_file += len(unified)
    except Exception as exc:
        logger.error("  ! failed on %s: %s", path.name, exc)
        logger.debug(traceback.format_exc())
        return rows_in_file

    logger.info("  ok — %d unified rows from %s", rows_in_file, path.name)
    return rows_in_file


def discover_xlsx(input_dir: Path) -> list[Path]:
    """Return sorted .xlsx files in `input_dir` (non-recursive, skips lock files)."""
    if not input_dir.exists():
        return []
    files = sorted(
        p for p in input_dir.glob("*.xlsx")
        if p.is_file() and not p.name.startswith("~$")
    )
    return files


# ---------------------------------------------------------------------------
# Sample fixture
# ---------------------------------------------------------------------------

def build_sample(final: dict, sample_rows: int) -> dict:
    """Trim full aggregate into a small fixture for offline dev."""
    return {
        "meta": {
            **final["meta"],
            "is_sample": True,
        },
        "kpi": final["kpi"],
        "monthly": final["monthly"][:12],
        "country": final["country"][:5],
        "category": final["category"][:5],
        "product": final["product"][:5],
        "table": final["table"][:sample_rows],
    }


# ---------------------------------------------------------------------------
# Core entry — reusable by watcher and future API
# ---------------------------------------------------------------------------

def run_pipeline(
    input_dir: Path = RAW_DATA_DIR,
    chunk_size: int = CHUNK_SIZE,
    table_rows: int = TABLE_ROWS,
    sample_rows: int = SAMPLE_ROWS,
) -> Optional[dict]:
    """Run the full pipeline once. Returns final aggregate dict, or None on no-op."""
    ensure_dirs()

    if not input_dir.exists():
        logger.error("Input folder does not exist: %s", input_dir)
        return None

    files = discover_xlsx(input_dir)
    if not files:
        logger.warning("No .xlsx files found in %s", input_dir)
        return None

    logger.info("Found %d xlsx file(s) in %s", len(files), input_dir)
    agg = Aggregator(table_limit=table_rows)
    t0 = time.time()

    for idx, path in enumerate(files, start=1):
        logger.info("[%d/%d] %s", idx, len(files), "-" * 40)
        process_file(path, agg, chunk_size=chunk_size)
        agg.files_processed += 1

    elapsed = time.time() - t0
    logger.info("=" * 60)
    logger.info(
        "Aggregation complete: %d rows across %d files in %.1fs",
        agg.row_count, agg.files_processed, elapsed,
    )

    final = agg.finalize(top_n=20)

    # Canonical copy
    PROCESSED_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with PROCESSED_JSON_PATH.open("w", encoding="utf-8") as f:
        json.dump(final, f, default=str, ensure_ascii=False, indent=2)
    logger.info("Wrote canonical JSON -> %s (%s)",
                PROCESSED_JSON_PATH,
                human_bytes(PROCESSED_JSON_PATH.stat().st_size))

    # Frontend copy (served by Vite at /data/final_data.json)
    FRONTEND_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    with FRONTEND_DATA_PATH.open("w", encoding="utf-8") as f:
        json.dump(final, f, default=str, ensure_ascii=False)  # compact
    logger.info("Wrote frontend JSON -> %s (%s)",
                FRONTEND_DATA_PATH,
                human_bytes(FRONTEND_DATA_PATH.stat().st_size))

    # Sample fixture — small, committed, renders UI without live pipeline
    sample = build_sample(final, sample_rows)
    with SAMPLE_DATA_PATH.open("w", encoding="utf-8") as f:
        json.dump(sample, f, default=str, ensure_ascii=False, indent=2)
    logger.info("Wrote sample fixture -> %s (%s)",
                SAMPLE_DATA_PATH,
                human_bytes(SAMPLE_DATA_PATH.stat().st_size))

    return final


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Volza trade data → aggregated JSON for React dashboard"
    )
    parser.add_argument(
        "--input", "-i", type=Path, default=RAW_DATA_DIR,
        help=f"Folder of .xlsx files (default: {RAW_DATA_DIR})",
    )
    parser.add_argument(
        "--chunk-size", type=int, default=CHUNK_SIZE,
        help=f"Rows per streaming chunk (default: {CHUNK_SIZE})",
    )
    parser.add_argument(
        "--table-rows", type=int, default=TABLE_ROWS,
        help=f"Rows in the dashboard table preview (default: {TABLE_ROWS})",
    )
    parser.add_argument(
        "--sample-rows", type=int, default=SAMPLE_ROWS,
        help=f"Rows in the sample fixture (default: {SAMPLE_ROWS})",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Enable debug logging",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.verbose:
        logger.setLevel(logging.DEBUG)

    result = run_pipeline(
        input_dir=args.input,
        chunk_size=args.chunk_size,
        table_rows=args.table_rows,
        sample_rows=args.sample_rows,
    )
    if result is None:
        return 1
    logger.info("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
