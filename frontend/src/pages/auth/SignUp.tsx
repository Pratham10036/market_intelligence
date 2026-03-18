import { useState } from "react";
import { useNavigate } from "react-router";
import AuthModal from "../../components/common/AuthModal";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
    console.log(loading);
  };

  return (
    <div className="text-3xl text-white align-center justify-center flex">
      <AuthModal
        mode="signup"
        title="Welcome to XChart"
        subtitle="Sign up to continue"
        onSubmit={handleSubmit}
        fields={[
          {
            name: "name",
            label: "Name",
            type: "text",
            placeholder: "Enter name",
            rules: [{ required: true, message: "Name required" }],
          },
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
          {
            name: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Confirm Password",
            rules: [{ required: true, message: "Confirm Password required" }],
          },
        ]}
      />
    </div>
  );
};

export default LoginPage;
