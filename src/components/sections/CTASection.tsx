import { Button } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

interface CTASectionProps {
  heading?: string;
  subtext?: string;
  buttonLabel?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  heading = "Close the Gap",
  subtext = "Ready to bridge to Industry 4.0? Transform your solar manufacturing operations with real-time intelligence.",
  buttonLabel = "Request a Demo",
}) => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className="fade-up mx-auto max-w-3xl rounded-2xl bg-background-alt px-6 py-12 text-center sm:px-8 sm:py-16 md:px-16"
        >
          <h2 className="mb-3 text-2xl font-bold text-heading sm:mb-4 sm:text-3xl md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-text-secondary sm:mb-10 sm:text-lg">
            {subtext}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Button type="primary" size="large" className="w-full sm:w-auto">
              {buttonLabel}
            </Button>
            <span className="text-sm text-text-muted">
              or reach us at{" "}
              <a
                href="mailto:contact@xchart.in"
                className="text-primary underline transition-colors hover:text-primary-hover"
              >
                contact@xchart.in
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
