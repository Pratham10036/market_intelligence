import { useFadeIn } from "../hooks/useFadeIn";

const dashboards = [
  {
    src: "/image_dashboard-1.jpg",
    alt: "XChart Shopfloor Analytics Dashboard",
  },
  {
    src: "/Image-dashboard-2.jpg",
    alt: "XChart Executive Control Tower Dashboard",
  },
];

const DashboardPage: React.FC = () => {
  const headingRef = useFadeIn<HTMLDivElement>();
  const gridRef = useFadeIn<HTMLDivElement>();

  return (
    <section className="bg-background py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={headingRef}
          className="fade-up mx-auto mb-12 max-w-3xl text-center sm:mb-16 md:mb-20"
        >
          <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-heading sm:text-5xl md:text-6xl">
            Visualizing the Intelligence
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl">
            Real-time dashboards that unify shopfloor analytics, supply chain
            visibility, and executive decision-making into a single pane of
            glass.
          </p>
        </div>

        <div
          ref={gridRef}
          className="fade-up grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10"
          style={{ transitionDelay: "0.15s" }}
        >
          {dashboards.map((d) => (
            <div
              key={d.src}
              className="group overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-sm transition-shadow duration-300 ease-out hover:shadow-lg"
            >
              <img
                src={d.src}
                alt={d.alt}
                className="block h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
