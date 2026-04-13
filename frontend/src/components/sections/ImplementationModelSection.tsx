import { Card } from "antd";
import {
  SolutionOutlined,
  ToolOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useFadeIn } from "../../hooks/useFadeIn";

const steps = [
  {
    icon: <SolutionOutlined />,
    step: "01",
    title: "Consulting",
    description:
      "We assess your current operations, identify gaps, and design a tailored Industry 4.0 roadmap aligned with your business goals.",
  },
  {
    icon: <ToolOutlined />,
    step: "02",
    title: "Implementation",
    description:
      "Our team deploys and integrates the XChart platform across your value chain with minimal disruption to ongoing operations.",
  },
  {
    icon: <CheckCircleOutlined />,
    step: "03",
    title: "Maintenance",
    description:
      "Continuous monitoring, optimization, and support ensure your systems evolve with your business and industry demands.",
  },
];

const ImplementationModelSection: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headingRef} className="fade-up mb-10 text-center sm:mb-14">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            How We Work
          </h3>
          <h2 className="mb-4 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            3-Step Implementation Model
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            A structured, proven approach to transforming your manufacturing
            operations.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid gap-6 sm:grid-cols-3"
          style={{ transitionDelay: "0.15s" }}
        >
          {steps.map((s) => (
            <Card
              key={s.title}
              className="glass-card border-card-border text-center"
              styles={{ body: { background: "transparent" } }}
            >
              <div className="mb-3 text-3xl text-primary">{s.icon}</div>
              <span className="mb-2 block text-xs font-bold tracking-widest uppercase text-text-muted">
                Step {s.step}
              </span>
              <h3 className="mb-3 text-lg font-semibold text-heading">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {s.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImplementationModelSection;
