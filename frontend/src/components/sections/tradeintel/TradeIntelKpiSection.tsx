import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeKpi } from "../../../types/tradeIntel";
import { fmtCompact, fmtInt, fmtUSD } from "../../../utils/tradeFormat";
import TradeIntelKpiCard from "./TradeIntelKpiCard";

interface Props {
  kpi: TradeKpi;
}

const TradeIntelKpiSection: React.FC<Props> = ({ kpi }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const cards = [
    {
      label: "Total CIF Value",
      value: fmtUSD(kpi.total_value_usd || 0),
      hint: "Sum of declared values",
      accent: true,
    },
    {
      label: "Total Quantity",
      value: fmtCompact(kpi.total_quantity || 0),
      hint: "Standardized units",
      accent: true,
    },
    {
      label: "Top Country",
      value: kpi.top_country || "—",
      hint: "Highest value origin",
    },
    {
      label: "Top HS4 Product",
      value: kpi.top_product || "—",
      hint: "By total value",
    },
    {
      label: "Unique Countries",
      value: fmtInt(kpi.unique_countries || 0),
      hint: "Distinct origins",
    },
    {
      label: "Records Ingested",
      value: fmtInt(kpi.row_count || 0),
      hint: "Across all files",
    },
  ];

  return (
    <section className="pb-6 sm:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className="fade-up grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6"
        >
          {cards.map((c) => (
            <TradeIntelKpiCard key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradeIntelKpiSection;
