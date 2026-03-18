const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ApiResponse<T = Record<string, unknown>> = {
  isSuccess: boolean;
  data: T;
  error?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    return await res.json();
  } catch {
    return { isSuccess: false, data: {} as T, error: "Network error" };
  }
}

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  sendEmailVerificationOtp: (body: { email: string }) =>
    request<{ email: string; otp_sent: boolean; expires_in_minutes: number; retry_after_seconds?: number }>(
      "/api/auth/email-verification/send",
      { method: "POST", body: JSON.stringify(body) },
    ),

  verifyEmailOtp: (body: { email: string; otp: string }) =>
    request<{ email: string; email_verified: boolean }>(
      "/api/auth/email-verification/verify",
      { method: "POST", body: JSON.stringify(body) },
    ),

  sendLoginOtp: (body: { email: string; password: string }) =>
    request("/api/auth/login/send-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  verifyLoginOtp: (body: { email: string; otp: string }) =>
    request("/api/auth/login/verify-otp", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: (accessToken: string) =>
    request("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
