import { Card } from "antd";

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
  return (
    <section className="bg-background-alt py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* The Challenge */}
          <Card className="border-card-border">
            <h3 className="mb-6 text-sm font-semibold tracking-widest uppercase text-text-muted">
              The Challenge
            </h3>
            <h2 className="mb-6 text-2xl font-bold text-heading">
              Legacy Systems Hold You Back
            </h2>
            <ul className="flex flex-col gap-4">
              {challenges.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-text-muted" />
                  <span className="text-base leading-relaxed text-text-secondary">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* The XChart Solution */}
          <Card className="border-card-border">
            <h3 className="mb-6 text-sm font-semibold tracking-widest uppercase text-primary">
              The XChart Solution
            </h3>
            <h2 className="mb-6 text-2xl font-bold text-heading">
              Intelligence at Every Level
            </h2>
            <ul className="flex flex-col gap-4">
              {solutions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <span className="text-base leading-relaxed text-text-secondary">
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
