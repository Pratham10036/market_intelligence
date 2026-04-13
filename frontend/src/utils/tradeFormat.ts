const compactFmt = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const intFmt = new Intl.NumberFormat("en-US");

const fullDecimalFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const fmtCompact = (n: number): string => compactFmt.format(n);

export const fmtInt = (n: number): string => intFmt.format(Math.round(n));

export const fmtUSD = (n: number): string =>
  "$" + (n >= 1000 ? compactFmt.format(n) : fullDecimalFmt.format(n));

export const fmtMonthLabel = (ym: string): string => {
  // "2025-03" -> "Mar '25"
  const [y, m] = ym.split("-");
  if (!y || !m) return ym;
  const date = new Date(Number(y), Number(m) - 1, 1);
  if (Number.isNaN(date.getTime())) return ym;
  return date.toLocaleString("en-US", { month: "short", year: "2-digit" });
};
