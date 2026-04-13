"""
watch.py — filesystem watcher that auto-rebuilds the dashboard dataset.

Usage
-----
    python -m app.pipeline.watch

Behavior
--------
1. Runs the full pipeline once at startup so the dashboard has data ready.
2. Watches RAW_DATA_DIR non-recursively for .xlsx add / modify / delete /
   move events. Ignores Excel lock files (`~$*.xlsx`).
3. Debounces events (default 2s) so a partial write during download doesn't
   trigger multiple rebuilds back-to-back.
4. Re-runs the pipeline in-process on each debounced event; logs every run.
5. Ctrl-C to stop.
"""
from __future__ import annotations

import threading
import time
from pathlib import Path

try:
    from watchdog.events import FileSystemEventHandler, FileSystemEvent
    from watchdog.observers import Observer
except ImportError:
    raise SystemExit(
        "watchdog is not installed. Run: pip install -r requirements.txt"
    )

from .preprocess import run_pipeline
from .utils import RAW_DATA_DIR, WATCH_DEBOUNCE_SEC, setup_logger

logger = setup_logger()


def _is_xlsx(path_str: str) -> bool:
    p = Path(path_str)
    return p.suffix.lower() == ".xlsx" and not p.name.startswith("~$")


class DebouncedRebuildHandler(FileSystemEventHandler):
    """Coalesces xlsx events into a single rebuild after `debounce_sec`."""

    def __init__(self, debounce_sec: int) -> None:
        super().__init__()
        self.debounce_sec = debounce_sec
        self._timer: threading.Timer | None = None
        self._lock = threading.Lock()
        self._pending_events: list[str] = []

    def on_any_event(self, event: FileSystemEvent) -> None:
        if event.is_directory:
            return

        # `event.src_path` covers created/modified/deleted; `dest_path`
        # appears on moves (File Explorer rename). Accept either.
        paths = [event.src_path]
        dest = getattr(event, "dest_path", None)
        if dest:
            paths.append(dest)

        if not any(_is_xlsx(str(p)) for p in paths):
            return

        with self._lock:
            self._pending_events.append(f"{event.event_type} {event.src_path}")
            if self._timer is not None:
                self._timer.cancel()
            self._timer = threading.Timer(self.debounce_sec, self._rebuild)
            self._timer.daemon = True
            self._timer.start()

    def _rebuild(self) -> None:
        with self._lock:
            events = self._pending_events[:]
            self._pending_events.clear()
            self._timer = None

        logger.info("=" * 60)
        logger.info("Rebuild triggered by %d event(s):", len(events))
        for e in events[:5]:  # cap log spam
            logger.info("  • %s", e)
        if len(events) > 5:
            logger.info("  • (+%d more)", len(events) - 5)

        try:
            run_pipeline()
        except Exception as exc:  # keep watcher alive through pipeline errors
            logger.error("Pipeline run failed: %s", exc, exc_info=True)


def start_watcher(watch_dir: Path = RAW_DATA_DIR,
                  debounce_sec: int = WATCH_DEBOUNCE_SEC) -> None:
    """Block until Ctrl-C; re-runs pipeline on any xlsx change."""
    watch_dir = watch_dir.resolve()
    watch_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Running initial pipeline pass…")
    try:
        run_pipeline()
    except Exception as exc:
        logger.error("Initial pipeline run failed: %s", exc, exc_info=True)

    logger.info("=" * 60)
    logger.info("Watching %s (debounce=%ds). Ctrl-C to stop.",
                watch_dir, debounce_sec)

    handler = DebouncedRebuildHandler(debounce_sec=debounce_sec)
    observer = Observer()
    observer.schedule(handler, str(watch_dir), recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Stopping watcher…")
        observer.stop()
    observer.join()
    logger.info("Watcher stopped.")


def main() -> int:
    start_watcher()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
