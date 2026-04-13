import { Card } from "antd";
import {
  BarChartOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useFadeIn } from "../../hooks/useFadeIn";

const modules = [
  {
    icon: <BarChartOutlined />,
    title: "Shopfloor Analytics",
    description:
      "Real-time production monitoring with AI-driven insights for maximum throughput.",
  },
  {
    icon: <NodeIndexOutlined />,
    title: "Supply Chain Management",
    description:
      "End-to-end supply chain visibility from raw materials to finished goods.",
  },
  {
    icon: <DatabaseOutlined />,
    title: "Inventory & S&OP",
    description:
      "Intelligent demand planning and inventory optimization across operations.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Quality 4.0",
    description:
      "Predictive quality management reducing defects and ensuring compliance.",
  },
  {
    icon: <GlobalOutlined />,
    title: "Market Intelligence",
    description:
      "AI-powered competitor benchmarking and global market trend analysis.",
  },
];

const ModulesSection: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h2 className="mb-3 text-2xl font-bold text-heading sm:mb-4 sm:text-3xl md:text-4xl">
            A Verticalized Suite for the Solar Value Chain
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Five integrated modules delivering intelligence across every layer
            of your operations.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          style={{ transitionDelay: "0.15s" }}
        >
          {modules.map((mod) => (
            <Card
              key={mod.title}
              hoverable
              className="glass-card border-card-border"
              styles={{ body: { background: "transparent" } }}
            >
              <div className="mb-3 text-2xl text-primary sm:mb-4 sm:text-3xl">
                {mod.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-heading sm:text-lg">
                {mod.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {mod.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
