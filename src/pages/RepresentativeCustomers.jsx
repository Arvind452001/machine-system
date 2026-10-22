import { Link } from "react-router-dom";

const RepresentativeCustomers = () => {
  const customers = [
    {
      key: "morgan",
      role: "OPERATIONS DIRECTOR",
      name: "Morgan Chen",
      company: "Northline Precision",
      location: "Chicago, Illinois",
      enquiry: "Axis 400 · NL-ENQ-10482",
    },
    {
      key: "priya",
      role: "PRODUCTION MANAGER",
      name: "Priya Shah",
      company: "Summit Components",
      location: "Milwaukee, Wisconsin",
      enquiry: "Arc 700 · NL-ENQ-10471",
    },
    {
      key: "luis",
      role: "GENERAL MANAGER",
      name: "Luis Ortega",
      company: "Redwood Fabrication",
      location: "Des Moines, Iowa",
      enquiry: "Flare 6 · NL-ENQ-10453",
    },
  ];

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / CUSTOMER DIRECTORY</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> YOUR TERRITORY
          </div>
          <h1>Customers.</h1>
          <p>Choose a customer to view their details and get in touch.</p>
        </div>
        <span className="rep-customer-total">
          <i className="bi bi-people"></i> 03 customers
        </span>
      </section>

      <section className="rep-section rep-enquiry-list">
        <div className="rep-section-heading">
          <span>01</span>
          <div>
            <h3>Customer directory</h3>
            <p>
              Assigned customer contacts and their active machine enquiry.
            </p>
          </div>
        </div>

        <div className="rep-enquiry-table-head rep-customer-list-head">
          <span>CUSTOMER / COMPANY</span>
          <span>LOCATION</span>
          <span>ACTIVE ENQUIRY</span>
          <span></span>
        </div>

        {customers.map((c) => (
          <article
            className="rep-enquiry-row rep-customer-row"
            key={c.key}
          >
            <div>
              <small>{c.role}</small>
              <strong>{c.name}</strong>
              <span>{c.company}</span>
            </div>
            <span>{c.location}</span>
            <span>{c.enquiry}</span>
            <Link
              className="button button-dark"
              to={`/representative/customer-details?customer=${c.key}`}
            >
              <i className="bi bi-telephone"></i> Contact
            </Link>
          </article>
        ))}
      </section>

      <p className="summary-note rep-disclaimer">
        Sample customer directory. Contact details are for preview only and
        are not connected to a live service.
      </p>
    </main>
  );
};

export default RepresentativeCustomers;
