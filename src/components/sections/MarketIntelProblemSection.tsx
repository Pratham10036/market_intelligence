import { useFadeIn } from "../../hooks/useFadeIn";

const problems = [
  {
    title: "Price Volatility",
    description:
      "Raw material costs swing unpredictably, eroding margins and making long-term planning nearly impossible.",
  },
  {
    title: "Opaque Competition",
    description:
      "Competitors' pricing, capacity expansions, and strategic moves remain invisible until it's too late to respond.",
  },
  {
    title: "Fragmented Data",
    description:
      "Market insights are scattered across reports, news feeds, and siloed databases — no single source of truth.",
  },
];

const MarketIntelProblemSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up">
          <div className="mb-10 text-center sm:mb-14">
            <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-text-muted">
              The Problem
            </h3>
            <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
              Global Volatility Demands Better Intelligence
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {problems.map((p) => (
              <div key={p.title} className="glass-card p-6 sm:p-8">
                <h3 className="mb-3 text-lg font-semibold text-heading">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelProblemSection;
