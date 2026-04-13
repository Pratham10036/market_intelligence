import { Card } from "antd";
import {
  DollarOutlined,
  ThunderboltOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useFadeIn } from "../../hooks/useFadeIn";

const blocks = [
  {
    icon: <DollarOutlined />,
    title: "Cost Efficiency",
    description:
      "Eliminate manual reporting overhead and reduce operational waste through automated intelligence. Our customers save an average of 8% on total manufacturing costs within the first year.",
  },
  {
    icon: <ThunderboltOutlined />,
    title: "Accelerated Operations",
    description:
      "Move from reactive firefighting to proactive decision making. Real-time visibility across the shop floor enables faster response to bottlenecks, defects, and demand shifts.",
  },
  {
    icon: <EyeOutlined />,
    title: "Complete Visibility",
    description:
      "A unified digital thread from MES to ERP gives leadership a single source of truth. From executive S&OP to shopfloor heatmaps — every layer is connected and actionable.",
  },
];

const BusinessImpactValueSection: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Customer Value
          </h3>
          <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            Why Leaders Choose XChart
          </h2>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid gap-6 sm:grid-cols-3"
          style={{ transitionDelay: "0.15s" }}
        >
          {blocks.map((b) => (
            <Card
              key={b.title}
              className="glass-card border-card-border"
              styles={{ body: { background: "transparent" } }}
            >
              <div className="mb-4 text-3xl text-primary">{b.icon}</div>
              <h3 className="mb-3 text-lg font-semibold text-heading">
                {b.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {b.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessImpactValueSection;
