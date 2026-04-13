interface Props {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}

const accentStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(135deg, var(--color-primary) 0%, var(--color-navy) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const TradeIntelKpiCard: React.FC<Props> = ({ label, value, hint, accent }) => {
  return (
    <div className="glass-card flex h-full flex-col justify-between p-5 sm:p-6">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-text-muted sm:text-xs">
        {label}
      </div>
      <div
        className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-heading sm:text-3xl"
        style={accent ? accentStyle : undefined}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-text-muted sm:text-sm">{hint}</div>
    </div>
  );
};

export default TradeIntelKpiCard;
