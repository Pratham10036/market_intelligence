import { useFadeIn } from "../../hooks/useFadeIn";

const ContactMapSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={ref} className="fade-up">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-heading sm:text-3xl">
              Our Location
            </h2>
            <p className="text-base text-text-secondary">
              Based in Ahmedabad, Gujarat — serving solar manufacturers
              worldwide
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-card-border">
            <div className="h-64 sm:h-80 md:h-96">
              <iframe
                title="XChart Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.3!2d72.5614!3d23.0175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5a0a0a0a1%3A0x0!2sChandranagar%2C+Paldi%2C+Ahmedabad%2C+Gujarat+380007!5e0!3m2!1sen!2sin!4v1700000000000"
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMapSection;
