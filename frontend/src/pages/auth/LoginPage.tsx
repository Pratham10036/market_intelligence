import { useNavigate } from "react-router";
import { message } from "antd";
import AuthModal from "../../components/common/AuthModal";
import { authApi } from "../../api/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const response = await authApi.sendLoginOtp({
      email: values.email,
      password: values.password,
    });

    if (!response.isSuccess) {
      message.error(response.error || "Login failed");
      return;
    }

    // Store password temporarily so VerifyEmail can resend login OTP if needed
    sessionStorage.setItem("login_password", values.password);

    navigate(`/verify-email?email=${encodeURIComponent(values.email)}&flow=login`);
  };

  return (
    <div className="text-3xl text-white align-center justify-center flex">
      <AuthModal
        mode="login"
        title="Welcome to XChart"
        subtitle="Login to continue"
        onSubmit={handleSubmit}
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email",
            rules: [
              { required: true, message: "Email required" },
              { type: "email", message: "Invalid email" },
            ],
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter Password",
            rules: [{ required: true, message: "Password required" }],
          },
        ]}
      />
    </div>
  );
};

export default LoginPage;
