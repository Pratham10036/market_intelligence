import { useNavigate } from "react-router";
import { message } from "antd";
import AuthModal from "../../components/common/AuthModal";
import { authApi } from "../../api/auth";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await authApi.userSignup({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (!res.isSuccess) {
      message.error(res.error || "Signup failed");
      return;
    }

    // Trigger email verification OTP; navigate regardless (user can resend from verify page)
    await authApi.sendEmailVerificationOtp({ email: values.email });

    navigate(`login`);
    // navigate(`/verify-email?email=${encodeURIComponent(values.email)}&flow=signup`);
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
            rules: [
              { required: true, message: "Confirm Password required" },
              ({ getFieldValue }: any) => ({
                validator(_: any, value: string) {
                  return new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                      if (!value || getFieldValue("password") === value) {
                        resolve();
                      } else {
                        reject(new Error("Passwords do not match"));
                      }
                    }, 500);
                  });
                },
              }),
            ],
          },
        ]}
      />
    </div>
  );
};

export default SignupPage;
