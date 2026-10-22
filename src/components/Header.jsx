import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const isRep = isAuthenticated && user?.role === "representative";
  const isCust = isAuthenticated && user?.role === "customer";
  const isLoginPage = location.pathname === "/login" || location.pathname.endsWith("/login");

  return (
    <div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="MACHINE Systems home">
          <span className="brand-icon">
            <i className="bi bi-asterisk"></i>
          </span>
          <span className="brand-type">
            MACHINE
            <small>SYSTEMS</small>
          </span>
        </Link>
        <input className="menu-toggle" type="checkbox" id="menu-toggle" />
        <label className="menu-button" htmlFor="menu-toggle" aria-label="Toggle navigation">
          <i className="bi bi-list"></i>
        </label>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/machines"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Machines
          </NavLink>
          <Link to="/#about">About Us</Link>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact Us
          </NavLink>
        </nav>
        <div className="header-actions">
          <Link className="basket-link" to="/basket">
            <i className="bi bi-bag"></i>
            <span>Basket</span>
            <b>1</b>
          </Link>

          {isRep ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <details className="customer-account-menu">
                <summary aria-label="Account menu for Alex Morgan">
                  <span className="customer-account-avatar" style={{ background: "#c94f2d" }}>
                    AM
                  </span>
                  <span className="customer-account-name">Alex Morgan (Rep)</span>
                  <i className="bi bi-chevron-down"></i>
                </summary>
                <div className="customer-account-dropdown">
                  <Link to="/representative/dashboard">
                    <i className="bi bi-grid-1x2"></i> Overview
                  </Link>
                  <Link to="/representative/enquiries">
                    <i className="bi bi-inbox"></i> Assigned enquiries
                  </Link>
                  <Link to="/representative/quotes">
                    <i className="bi bi-receipt"></i> Quote preparation
                  </Link>
                  <Link to="/representative/customers">
                    <i className="bi bi-people"></i> Customers
                  </Link>
                  <Link to="/representative/profile">
                    <i className="bi bi-person"></i> View profile
                  </Link>
                  <div
                    style={{
                      margin: "4px 0",
                      borderTop: "1px solid #e5e9e3",
                    }}
                  />
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    style={{ color: "#c94f2d", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Log out
                  </a>
                </div>
              </details>
            </div>
          ) : isCust ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <details className="customer-account-menu">
                <summary aria-label="Account menu for Morgan Chen">
                  <span
                    className="customer-account-avatar"
                    style={{ background: "#27624c" }}
                  >
                    MC
                  </span>
                  <span className="customer-account-name">Morgan Chen</span>
                  <i className="bi bi-chevron-down"></i>
                </summary>
                <div className="customer-account-dropdown">
                  <Link to="/customer/dashboard">
                    <i className="bi bi-grid-1x2"></i> Workspace
                  </Link>
                  <Link to="/customer/enquiries">
                    <i className="bi bi-file-earmark-text"></i> My enquiries
                  </Link>
                  <Link to="/customer/quotations">
                    <i className="bi bi-receipt"></i> My quotations
                  </Link>
                  <Link to="/customer/machines">
                    <i className="bi bi-gear"></i> My machines
                  </Link>
                  <Link to="/customer/profile">
                    <i className="bi bi-person-gear"></i> Profile settings
                  </Link>
                  <div
                    style={{
                      margin: "4px 0",
                      borderTop: "1px solid #e5e9e3",
                    }}
                  />
                  <a
                    href="#logout"
                    onClick={handleLogout}
                    style={{ color: "#c94f2d", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Log out
                  </a>
                </div>
              </details>
            </div>
          ) : (
            <div className="auth-links">
              <Link
                to="/login"
                className={isLoginPage ? "signup-link auth-active" : ""}
              >
                <i className="bi bi-person"></i>
                <span>Log in</span>
              </Link>
              <Link
                to="/signup"
                className={isLoginPage ? "" : "signup-link auth-active"}
              >
                <i className="bi bi-person-plus"></i>
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
