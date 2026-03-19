import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import PageLoader from "../common/PageLoader";

/**
 * Redirects unauthenticated users to /login.
 * Shows a loader while the initial auth check is in progress.
 */
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
