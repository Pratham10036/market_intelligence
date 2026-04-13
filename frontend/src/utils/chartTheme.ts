/**
 * Chart.js theming — every colour is resolved from CSS variables declared in
 * `src/index.css` so the dashboard inherits the XChart palette automatically.
 * No hex values here.
 */
import type { ChartOptions, ChartType, ScriptableContext } from "chart.js";

const cssVar = (name: string, fallback = ""): string => {
  if (typeof window === "undefined") return fallback;
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

export const getChartPalette = () => {
  const primary = cssVar("--color-primary", "#00D1FF");
  const primaryHover = cssVar("--color-primary-hover", "#00B8E6");
  const navy = cssVar("--color-navy", "#0F2438");
  const heading = cssVar("--color-heading", "#111827");
  const textSecondary = cssVar("--color-text-secondary", "#374151");
  const textMuted = cssVar("--color-text-muted", "#6B7280");
  const cardBorder = cssVar("--color-card-border", "#E5E7EB");
  const background = cssVar("--color-background", "#FFFFFF");

  // Gradient-friendly palette — stays within the XChart cool/navy range.
  // Used for product/category doughnuts and bar fills.
  const palette = [
    primary,
    navy,
    "#22D3EE",
    "#0EA5E9",
    "#1F2937",
    "#38BDF8",
    "#64748B",
    "#06B6D4",
    "#0369A1",
    "#94A3B8",
  ];

  const categoryPalette = [primary, navy, "#22D3EE", "#0EA5E9", "#64748B"];

  return {
    primary,
    primaryHover,
    navy,
    heading,
    textSecondary,
    textMuted,
    cardBorder,
    background,
    palette,
    categoryPalette,
  };
};

/**
 * Build a vertical linear gradient from two colours. Returns `from` until the
 * chart has a layout (first render tick).
 */
export const verticalGradient = <T extends ChartType>(
  ctx: ScriptableContext<T>,
  from: string,
  to: string,
): CanvasGradient | string => {
  const { chart } = ctx;
  const { chartArea, ctx: canvasCtx } = chart;
  if (!chartArea) return from;
  const g = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  return g;
};

export const tooltipStyle = () => ({
  backgroundColor: "rgba(15, 36, 56, 0.95)",
  titleColor: "#FFFFFF",
  bodyColor: "#E5E7EB",
  borderColor: "rgba(0, 209, 255, 0.35)",
  borderWidth: 1,
  padding: 12,
  cornerRadius: 10,
  displayColors: false as const,
  boxPadding: 6,
  titleFont: { weight: 600 as const, family: "Inter, sans-serif" },
  bodyFont: { family: "Inter, sans-serif" },
});

export const axisStyle = (palette: ReturnType<typeof getChartPalette>) => ({
  ticks: { color: palette.textMuted, font: { family: "Inter, sans-serif" } },
  grid: { color: "rgba(17, 24, 39, 0.06)" },
  border: { display: false },
});

/**
 * Shared defaults for responsive Chart.js charts inside glass cards.
 */
export const baseChartOptions = (): Partial<ChartOptions> => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 4 },
  interaction: { mode: "index", intersect: false },
});
