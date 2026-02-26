import { Statistic } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

const stats = [
  {
    value: 40,
    suffix: "%",
    title: "Reporting Labor Reduction",
  },
  {
    value: 8,
    suffix: "%",
    title: "Cost Savings",
  },
  {
    value: 3,
    suffix: "x",
    title: "Throughput Improvement",
  },
  {
    value: 12,
    suffix: " Weeks",
    title: "Rapid Deployment",
  },
];

const ROICounterSection: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-bold text-heading sm:mb-4 sm:text-3xl md:text-4xl">
            Business Value & ROI
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Measurable operational improvement from day one.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4"
          style={{ transitionDelay: "0.15s" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="glass-card p-5 text-center sm:p-8"
            >
              <Statistic
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                }}
              />
              <p className="mt-2 text-xs font-medium text-text-secondary sm:mt-3 sm:text-sm">
                {stat.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ROICounterSection;
