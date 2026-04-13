import { ConfigProvider } from "antd";
import { ThemeContext } from "./context";
import { lightTheme } from "../theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ themeName: "light" }}>
      <ConfigProvider theme={lightTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
