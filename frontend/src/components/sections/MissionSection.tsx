import { useFadeIn } from "../../hooks/useFadeIn";

const MissionSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up mx-auto max-w-3xl text-center">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Our Mission
          </h3>
          <h2 className="mb-6 text-2xl font-bold text-heading sm:text-3xl md:text-4xl">
            Bridging Traditional Manufacturing with Industry 4.0
          </h2>
          <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
            We bridge traditional solar manufacturing with AI-driven Industry
            4.0 ecosystems — enabling leaders to move from reactive operations to
            intelligent, data-driven decision making across the entire value
            chain.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
