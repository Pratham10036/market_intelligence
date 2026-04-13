import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useFadeIn } from "../../hooks/useFadeIn";

const MarketIntelDashboardSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up text-center">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Dashboard Preview
          </h3>
          <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            Visualizing Market Intelligence
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base md:text-lg">
            Real-time KPIs, product mix, country-of-origin analysis, and
            monthly trend — all unified from your Volza trade datasets.
          </p>

          <div
            className="group mx-auto mb-8 max-w-4xl cursor-pointer overflow-hidden rounded-xl border border-card-border bg-background shadow-sm transition-shadow duration-300 hover:shadow-lg"
            onClick={() => navigate("/market-intelligence/dashboard")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/market-intelligence/dashboard");
              }
            }}
          >
            <div
              className="flex aspect-[16/9] flex-col items-center justify-center gap-3 p-6 transition-transform duration-300 ease-out group-hover:scale-[1.01]"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 20% 20%, rgba(0, 209, 255, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 80% 80%, rgba(15, 36, 56, 0.08) 0%, transparent 60%), var(--color-background)",
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                XChart · Trade Intelligence
              </div>
              <div className="text-xl font-bold text-heading sm:text-2xl md:text-3xl">
                Live aggregated insights
              </div>
              <div className="max-w-md text-xs text-text-muted sm:text-sm">
                Interactive KPIs · monthly trend · product mix · country
                rankings · category split
              </div>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
            onClick={() => navigate("/market-intelligence/dashboard")}
          >
            See Live Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelDashboardSection;
