import SolutionsOverviewSection from "../components/sections/SolutionsOverviewSection";
import CTASection from "../components/sections/CTASection";

const SolutionsPage: React.FC = () => {
  return (
    <>
      <SolutionsOverviewSection />
      <CTASection
        heading="Find the Right Module for You"
        subtext="Explore how each XChart module can solve your specific operational challenges. Talk to our team for a tailored walkthrough."
        buttonLabel="Schedule a Walkthrough"
      />
    </>
  );
};

export default SolutionsPage;
