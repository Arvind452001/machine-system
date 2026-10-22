import { Link } from "react-router-dom";

const RepresentativeEnquiries = () => {
  const enquiries = [
    {
      id: "NL-ENQ-10482",
      type: "CNC TURNING",
      machine: "Axis 400",
      company: "Northline Precision",
      contact: "Morgan Chen",
      received: "Oct 12, 2026",
      status: "Needs first contact",
      statusClass: "",
    },
    {
      id: "NL-ENQ-10471",
      type: "CNC MILLING",
      machine: "Arc 700",
      company: "Summit Components",
      contact: "Priya Shah",
      received: "Oct 11, 2026",
      status: "Requirements review",
      statusClass: "is-review",
    },
    {
      id: "NL-ENQ-10453",
      type: "FIBER LASER",
      machine: "Flare 6",
      company: "Redwood Fabrication",
      contact: "Luis Ortega",
      received: "Oct 09, 2026",
      status: "Quote in progress",
      statusClass: "is-quote",
    },
  ];

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ENQUIRY MANAGEMENT</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> YOUR TERRITORY
          </div>
          <h1>Assigned enquiries.</h1>
          <p>
            Review each request, contact the customer, and move it toward a
            final quote.
          </p>
        </div>
        <Link
          className="button button-dark"
          to="/representative/new-enquiry"
        >
          <i className="bi bi-plus-lg"></i> New customer enquiry
        </Link>
      </section>

      <section
        className="customer-metrics rep-metrics"
        aria-label="Enquiry summary"
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
          <span>REQUIREMENTS REVIEW</span>
          <strong>01</strong>
          <i className="bi bi-list-check"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>QUOTE IN PROGRESS</span>
          <strong>01</strong>
          <i className="bi bi-receipt"></i>
        </article>
      </section>

      <section className="rep-section rep-enquiry-list">
        <div className="rep-section-heading">
          <span>01</span>
          <div>
            <h3>Enquiry queue</h3>
            <p>
              Open a customer record to review configuration and continue the
              discussion.
            </p>
          </div>
        </div>

        <div className="rep-enquiry-table-head">
          <span>ENQUIRY / CUSTOMER</span>
          <span>RECEIVED</span>
          <span>STATUS</span>
          <span></span>
        </div>

        {enquiries.map((enq) => (
          <article className="rep-enquiry-row" key={enq.id}>
            <div>
              <small>
                {enq.id} · {enq.type}
              </small>
              <strong>{enq.machine}</strong>
              <span>
                {enq.company} · {enq.contact}
              </span>
            </div>
            <span>{enq.received}</span>
            <span className={`rep-status-label ${enq.statusClass}`}>
              {enq.status}
            </span>
            <Link
              className="button button-dark"
              to={`/representative/enquiry-details?id=${enq.id}`}
            >
              Review <i className="bi bi-arrow-right"></i>
            </Link>
          </article>
        ))}
      </section>

      <p className="summary-note rep-disclaimer">
        Sample territory data for this representative preview. Customer records
        are not connected to a live service.
      </p>
    </main>
  );
};

export default RepresentativeEnquiries;
