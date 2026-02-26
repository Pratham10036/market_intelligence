import { Card } from "antd";
import {
  BarChartOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

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
  return (
    <section className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold text-heading md:text-4xl">
            A Verticalized Suite for the Solar Value Chain
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-secondary">
            Five integrated modules delivering intelligence across every layer
            of your operations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Card
              key={mod.title}
              hoverable
              className="border-card-border transition-shadow duration-200"
            >
              <div className="mb-4 text-3xl text-primary">{mod.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-heading">
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
