import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { message, Spin } from "antd";
import AuthModal from "../../components/common/AuthModal";
import { authApi } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const rawEmail = params.get("email");
  const email = rawEmail ? rawEmail.replace(/ /g, "+") : "";
  const verificationToken = params.get("verificationToken");
  const flow = params.get("flow"); // 'login' | 'signup'

  const [autoVerifying, setAutoVerifying] = useState(!!verificationToken);
  const [cooldown, setCooldown] = useState<number | null>(null);

  useEffect(() => {
    if (!email) {
      message.error("Invalid verification link");
      navigate("/login");
    }
  }, [email, navigate]);

  // Auto-verify via link token (email link click flow)
  useEffect(() => {
    if (!email || !verificationToken) return;

    const verify = async () => {
      try {
        const res = await authApi.verifyEmailOtp({ email, otp: verificationToken });

        if (!res.isSuccess) {
          if (res.data?.email_verified) {
            message.warning("Email already verified");
            setTimeout(() => navigate("/login"), 1500);
          } else {
            message.error(res.error || "Verification failed");
            setAutoVerifying(false);
          }
          return;
        }

        message.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } catch {
        message.error("Something went wrong");
        setAutoVerifying(false);
      }
    };

    verify();
  }, [email, verificationToken, navigate]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => {
      setCooldown((v) => (v && v > 1 ? v - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (values: { otp: string }) => {
    try {
      if (flow === "login") {
        const res = await authApi.verifyLoginOtp({ email, otp: values.otp });
        if (!res.isSuccess) {
          message.error(res.error || "Invalid OTP");
          return;
        }
        sessionStorage.removeItem("login_password");
        login(res.data.access_token);
        message.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        const res = await authApi.verifyEmailOtp({ email, otp: values.otp });
        if (!res.isSuccess) {
          message.error(res.error || "Invalid OTP");
          return;
        }
        message.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      message.error("Something went wrong");
    }
  };

  const handleResend = async () => {
    if (cooldown) return;

    try {
      if (flow === "login") {
        const password = sessionStorage.getItem("login_password") ?? "";
        const res = await authApi.sendLoginOtp({ email, password });
        if (!res.isSuccess) {
          message.error(res.error || "Failed to resend OTP");
          return;
        }
      } else {
        const res = await authApi.sendEmailVerificationOtp({ email });
        if (!res.isSuccess) {
          const retryAfter = res.data?.retry_after_seconds;
          if (retryAfter) setCooldown(retryAfter);
          message.error(res.error || "Failed to resend verification email");
          return;
        }
      }

      message.success("OTP sent successfully!");
      setCooldown(120);
    } catch {
      message.error("Something went wrong");
    }
  };

  if (autoVerifying) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-text-secondary">Verifying your email...</p>
        </div>
      </section>
    );
  }

  return (
    <div>
      <AuthModal
        mode="verify"
        title="Verify Your Email"
        subtitle={`Enter the verification code sent to ${email}`}
        submitText="Verify"
        onSubmit={handleVerify}
        onResend={handleResend}
        cooldown={cooldown}
        fields={[
          {
            name: "otp",
            label: "Verification Code",
            type: "text",
            placeholder: "Enter OTP",
            rules: [{ required: true, message: "OTP is required" }],
          },
        ]}
      />
    </div>
  );
}
