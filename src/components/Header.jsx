import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "machine_system_auth";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Sync logged in user data directly from localStorage
  const [storedUser, setStoredUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to read user from localStorage in Header:", e);
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setStoredUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        console.error("Failed to sync user from localStorage:", e);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuOpen]);

  // Reset dropdown when route changes
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  const toggleMenu = (e) => {
    e.preventDefault();
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    closeMenu();
    logout();
    navigate("/login");
  };

  const currentUser = storedUser || user;
  const isUserAuthenticated = Boolean(
    currentUser && (currentUser.token || isAuthenticated)
  );

  const isRep = isUserAuthenticated && currentUser?.role === "representative";
  const isCust = isUserAuthenticated && !isRep;
  const isLoginPage =
    location.pathname === "/login" || location.pathname.endsWith("/login");

  // Dynamic user display properties from localStorage / auth
  const displayName =
    currentUser?.name ||
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") ||
    (currentUser?.email ? currentUser.email.split("@")[0] : (isRep ? "Representative" : "Customer"));

  const userInitials =
    currentUser?.initials ||
    (displayName
      ? displayName
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "US");

  const avatarBackground =
    currentUser?.avatarBg || (isRep ? "#c94f2d" : "#27624c");

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
        <label
          className="menu-button"
          htmlFor="menu-toggle"
          aria-label="Toggle navigation"
        >
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
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Contact Us
          </NavLink>
        </nav>
        <div className="header-actions">
          {/* <Link className="basket-link" to="/basket">
            <i className="bi bi-bag"></i>
            <span>Basket</span>
            <b>1</b>
          </Link> */}

          {isRep ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <details
                ref={menuRef}
                className="customer-account-menu"
                open={menuOpen}
              >
                <summary
                  aria-label={`Account menu for ${displayName}`}
                  onClick={toggleMenu}
                >
                  <span
                    className="customer-account-avatar"
                    style={{ background: avatarBackground }}
                  >
                    {userInitials}
                  </span>
                  <span className="customer-account-name">
                    {displayName} (Rep)
                  </span>
                  <i className="bi bi-chevron-down"></i>
                </summary>
                <div
                  className="customer-account-dropdown"
                  onClick={closeMenu}
                >
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
                    style={{
                      color: "#c94f2d",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Log out
                  </a>
                </div>
              </details>
            </div>
          ) : isCust ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <details
                ref={menuRef}
                className="customer-account-menu"
                open={menuOpen}
              >
                <summary
                  aria-label={`Account menu for ${displayName}`}
                  onClick={toggleMenu}
                >
                  <span
                    className="customer-account-avatar"
                    style={{ background: avatarBackground }}
                  >
                    {userInitials}
                  </span>
                  <span className="customer-account-name">{displayName}</span>
                  <i className="bi bi-chevron-down"></i>
                </summary>
                <div
                  className="customer-account-dropdown"
                  onClick={closeMenu}
                >
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
                    style={{
                      color: "#c94f2d",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
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
