import { Form, Input, Button } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";
import { useState } from "react";
import { Link } from "react-router";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  rules?: any[];
};

type AuthModalProps = {
  onSubmit: (values: any) => void;
  fields: FieldConfig[];
  title?: string;
  subtitle?: string;
  submitText?: string;
  mode: "login" | "signup" | "verify";
  onResend?: () => void;
  cooldown?: number | null;
};

export default function AuthModal({
  onSubmit,
  fields,
  title = "Welcome",
  subtitle = "Enter your credentials",
  submitText = "Submit",
  mode,
  onResend,
  cooldown,
}: AuthModalProps) {
  const ref = useFadeIn<HTMLDivElement>();
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div ref={ref} className="fade-up w-full max-w-md">
        <div className="glass-card-elevated p-6 sm:p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-heading sm:text-4xl">
              {title}
            </h1>
            <p className="text-base text-text-secondary">{subtitle}</p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleFinish}
            requiredMark={false}
            autoComplete="off"
          >
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                rules={field.rules}
                dependencies={
                  field.name === "confirmPassword" ? ["password"] : []
                }
              >
                {field.type === "password" ? (
                  <Input.Password
                    size="large"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    size="large"
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                  />
                )}
              </Form.Item>
            ))}

            {isLogin && (
              <Form.Item className="mb-4">
                <div className="flex items-center justify-end space-x-2 pr-4">
                  {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item> */}
                  <span className="cursor-pointer text-sm text-primary hover:text-primary-hover">
                    Forgot password?
                  </span>
                </div>
              </Form.Item>
            )}

            <Form.Item className="mb-4">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                className="w-full"
              >
                {submitText}
              </Button>
            </Form.Item>

            {mode !== "verify" && (
              <p className="text-center text-sm text-text-muted">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/signup"
                      className="cursor-pointer font-medium text-primary hover:text-primary-hover"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="cursor-pointer font-medium text-primary hover:text-primary-hover"
                    >
                      Login
                    </Link>
                  </>
                )}
              </p>
            )}

            {mode === "verify" && (
              <p className="text-center text-sm text-text-muted">
                Didn&apos;t receive the code?{" "}
                <span
                  onClick={!cooldown ? onResend : undefined}
                  className={`font-medium ${
                    cooldown
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer text-primary hover:text-primary-hover"
                  }`}
                >
                  {cooldown ? `Resend in ${cooldown}s` : "Resend"}
                </span>
              </p>
            )}
          </Form>
        </div>
      </div>
    </section>
  );
}
