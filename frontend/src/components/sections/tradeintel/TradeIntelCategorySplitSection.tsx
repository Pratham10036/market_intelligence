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
  categories: TradeBucket[];
}

const TradeIntelCategorySplitSection: React.FC<Props> = ({ categories }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const { data, options } = useMemo(() => {
    const palette = getChartPalette();

    const chartData: ChartData<"doughnut"> = {
      labels: categories.map((c) => c.name),
      datasets: [
        {
          data: categories.map((c) => c.value),
          backgroundColor: palette.categoryPalette,
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
  }, [categories]);

  return (
    <div ref={ref} className="fade-up glass-card p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading sm:text-base">
          Category Split
        </h3>
        <p className="mt-1 text-xs text-text-muted sm:text-[0.8rem]">
          Value share by product category
        </p>
      </div>
      <div className="relative h-64 sm:h-72 lg:h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TradeIntelCategorySplitSection;
