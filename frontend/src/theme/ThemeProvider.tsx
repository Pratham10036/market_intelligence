import { ConfigProvider } from "antd";
import { ThemeContext } from "./context";
import { darkTheme } from "../theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ themeName: "dark" }}>
      <ConfigProvider theme={darkTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
