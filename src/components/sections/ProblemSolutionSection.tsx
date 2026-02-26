import { Card } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

const challenges = [
  "Siloed systems across the value chain",
  "Reactive operations with no predictive insight",
  "Manual reporting causing delays and errors",
  "Lack of unified data visibility",
];

const solutions = [
  "Unified digital thread across operations",
  "AI-enabled modules for intelligent decisions",
  "Autonomous ecosystems driving efficiency",
  "Real-time visibility from shop floor to boardroom",
];

const ProblemSolutionSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up grid gap-6 sm:gap-8 md:grid-cols-2">
          {/* The Challenge */}
          <Card className="border-card-border">
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase text-text-muted sm:mb-6">
              The Challenge
            </h3>
            <h2 className="mb-4 text-xl font-bold text-heading sm:mb-6 sm:text-2xl">
              Legacy Systems Hold You Back
            </h2>
            <ul className="flex flex-col gap-3 sm:gap-4">
              {challenges.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-text-muted" />
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* The XChart Solution */}
          <Card className="border-card-border">
            <h3 className="mb-4 text-sm font-semibold tracking-widest uppercase text-primary sm:mb-6">
              The XChart Solution
            </h3>
            <h2 className="mb-4 text-xl font-bold text-heading sm:mb-6 sm:text-2xl">
              Intelligence at Every Level
            </h2>
            <ul className="flex flex-col gap-3 sm:gap-4">
              {solutions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
