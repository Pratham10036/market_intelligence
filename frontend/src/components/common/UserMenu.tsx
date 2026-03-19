import { useState, useRef, useEffect } from "react";
import {
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const UserMenu: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  if (!isAuthenticated) return null;

  const displayName = user?.name || "Account";
  const initials = user?.name ? getInitials(user.name) : "U";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
    window.location.reload();
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => {
        setOpen(false);
        navigate("/dashboard");
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => {
        setOpen(false);
      },
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="user-menu-avatar">{initials}</span>
        <span className="user-menu-name">{displayName}</span>
        <DownOutlined
          className="user-menu-chevron"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: `transform var(--motion-duration-fast) var(--motion-ease-premium)`,
          }}
        />
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          {/* User info header */}
          <div className="user-menu-header">
            <span className="user-menu-avatar-lg">{initials}</span>
            <div className="user-menu-info">
              <span className="user-menu-info-name">{user?.name || "User"}</span>
              <span className="user-menu-info-email">{user?.email || ""}</span>
            </div>
          </div>

          <div className="user-menu-divider" />

          {/* Menu items */}
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              className={`user-menu-item${item.danger ? " user-menu-item-danger" : ""}`}
              onClick={item.onClick}
            >
              <span className="user-menu-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
