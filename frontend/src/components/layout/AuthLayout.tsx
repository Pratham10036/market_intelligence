import { Outlet } from "react-router";

/**
 * Minimal layout wrapper for public auth pages (login, signup, verify-email).
 * Auth pages manage their own full-page styling; this just provides the Outlet
 * needed for nested routing inside PublicOnlyRoute.
 */
export default function AuthLayout() {
  return <Outlet />;
}
