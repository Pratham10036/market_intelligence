import { Form, Input, Button, message } from "antd";
import { useFadeIn } from "../../hooks/useFadeIn";

const { TextArea } = Input;

const ContactFormSection: React.FC = () => {
  const ref = useFadeIn<HTMLDivElement>();
  const [form] = Form.useForm();

  const handleSubmit = () => {
    message.success("Thank you! We'll get back to you shortly.");
    form.resetFields();
  };

  return (
    <section className="bg-background-alt py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className="fade-up grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16"
        >
          {/* Contact Form */}
          <div className="rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8 md:p-10">
            <h2 className="mb-2 text-2xl font-bold text-heading sm:text-3xl">
              Send Us a Message
            </h2>
            <p className="mb-8 text-base leading-relaxed text-text-secondary">
              Fill out the form below and our team will respond within 24 hours.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input size="large" placeholder="John Doe" />
                </Form.Item>

                <Form.Item
                  label="Work Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input size="large" placeholder="john@company.com" />
                </Form.Item>
              </div>

              <Form.Item label="Company" name="company">
                <Input size="large" placeholder="Company name" />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: "Please enter your message" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Tell us about your requirements..."
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full sm:w-auto"
                >
                  Submit Inquiry
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-heading sm:text-3xl">
                Get in Touch
              </h2>
              <p className="text-base leading-relaxed text-text-secondary">
                Reach out directly or use the form — we're happy to discuss how
                XChart can transform your manufacturing operations.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-card-border bg-card-bg p-5 sm:p-6">
                <h3 className="mb-1 text-sm font-semibold tracking-widest uppercase text-primary">
                  Email
                </h3>
                <a
                  href="mailto:contact@xchart.in"
                  className="text-lg font-medium text-heading transition-colors hover:text-primary"
                >
                  contact@xchart.in
                </a>
              </div>

              <div className="rounded-xl border border-card-border bg-card-bg p-5 sm:p-6">
                <h3 className="mb-1 text-sm font-semibold tracking-widest uppercase text-primary">
                  Office
                </h3>
                <p className="text-lg font-medium text-heading">
                  Ahmedabad, Gujarat, India
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Solar manufacturing intelligence hub
                </p>
              </div>

              <div className="rounded-xl border border-card-border bg-card-bg p-5 sm:p-6">
                <h3 className="mb-1 text-sm font-semibold tracking-widest uppercase text-primary">
                  Response Time
                </h3>
                <p className="text-lg font-medium text-heading">
                  Within 24 Hours
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Our team reviews every inquiry personally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
