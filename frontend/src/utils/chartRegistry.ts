/**
 * One-time Chart.js registration. Import this module once from anywhere (the
 * dashboard page) so the controllers / elements are available for every chart.
 */
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.color = "rgba(55, 65, 81, 0.85)";
Chart.defaults.borderColor = "rgba(17, 24, 39, 0.06)";
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
