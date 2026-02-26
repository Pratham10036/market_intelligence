import { Button } from "antd";
import heroImage from "/image-1.jpg";

const HomeHeroSection: React.FC = () => {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
              The Bridge to{" "}
              <span className="text-primary">Industry 4.0</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-text-secondary">
              Transforming Solar Manufacturing into Intelligent, Autonomous
              Ecosystems.
            </p>
            <div>
              <Button type="primary" size="large">
                Get Started
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src={heroImage}
              alt="Solar panel inspection in an industrial setting"
              className="w-full max-w-lg rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
