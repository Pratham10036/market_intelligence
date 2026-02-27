import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SolutionsPage = lazy(() => import("./pages/SolutionsPage"));
const MarketIntelligencePage = lazy(() => import("./pages/MarketIntelligencePage"));
const BusinessImpactPage = lazy(() => import("./pages/BusinessImpactPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
          <Route path="/business-impact" element={<BusinessImpactPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
