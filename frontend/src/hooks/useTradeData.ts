import { useEffect, useState } from "react";
import type { TradeData } from "../types/tradeIntel";

type State =
  | { status: "loading"; data: null; error: null; isSample: false }
  | { status: "ready"; data: TradeData; error: null; isSample: boolean }
  | { status: "error"; data: null; error: Error; isSample: false };

const LIVE_URL = "/data/final_data.json";
const SAMPLE_URL = "/data/final_data.sample.json";

async function fetchJson(url: string): Promise<TradeData> {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return (await res.json()) as TradeData;
}

export function useTradeData() {
  const [state, setState] = useState<State>({
    status: "loading",
    data: null,
    error: null,
    isSample: false,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchJson(LIVE_URL);
        if (cancelled) return;
        setState({
          status: "ready",
          data,
          error: null,
          isSample: Boolean(data.meta?.is_sample),
        });
      } catch {
        try {
          const data = await fetchJson(SAMPLE_URL);
          if (cancelled) return;
          setState({ status: "ready", data, error: null, isSample: true });
        } catch (sampleErr) {
          if (cancelled) return;
          setState({
            status: "error",
            data: null,
            error:
              sampleErr instanceof Error
                ? sampleErr
                : new Error(String(sampleErr)),
            isSample: false,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
