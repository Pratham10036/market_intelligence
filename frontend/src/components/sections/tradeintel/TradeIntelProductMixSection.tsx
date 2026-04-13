import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeBucket } from "../../../types/tradeIntel";
import { fmtUSD } from "../../../utils/tradeFormat";
import {
  baseChartOptions,
  getChartPalette,
  tooltipStyle,
} from "../../../utils/chartTheme";

interface Props {
  products: TradeBucket[];
}

const TradeIntelProductMixSection: React.FC<Props> = ({ products }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const { data, options } = useMemo(() => {
    const palette = getChartPalette();
    const top = products.slice(0, 10);

    const chartData: ChartData<"doughnut"> = {
      labels: top.map((p) => p.name),
      datasets: [
        {
          data: top.map((p) => p.value),
          backgroundColor: palette.palette,
          borderColor: palette.background,
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };

    const chartOptions: ChartOptions<"doughnut"> = {
      ...(baseChartOptions() as ChartOptions<"doughnut">),
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            padding: 12,
            color: palette.textSecondary,
            font: { size: 11, family: "Inter, sans-serif" },
            usePointStyle: true,
          },
        },
        tooltip: {
          ...tooltipStyle(),
          displayColors: true,
          callbacks: {
            label: (ctx) =>
              " " + (ctx.label ?? "") + ": " + fmtUSD(Number(ctx.parsed)),
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [products]);

  return (
    <div ref={ref} className="fade-up glass-card p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading sm:text-base">
          Product Mix
        </h3>
        <p className="mt-1 text-xs text-text-muted sm:text-[0.8rem]">
          Top 10 HS4 codes by value
        </p>
      </div>
      <div className="relative h-64 sm:h-72 lg:h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TradeIntelProductMixSection;
