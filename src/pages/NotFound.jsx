import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <main className="contact-page">
        <div className="page-crumb">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Home
          </Link>
          <span>/</span>
          <span>Page not found</span>
        </div>
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> 404 ERROR
            </div>
            <h1>
              Page not <em>found.</em>
            </h1>
            <p>The page you are looking for doesn't exist or has moved.</p>
          </div>
          <span className="page-index">404</span>
        </section>
        <section className="contact-page-layout">
          <div className="contact-details-panel">
            <div className="contact-panel-kicker">
              NAVIGATION <span>·</span> MACHINE SYSTEMS
            </div>
            <h2>Let's get you back on track.</h2>
            <p>Choose one of the core sections below to continue browsing.</p>
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link className="button button-lime" to="/">
                <i className="bi bi-house"></i> Return to Home
              </Link>
              <Link className="button button-dark" to="/machines">
                Explore machines <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;
