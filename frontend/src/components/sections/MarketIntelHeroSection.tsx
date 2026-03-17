import { Button } from "antd";
import { useNavigate } from "react-router";
import { useFadeIn } from "../../hooks/useFadeIn";

const MarketIntelHeroSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up mx-auto max-w-3xl text-center">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Market Intelligence
          </h3>
          <h1 className="mb-6 text-3xl font-bold text-heading sm:text-4xl md:text-5xl">
            Navigate Global Markets with AI-Powered Insights
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Make strategic sourcing and competitive decisions backed by
            real-time data, trend analysis, and predictive intelligence.
          </p>
          <Button type="primary" size="large" onClick={() => navigate("/contact")}>
            Request a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelHeroSection;
