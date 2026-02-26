import { useFadeIn } from "../../hooks/useFadeIn";

const VisionSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className="fade-up grid items-center gap-10 md:grid-cols-2"
        >
          {/* Image placeholder */}
          <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-card-border/30">
            <span className="text-sm text-text-muted">
              Industrial imagery placeholder
            </span>
          </div>

          {/* Vision text */}
          <div>
            <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
              Our Vision
            </h3>
            <h2 className="mb-6 text-2xl font-bold text-heading sm:text-3xl">
              Autonomous, Intelligent Shop Floors
            </h2>
            <p className="mb-4 text-base leading-relaxed text-text-secondary">
              We envision a future where every solar manufacturing facility
              operates as an intelligent, data-driven ecosystem — where
              real-time insights replace guesswork and autonomous systems
              optimize every process.
            </p>
            <p className="text-base leading-relaxed text-text-secondary">
              From raw material sourcing to finished product delivery, our
              platform enables complete digital thread visibility across
              operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
