import { useFadeIn } from "../../hooks/useFadeIn";

const MarketIntelDashboardSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up text-center">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Dashboard Preview
          </h3>
          <h2 className="mb-10 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            Visualizing Market Intelligence
          </h2>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-card-border bg-background">
            <div className="flex aspect-[16/9] items-center justify-center">
              <span className="text-sm text-text-muted">
                Market Intelligence dashboard screenshot placeholder
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelDashboardSection;
