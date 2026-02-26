import { Statistic } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

const outcomes = [
  { value: 30, suffix: "%", label: "Faster sourcing decisions" },
  { value: 15, suffix: "%", label: "Procurement cost reduction" },
  { value: 5, suffix: "x", label: "Competitive response speed" },
];

const MarketIntelOutcomeSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up">
          <div className="mb-10 text-center sm:mb-14">
            <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
              Strategic Outcomes
            </h3>
            <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
              Measurable Competitive Advantage
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {outcomes.map((o) => (
              <div key={o.label} className="glass-card p-6 text-center sm:p-8">
                <Statistic
                  value={o.value}
                  suffix={o.suffix}
                  valueStyle={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  }}
                />
                <p className="mt-2 text-sm font-medium text-text-secondary sm:mt-3">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelOutcomeSection;
