import { Button } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";
import heroImage from "/image-1.jpg";

const HomeHeroSection: React.FC = () => {
  const textRef = useFadeIn<HTMLDivElement>();
  const imageRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 sm:gap-12 md:grid-cols-2">
          {/* Text Content */}
          <div ref={textRef} className="fade-up flex flex-col gap-5 sm:gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl md:text-5xl lg:text-6xl">
              The Bridge to{" "}
              <span className="text-primary">Industry 4.0</span>
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              Transforming Solar Manufacturing into Intelligent, Autonomous
              Ecosystems.
            </p>
            <div>
              <Button type="primary" size="large" className="w-full sm:w-auto">
                Get Started
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            ref={imageRef}
            className="fade-up flex justify-center md:justify-end"
            style={{ transitionDelay: "0.15s" }}
          >
            <div className="glass-card overflow-hidden p-1.5 sm:p-2">
              <img
                src={heroImage}
                alt="Solar panel inspection in an industrial setting"
                className="w-full rounded-lg object-cover sm:max-w-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
