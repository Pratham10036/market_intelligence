import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC = () => {
  return (
    <AntLayout className="min-h-screen overflow-x-hidden bg-background">
      <Header />
      <AntLayout.Content>
        <Outlet />
      </AntLayout.Content>
      <Footer />
    </AntLayout>
  );
};

export default Layout;
