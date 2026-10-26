import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="site-footer site-footer-large">
        <div className="footer-main">
          <div className="footer-about">
            <Link className="brand footer-logo" to="/">
              <span className="brand-icon">
                <i className="bi bi-asterisk"></i>
              </span>
              <span className="brand-type">
                MACHINE
                <small>SYSTEMS</small>
              </span>
            </Link>
            <p>
              Industrial machines and practical expertise, built around the work
              you do.
            </p>
            <Link className="footer-email" to="/contact">
              hello@MACHINEsystems.example
            </Link>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/machines">Machine catalogue</Link>
            <Link to="/machines">Browse all machinery</Link>
            <Link to="/configure">Machine configurator</Link>
          </div>
          <div className="footer-column">
            <h3>Your project</h3>
            <Link to="/configure">Configure a machine</Link>
            <Link to="/basket">Basket</Link>
            <Link to="/enquiry">Send an enquiry</Link>
            <Link to="/customer-dashboard">Enquiry history</Link>
          </div>
          <div className="footer-column">
            <h3>MACHINE</h3>
            <Link to="/about">About Us</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/#testimonial">Customer stories</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-market">
            <span>YOUR REGION</span>
            <strong>United States</strong>
            <small>Local expertise. Global engineering.</small>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 MACHINE Systems.</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <span>Indicative pricing. Final quote subject to review.</span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
