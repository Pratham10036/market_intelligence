# Market Intelligence — Backend Pipeline

Python pipeline that turns a folder of Volza `.xlsx` trade files into a single aggregated JSON dataset served to the React dashboard at `/market-intelligence/dashboard`.

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
cp .env.example .env            # adjust paths if needed

# One-shot run
python -m app.pipeline.preprocess

# Auto-update daemon (rebuilds on every xlsx change)
python -m app.pipeline.watch
```

Drop `.xlsx` files into `data/raw/` — the watcher debounces and rebuilds. Output lands at `../frontend/public/data/final_data.json`, served by Vite to the React dashboard.

## Layout

```
backend/
├── app/pipeline/
│   ├── preprocess.py     CLI + `run_pipeline()` orchestrator
│   ├── transform.py      openpyxl streaming + schema unification
│   ├── utils.py          paths, logging, env loading, cleaning helpers
│   └── watch.py          watchdog-based auto-rebuild daemon
├── data/
│   ├── raw/              drop xlsx files here (gitignored)
│   └── processed/        canonical final_data.json (gitignored)
├── logs/                 rotating pipeline.log (gitignored)
├── .env.example          committed template
├── .env                  your local overrides (gitignored)
└── requirements.txt
```

## Configuration

All settings come from `.env` (with CLI-flag override on `preprocess`):

| Key | Default | Description |
|---|---|---|
| `RAW_DATA_DIR` | `./data/raw` | Folder watched for .xlsx files |
| `PROCESSED_DIR` | `./data/processed` | Canonical JSON output folder |
| `FRONTEND_DATA_PATH` | `../frontend/public/data/final_data.json` | Served to React |
| `SAMPLE_DATA_PATH` | `../frontend/public/data/final_data.sample.json` | Committed fixture |
| `LOG_DIR` | `./logs` | Rotating file logs |
| `CHUNK_SIZE` | `5000` | Rows per streaming chunk |
| `TABLE_ROWS` | `100` | Rows in dashboard table preview |
| `SAMPLE_ROWS` | `10` | Rows in sample fixture |
| `WATCH_DEBOUNCE_SEC` | `2` | Seconds to coalesce rapid events |

## How it stays memory-safe

- **openpyxl read-only streaming** — workbooks never fully materialize.
- **Chunked DataFrames** — default 5k rows buffered, folded into running totals, then discarded.
- **Cardinality-bounded aggregates** — KPI totals and per-country/product/month buckets grow with unique keys, not row count.
- **Best-effort per file** — a single bad workbook is logged and skipped; the rest still complete.

## Unified schema

Every row coming out of `transform.normalize_chunk`:

```json
{
  "date":        "YYYY-MM-DD",
  "product":     "8541",
  "category":    "Solar Module",
  "country":     "China",
  "value":       123456.78,
  "quantity":    450,
  "description": "..."
}
```

Raw column variants (`Estimated CIF Value $` vs `Value $`, `Consignee` vs `Consignee Name`, etc.) map to this schema via the alias table in `transform.py`.

## Output JSON

```json
{
  "meta":     { "generated_at": "...", "row_count": 0, "date_range": {...} },
  "kpi":      { "total_value_usd": 0, "top_country": "...", ... },
  "monthly":  [ { "month": "2025-01", "value": 0, "quantity": 0, "count": 0 } ],
  "country":  [ { "name": "CHINA", "value": 0, ... } ],
  "category": [ ... ],
  "product":  [ ... ],
  "table":    [ { "date": "...", "product": "...", ... } ]
}
```

## Development notes

- Scripts are packaged under `app/pipeline` so they import cleanly from a future FastAPI app (`from app.pipeline.preprocess import run_pipeline`).
- The sample fixture is intentionally small (~2KB) and committed so the React dashboard renders immediately on checkout, before any pipeline run.
- Excel lock files (`~$*.xlsx`) are filtered automatically.
