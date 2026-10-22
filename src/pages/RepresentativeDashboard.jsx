import { Link } from "react-router-dom";

const RepresentativeDashboard = () => {
  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / OVERVIEW</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> COUNTRY REPRESENTATIVE
          </div>
          <h1>Good morning, Alex.</h1>
          <p>
            Your assigned enquiries, customer conversations, and quotes in
            progress.
          </p>
        </div>
        <Link className="button button-dark" to="/representative/profile">
          <i className="bi bi-eye"></i> View Profile
        </Link>
      </section>

      <section
        aria-label="Representative workload"
        className="customer-metrics rep-metrics"
      >
        <article className="customer-metric">
          <span>ASSIGNED TO YOU</span>
          <strong>03</strong>
          <i className="bi bi-inbox"></i>
        </article>
        <article className="customer-metric">
          <span>NEEDS FIRST CONTACT</span>
          <strong>01</strong>
          <i className="bi bi-telephone"></i>
        </article>
        <article className="customer-metric">
          <span>QUOTES IN PROGRESS</span>
          <strong>01</strong>
          <i className="bi bi-file-earmark-text"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>QUOTES SENT</span>
          <strong>02</strong>
          <i className="bi bi-send"></i>
        </article>
      </section>

      <section className="rep-workspace rep-dashboard-workspace">
        <aside className="rep-queue">
          <div className="rep-queue-heading">
            <div>
              <span>YOUR TERRITORY</span>
              <h2>Assigned enquiries</h2>
            </div>
            <Link className="rep-text-link" to="/representative/enquiries">
              View all <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <Link
            to="/representative/enquiry-details?id=NL-ENQ-10482"
            className="rep-queue-item is-selected"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="rep-queue-top">
              <small>NL-ENQ-10482 · OCT 12</small>
              <i className="bi bi-arrow-up-right"></i>
            </span>
            <strong>Axis 400</strong>
            <span>Northline Precision · Morgan Chen</span>
            <span className="rep-queue-status">Needs first contact</span>
          </Link>

          <Link
            to="/representative/enquiry-details?id=NL-ENQ-10471"
            className="rep-queue-item"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="rep-queue-top">
              <small>NL-ENQ-10471 · OCT 11</small>
              <i className="bi bi-arrow-up-right"></i>
            </span>
            <strong>Arc 700</strong>
            <span>Summit Components · Priya Shah</span>
            <span className="rep-queue-status is-review">
              Requirements review
            </span>
          </Link>

          <Link
            to="/representative/enquiry-details?id=NL-ENQ-10453"
            className="rep-queue-item"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span className="rep-queue-top">
              <small>NL-ENQ-10453 · OCT 09</small>
              <i className="bi bi-arrow-up-right"></i>
            </span>
            <strong>Flare 6</strong>
            <span>Redwood Fabrication · Luis Ortega</span>
            <span className="rep-queue-status is-quote">
              Quote in progress
            </span>
          </Link>
        </aside>

        <section className="rep-section rep-dashboard-actions">
          <div className="rep-section-heading">
            <span>QUICK ACCESS</span>
            <div>
              <h3>Continue your workflow</h3>
              <p>Open the next step for the selected customer.</p>
            </div>
          </div>

          <Link to="/representative/customer-details?customer=morgan">
            <i className="bi bi-person-lines-fill"></i>
            <span>
              <strong>Contact customer</strong>
              <small>Morgan Chen · Northline Precision</small>
            </span>
            <i className="bi bi-arrow-right"></i>
          </Link>

          <Link to="/representative/quotes">
            <i className="bi bi-receipt"></i>
            <span>
              <strong>Prepare final quotation</strong>
              <small>Axis 400 · NL-ENQ-10482</small>
            </span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </section>
      </section>

      <p className="summary-note rep-disclaimer">
        Sample representative dashboard. Enquiry records, quote status, and
        authentication are not connected to a live service.
      </p>
    </main>
  );
};

export default RepresentativeDashboard;
