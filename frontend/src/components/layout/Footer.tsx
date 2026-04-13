import { Divider } from "antd";
import { useNavigate } from "react-router";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/solutions", label: "Solutions" },
  { path: "/market-intelligence", label: "Market Intelligence" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/business-impact", label: "Business Impact" },
  { path: "/contact", label: "Contact" },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 sm:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <div
              className="mb-3 cursor-pointer text-xl font-bold tracking-tight text-heading"
              onClick={() => navigate("/")}
            >
              XChart
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-secondary">
              The Bridge to Industry 4.0 — transforming solar manufacturing into
              intelligent, autonomous ecosystems.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-muted">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="cursor-pointer text-sm text-text-secondary transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-text-muted">
              Contact
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-text-secondary">
              <li>
                <a
                  href="mailto:contact@xchart.in"
                  className="transition-colors duration-200 hover:text-primary"
                >
                  contact@xchart.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Divider style={{ borderColor: "var(--color-card-border)" }} />

        <p className="text-center text-xs text-text-muted">
          &copy; {year} XChart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
