import { Card } from "antd";
import {
  FundOutlined,
  RadarChartOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useFadeIn } from "../../hooks/useFadeIn";

const features = [
  {
    icon: <FundOutlined />,
    title: "Competitor Benchmarking",
    description:
      "Track competitor pricing, capacity, and market share in real time. Identify threats and opportunities before they impact your business.",
  },
  {
    icon: <RobotOutlined />,
    title: "AI-Powered Sourcing",
    description:
      "Leverage machine learning to optimize procurement decisions, predict material price movements, and recommend sourcing strategies.",
  },
  {
    icon: <RadarChartOutlined />,
    title: "Trend Analysis",
    description:
      "Monitor global trade flows, policy changes, and demand patterns across key solar markets with automated intelligence feeds.",
  },
];

const MarketIntelFeaturesSection: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Key Capabilities
          </h3>
          <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            Intelligence That Drives Action
          </h2>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid gap-6 sm:grid-cols-3"
          style={{ transitionDelay: "0.15s" }}
        >
          {features.map((f) => (
            <Card
              key={f.title}
              className="glass-card border-card-border"
              styles={{ body: { background: "transparent" } }}
            >
              <div className="mb-4 text-3xl text-primary">{f.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-heading">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketIntelFeaturesSection;
