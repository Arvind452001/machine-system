import { Link, NavLink } from "react-router-dom";

const Header = () => {
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
          <div className="auth-links">
            <Link to="/login">
              <i className="bi bi-person"></i>
              <span>Log in</span>
            </Link>
            <Link className="signup-link" to="/signup">
              <i className="bi bi-person-plus"></i>
              <span>Sign up</span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
