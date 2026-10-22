import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CustomerSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <aside className="customer-sidebar">
      <div className="customer-sidebar-intro">
        <span className="customer-nav-label">CUSTOMER WORKSPACE</span>
        <h2>
          Built around<br />
          your <em>work.</em>
        </h2>
        <p>Enquiries, quotations, and machine details in one place.</p>
      </div>
      <nav className="customer-nav" aria-label="Customer navigation">
        <NavLink
          to="/customer/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-grid-1x2"></i> Overview
        </NavLink>
        <NavLink
          to="/customer/enquiries"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-file-earmark-text"></i> My enquiries
        </NavLink>
        <NavLink
          to="/customer/quotations"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-receipt"></i> My quotations
        </NavLink>
        <NavLink
          to="/customer/machines"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-gear"></i> My machines
        </NavLink>
        <NavLink
          to="/customer/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-person-gear"></i> Profile settings
        </NavLink>
        <a href="#logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Log out
        </a>
      </nav>
      <div className="customer-sidebar-note">
        <i className="bi bi-person-check"></i>
        <span>Customer Account · {user?.name || "Morgan Chen"}</span>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
