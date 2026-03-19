import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import PageLoader from "./components/common/PageLoader";
import PublicOnlyRoute from "./components/routing/PublicOnlyRoute";
import RequireAuth from "./components/routing/RequireAuth";

// ── Lazy Layouts ──────────────────────────────────────────────────────────────
const AuthLayout = lazy(() => import("./components/layout/AuthLayout"));

// ── Auth pages ────────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/auth/SignUp"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));

// ── Public marketing pages ────────────────────────────────────────────────────
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const SolutionsPage = lazy(() => import("./pages/SolutionsPage"));
const MarketIntelligencePage = lazy(
  () => import("./pages/MarketIntelligencePage"),
);
const BusinessImpactPage = lazy(() => import("./pages/BusinessImpactPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// ── Protected app pages ───────────────────────────────────────────────────────
const DashboardPage = lazy(() => import("./pages/DashboardPage"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Auth routes: redirect to /dashboard if already authenticated ── */}
        <Route
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* ── All app routes: require authentication ── */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route
            path="/market-intelligence"
            element={<MarketIntelligencePage />}
          />
          <Route path="/business-impact" element={<BusinessImpactPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
