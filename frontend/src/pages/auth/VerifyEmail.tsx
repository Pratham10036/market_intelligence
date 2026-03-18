import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { message, Spin } from "antd";
import AuthModal from "../../components/common/AuthModal";
import { authApi } from "../../api/auth";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const rawEmail = params.get("email");
  const email = rawEmail ? rawEmail.replace(/ /g, "+") : "";
  const verificationToken = params.get("verificationToken");

  const [autoVerifying, setAutoVerifying] = useState(!!verificationToken);
  const [cooldown, setCooldown] = useState<number | null>(null);

  // Auto-verify when opened from email link
  useEffect(() => {
    if (!email || !verificationToken) return;

    const verify = async () => {
      const res = await authApi.verifyEmailOtp({
        email,
        otp: verificationToken,
      });

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
    };

    verify();
  }, [email, verificationToken, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (!cooldown) return;
    const timer = setInterval(() => {
      setCooldown((v) => (v && v > 1 ? v - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (values: { email: string; otp: string }) => {
    const res = await authApi.verifyLoginOtp({ email, otp: values.otp });

    if (!res.isSuccess) {
      return;
    }

    setTimeout(() => navigate("/"), 1500);
  };

  const handleResend = async () => {
    if (cooldown) return;

    const res = await authApi.sendEmailVerificationOtp({ email });

    if (!res.isSuccess) {
      if (res.data?.retry_after_seconds) {
        setCooldown(res.data.retry_after_seconds);
      }
      message.error(res.error || "Failed to send verification email");
      return;
    }

    message.success("Verification email sent!");
    setCooldown(120);
  };

  // Loading state for auto-verify from email link
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

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center">
        <button
          onClick={handleResend}
          disabled={!!cooldown}
          className="text-sm text-text-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cooldown
            ? `Resend in ${cooldown}s`
            : "Didn't receive the code? Resend"}
        </button>
      </div>
    </div>
  );
}
