import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

const getCssVariable = (name: string): string =>
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: getCssVariable("--color-primary"),
    colorText: getCssVariable("--color-heading"),
    colorTextSecondary: getCssVariable("--color-text-secondary"),
    fontFamily: "Inter, sans-serif",
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimary: getCssVariable("--color-primary"),
      borderRadius: 8,
      controlHeight: 42,
    },
    Input: {
      colorBorder: getCssVariable("--color-card-border"),
      colorTextPlaceholder: getCssVariable("--color-text-muted"),
      borderRadius: 8,
      controlHeight: 42,
    },
    Select: {
      colorBorder: getCssVariable("--color-card-border"),
      colorTextPlaceholder: getCssVariable("--color-text-muted"),
      borderRadius: 8,
      controlHeight: 42,
    },
    Form: {},
    Card: {
      colorBorderSecondary: getCssVariable("--color-card-border"),
    },
    Statistic: {
      colorText: getCssVariable("--color-heading"),
    },
  },
};
