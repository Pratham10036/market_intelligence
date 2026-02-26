import BusinessImpactHeroSection from "../components/sections/BusinessImpactHeroSection";
import BusinessImpactStatsSection from "../components/sections/BusinessImpactStatsSection";
import BusinessImpactValueSection from "../components/sections/BusinessImpactValueSection";
import CTASection from "../components/sections/CTASection";

const BusinessImpactPage: React.FC = () => {
  return (
    <>
      <BusinessImpactHeroSection />
      <BusinessImpactStatsSection />
      <BusinessImpactValueSection />
      <CTASection
        heading="Ready to See the Impact?"
        subtext="Discover how XChart can drive measurable ROI across your solar manufacturing operations."
        buttonLabel="Talk to Our Team"
      />
    </>
  );
};

export default BusinessImpactPage;
