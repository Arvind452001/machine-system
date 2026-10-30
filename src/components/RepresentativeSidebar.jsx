import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RepresentativeSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <aside className="customer-sidebar">
      <div className="customer-sidebar-intro">
        <span className="customer-nav-label">REPRESENTATIVE WORKSPACE</span>
        <h2>
          Built around<br />
          your <em>customers.</em>
        </h2>
        <p>Enquiries, customer conversations, and quotations in one place.</p>
      </div>
      <nav aria-label="Representative navigation" className="customer-nav">
        <NavLink
          to="/representative/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-grid-1x2"></i> Overview
        </NavLink>
        <NavLink
          to="/representative/enquiries"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-inbox"></i> Assigned enquiries{" "}
          <span className="rep-nav-count"></span>
        </NavLink>
        <NavLink
          to="/representative/quotes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-receipt"></i> Quote preparation
        </NavLink>
        <NavLink
          to="/representative/customers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <i className="bi bi-people"></i> Customers
        </NavLink>
        <a href="#logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Log out
        </a>
      </nav>
    </aside>
  );
};

export default RepresentativeSidebar;
