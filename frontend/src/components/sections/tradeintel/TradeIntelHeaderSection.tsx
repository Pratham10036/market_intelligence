import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeMeta } from "../../../types/tradeIntel";
import { fmtInt } from "../../../utils/tradeFormat";

interface Props {
  meta: TradeMeta;
  isSample?: boolean;
}

const TradeIntelHeaderSection: React.FC<Props> = ({ meta, isSample }) => {
  const ref = useFadeIn<HTMLDivElement>();
  const range = meta.date_range || {};

  const pillParts: string[] = [];
  if (range.min && range.max) pillParts.push(`${range.min} → ${range.max}`);
  pillParts.push(`${fmtInt(meta.row_count || 0)} rows`);
  pillParts.push(`${meta.files_processed || 0} files`);
  if (isSample) pillParts.push("sample data");

  return (
    <section className="relative pb-6 pt-10 sm:pb-8 sm:pt-14 lg:pb-10 lg:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className="fade-up flex flex-col items-start justify-between gap-4 sm:gap-5 lg:flex-row lg:items-end"
        >
          <div className="min-w-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary sm:mb-3 sm:text-sm">
              XChart · Market Intelligence
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-heading sm:text-4xl md:text-5xl">
              Trade Intelligence Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base lg:text-lg">
              Volza import / export records — aggregated snapshot across the
              solar manufacturing value chain.
            </p>
          </div>

          <div className="glass-card inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs text-text-secondary sm:text-sm">
            <span
              className="inline-block h-2 w-2 rounded-full bg-primary"
              style={{ boxShadow: "0 0 0 4px rgba(0, 209, 255, 0.18)" }}
              aria-hidden="true"
            />
            <span className="truncate">{pillParts.join(" • ")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeIntelHeaderSection;
