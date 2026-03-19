import { Spin } from "antd";

export default function PageLoader() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background">
      <Spin size="large" />
    </section>
  );
}
