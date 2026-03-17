import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

const getCssVariable = (name: string): string =>
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: getCssVariable("--color-primary"),
    colorText: getCssVariable("--color-heading"),
    colorTextSecondary: getCssVariable("--color-text-secondary"),
    colorBgBase: getCssVariable("--color-background"),
    colorBorder: getCssVariable("--color-card-border"),
    fontFamily: "Inter, sans-serif",
    borderRadius: 8,
    controlOutline: "rgba(0, 209, 255, 0.1)",
    colorPrimaryBorder: getCssVariable("--color-primary"),
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 42,
    },
    Input: {
      colorBgContainer: getCssVariable("--color-input-bg"),
      colorBorder: getCssVariable("--color-card-border"),
      colorTextPlaceholder: getCssVariable("--color-text-muted"),
      borderRadius: 8,
      controlHeight: 42,
      activeShadow: "0 0 0 3px rgba(0, 209, 255, 0.1)",
    },
    Select: {
      colorBgContainer: getCssVariable("--color-input-bg"),
      colorBorder: getCssVariable("--color-card-border"),
      colorTextPlaceholder: getCssVariable("--color-text-muted"),
      borderRadius: 8,
      controlHeight: 42,
    },
    Form: {
      labelColor: getCssVariable("--color-text-secondary"),
    },
    Card: {
      colorBgContainer: "transparent",
      colorBorderSecondary: getCssVariable("--color-card-border"),
    },
    Statistic: {
      colorText: getCssVariable("--color-heading"),
    },
    Menu: {
      colorBgContainer: "transparent",
      colorItemText: getCssVariable("--color-text-secondary"),
      colorItemTextSelected: getCssVariable("--color-primary"),
      colorItemBgSelected: getCssVariable("--color-card-bg"),
    },
    Drawer: {
      colorBgElevated: getCssVariable("--color-background"),
    },
    Checkbox: {
      colorBgContainer: getCssVariable("--color-input-bg"),
      colorBorder: getCssVariable("--color-card-border"),
    },
  },
};
