import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { useFadeIn } from "../../../hooks/useFadeIn";
import type { TradeMonthlyPoint } from "../../../types/tradeIntel";
import { fmtMonthLabel, fmtUSD } from "../../../utils/tradeFormat";
import {
  axisStyle,
  baseChartOptions,
  getChartPalette,
  tooltipStyle,
  verticalGradient,
} from "../../../utils/chartTheme";

interface Props {
  monthly: TradeMonthlyPoint[];
}

const TradeIntelMonthlyTrendSection: React.FC<Props> = ({ monthly }) => {
  const ref = useFadeIn<HTMLDivElement>();

  const { data, options } = useMemo(() => {
    const palette = getChartPalette();
    const labels = monthly.map((m) => fmtMonthLabel(m.month));
    const values = monthly.map((m) => m.value);

    const chartData: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: "Value (USD)",
          data: values,
          borderColor: palette.primary,
          backgroundColor: (ctx) =>
            verticalGradient(
              ctx,
              "rgba(0, 209, 255, 0.28)",
              "rgba(0, 209, 255, 0)",
            ),
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: palette.background,
          pointBorderColor: palette.primaryHover,
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    };

    const chartOptions: ChartOptions<"line"> = {
      ...(baseChartOptions() as ChartOptions<"line">),
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
  }, [monthly]);

  return (
    <div ref={ref} className="fade-up glass-card p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-heading sm:text-base">
          Monthly Trend — Value (USD)
        </h3>
        <p className="mt-1 text-xs text-text-muted sm:text-[0.8rem]">
          Rolling view of declared trade value over time
        </p>
      </div>
      <div className="relative h-64 sm:h-72 lg:h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TradeIntelMonthlyTrendSection;
