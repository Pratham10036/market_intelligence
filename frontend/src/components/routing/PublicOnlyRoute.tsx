import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../common/PageLoader";

/**
 * Blocks authenticated users from accessing public-only pages (/login, /signup, etc.)
 * Shows a loader while the initial auth check is in progress.
 */
export default function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}
