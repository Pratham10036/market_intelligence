import { useState } from "react";
import { useNavigate } from "react-router";
import AuthModal from "../../components/common/AuthModal";
import { authApi } from "../../api/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const response = await authApi.sendLoginOtp({
        email: values.email,
        password: values.password,
      });

      if (!response.isSuccess) {
        // ❗ handle error properly
        console.error(response.error);
        setLoading(false);
        return;
      }

      // ✅ success
      navigate("/verify-email");
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
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
