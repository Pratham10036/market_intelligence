import { useState } from "react";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
import type { MenuProps } from "antd";

const menuItems: MenuProps["items"] = [
  { key: "/", label: "Home" },
  { key: "/about", label: "About" },
  { key: "/solutions", label: "Solutions" },
  { key: "/market-intelligence", label: "Market Intelligence" },
  { key: "/dashboard", label: "Dashboard" },
  { key: "/business-impact", label: "Business Impact" },
  { key: "/contact", label: "Contact" },
];

const Header: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
    setDrawerOpen(false);
  };

  return (
    <Layout.Header
      style={{
        background: "var(--color-background)",
        borderBottom: "1px solid var(--color-card-border)",
        lineHeight: "inherit",
        padding: 0,
        height: "auto",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6">
        {/* Logo — left */}
        <div
          className="shrink-0 cursor-pointer text-lg font-bold tracking-tight text-heading sm:text-xl"
          onClick={() => navigate("/")}
        >
          XChart
        </div>

        {/* Desktop nav — center (hidden below lg) */}
        <nav className="hidden flex-1 justify-center lg:flex">
          <ul className="header-nav flex items-center gap-1">
            {menuItems.map((item) => {
              const key = (item as { key: string }).key;
              const label = (item as { label: string }).label;
              const isActive = location.pathname === key;
              return (
                <li
                  key={key}
                  onClick={() => navigate(key)}
                  className={`header-nav-item cursor-pointer rounded-md px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-text-secondary hover:bg-background-alt hover:text-primary"
                  }`}
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTA — right (hidden below lg) */}
        <div className="hidden lg:block">
          <Button
            type="primary"
            onClick={() => navigate("/contact")}
          >
            Request Demo
          </Button>
        </div>

        {/* Mobile menu toggle (visible below lg) */}
        <div className="ml-auto lg:hidden">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
          />
        </div>
      </div>

      {/* Mobile / Tablet drawer */}
      <Drawer
        title="XChart"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        closeIcon={<CloseOutlined />}
        styles={{
          header: {
            borderBottom: "1px solid var(--color-card-border)",
          },
          body: {
            padding: 0,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="drawer-nav flex-1 border-r-0"
          style={{ background: "transparent" }}
        />
        <div className="border-t border-card-border p-4">
          <Button
            type="primary"
            block
            size="large"
            onClick={() => {
              navigate("/contact");
              setDrawerOpen(false);
            }}
          >
            Request Demo
          </Button>
        </div>
      </Drawer>
    </Layout.Header>
  );
};

export default Header;
