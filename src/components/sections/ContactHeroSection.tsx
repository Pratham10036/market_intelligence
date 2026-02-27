import { useFadeIn } from "../../hooks/useFadeIn";

const ContactHeroSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up mx-auto max-w-3xl text-center">
          <h3 className="mb-3 text-sm font-semibold tracking-widest uppercase text-primary">
            Contact Us
          </h3>
          <h1 className="mb-6 text-3xl font-bold text-heading sm:text-4xl md:text-5xl">
            Let's Start a Conversation
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
            Whether you're exploring Industry 4.0 solutions or ready to
            transform your solar manufacturing operations, our team is here to
            help.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHeroSection;
