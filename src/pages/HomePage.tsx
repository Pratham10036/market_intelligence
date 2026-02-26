import HomeHeroSection from "../components/sections/HomeHeroSection";
import ProblemSolutionSection from "../components/sections/ProblemSolutionSection";
import ModulesSection from "../components/sections/ModulesSection";
import ROICounterSection from "../components/sections/ROICounterSection";
import CTASection from "../components/sections/CTASection";

const HomePage: React.FC = () => {
  return (
    <>
      <HomeHeroSection />
      <ProblemSolutionSection />
      <ModulesSection />
      <ROICounterSection />
      <CTASection />
    </>
  );
};

export default HomePage;
