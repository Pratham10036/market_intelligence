import { Statistic } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

const stats = [
  { value: 40, suffix: "%", label: "Reporting Labor Reduction" },
  { value: 8, suffix: "%", label: "Overall Cost Savings" },
  { value: 3, suffix: "x", label: "Throughput Improvement" },
  { value: 12, suffix: " Weeks", label: "Rapid Deployment" },
  { value: 95, suffix: "%", label: "Data Accuracy" },
  { value: 60, suffix: "%", label: "Faster Decision Cycles" },
];

const BusinessImpactStatsSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
              The Numbers Speak
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Proven outcomes across solar manufacturing operations worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-5 text-center sm:p-8">
                <Statistic
                  value={s.value}
                  suffix={s.suffix}
                  valueStyle={{
                    color: "var(--color-primary)",
                    fontWeight: 700,
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  }}
                />
                <p className="mt-2 text-xs font-medium text-text-secondary sm:mt-3 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessImpactStatsSection;
