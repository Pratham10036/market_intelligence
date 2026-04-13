import { Card, Button } from "antd";
import {
  BarChartOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useFadeIn } from "../../hooks/useFadeIn";

const modules = [
  {
    icon: <BarChartOutlined />,
    title: "Shopfloor Analytics",
    description:
      "Real-time production monitoring with AI-driven insights. Track yield, throughput, and equipment health across every line.",
    path: "/solutions/shopfloor-analytics",
  },
  {
    icon: <NodeIndexOutlined />,
    title: "Supply Chain Management",
    description:
      "End-to-end supply chain visibility from raw materials to finished goods. Optimize procurement cycles and reduce lead times.",
    path: "/solutions/supply-chain",
  },
  {
    icon: <DatabaseOutlined />,
    title: "Inventory & S&OP",
    description:
      "Intelligent demand planning and inventory optimization. Align sales forecasts with production capacity in real time.",
    path: "/solutions/inventory-sop",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Quality 4.0",
    description:
      "Predictive quality management reducing defects and ensuring compliance. Move from reactive inspection to proactive prevention.",
    path: "/solutions/quality",
  },
  {
    icon: <GlobalOutlined />,
    title: "Market Intelligence",
    description:
      "AI-powered competitor benchmarking and global market trend analysis. Make strategic sourcing decisions backed by data.",
    path: "/market-intelligence",
  },
];

const SolutionsOverviewSection: React.FC = () => {
  const navigate = useNavigate();
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Our Solutions
          </h3>
          <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            A Verticalized Suite for the Solar Value Chain
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Five integrated modules delivering intelligence across every layer
            of your operations — from shop floor to boardroom.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ transitionDelay: "0.15s" }}
        >
          {modules.map((mod) => (
            <Card
              key={mod.title}
              className="glass-card border-card-border"
              styles={{ body: { background: "transparent" } }}
            >
              <div className="mb-4 text-3xl text-primary">{mod.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-heading">
                {mod.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                {mod.description}
              </p>
              <Button type="link" className="p-0" onClick={() => navigate(mod.path)}>
                Learn More &rarr;
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsOverviewSection;
