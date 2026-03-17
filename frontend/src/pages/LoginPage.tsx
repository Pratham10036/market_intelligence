import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router";
import { useFadeIn } from "../hooks/useFadeIn";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const ref = useFadeIn<HTMLDivElement>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div ref={ref} className="fade-up w-full max-w-md">
        <div className="glass-card-elevated p-6 sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-heading sm:text-4xl">
              Welcome to XChart
            </h1>
            <p className="text-base leading-relaxed text-text-secondary">
              Enter your credentials to continue
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password size="large" placeholder="Enter your password" />
            </Form.Item>

            <Form.Item className="mb-4">
              <div className="flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <span className="cursor-pointer text-sm text-primary transition-colors hover:text-primary-hover">
                  Forgot password?
                </span>
              </div>
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                Login
              </Button>
            </Form.Item>

            <p className="text-center text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <span className="cursor-pointer font-medium text-primary transition-colors hover:text-primary-hover">
                Sign up
              </span>
            </p>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
