import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeBucket } from "../../../types/tradeIntel";
import { fmtUSD } from "../../../utils/tradeFormat";
import {
  axisStyle,
  baseChartOptions,
  getChartPalette,
  tooltipStyle,
  verticalGradient,
} from "../../../utils/chartTheme";

interface Props {
  countries: TradeBucket[];
}

const TradeIntelTopCountriesSection: React.FC<Props> = ({ countries }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const { data, options } = useMemo(() => {
    const palette = getChartPalette();
    const top = countries.slice(0, 10);

    const chartData: ChartData<"bar"> = {
      labels: top.map((c) => c.name),
      datasets: [
        {
          label: "Value (USD)",
          data: top.map((c) => c.value),
          backgroundColor: (ctx) =>
            verticalGradient(ctx, palette.primary, "rgba(0, 209, 255, 0.35)"),
          hoverBackgroundColor: (ctx) =>
            verticalGradient(
              ctx,
              palette.primaryHover,
              "rgba(0, 184, 230, 0.55)",
            ),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };

    const chartOptions: ChartOptions<"bar"> = {
      ...(baseChartOptions() as ChartOptions<"bar">),
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(),
          callbacks: {
            label: (ctx) => " " + fmtUSD(Number(ctx.parsed.y)),
          },
        },
      },
      scales: {
        x: {
          ...axisStyle(palette),
          grid: { display: false },
        },
        y: {
          ...axisStyle(palette),
          ticks: {
            ...axisStyle(palette).ticks,
            callback: (v) => fmtUSD(Number(v)),
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [countries]);

  return (
    <div ref={ref} className="fade-up glass-card p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading sm:text-base">
          Top Countries by Value
        </h3>
        <p className="mt-1 text-xs text-text-muted sm:text-[0.8rem]">
          Top 10 origin markets in USD
        </p>
      </div>
      <div className="relative h-64 sm:h-72 lg:h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TradeIntelTopCountriesSection;
