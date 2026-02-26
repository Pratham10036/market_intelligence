import MarketIntelHeroSection from "../components/sections/MarketIntelHeroSection";
import MarketIntelProblemSection from "../components/sections/MarketIntelProblemSection";
import MarketIntelFeaturesSection from "../components/sections/MarketIntelFeaturesSection";
import MarketIntelDashboardSection from "../components/sections/MarketIntelDashboardSection";
import MarketIntelOutcomeSection from "../components/sections/MarketIntelOutcomeSection";
import CTASection from "../components/sections/CTASection";

const MarketIntelligencePage: React.FC = () => {
  return (
    <>
      <MarketIntelHeroSection />
      <MarketIntelProblemSection />
      <MarketIntelFeaturesSection />
      <MarketIntelDashboardSection />
      <MarketIntelOutcomeSection />
      <CTASection
        heading="Stay Ahead of the Market"
        subtext="Get real-time competitive intelligence and AI-powered sourcing insights tailored to your solar manufacturing business."
        buttonLabel="Get Market Insights"
      />
    </>
  );
};

export default MarketIntelligencePage;
