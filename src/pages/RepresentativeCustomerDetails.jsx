import { Link, useSearchParams } from "react-router-dom";

const CUSTOMER_DATA = {
  morgan: {
    key: "morgan",
    enquiryCode: "NL-ENQ-10482 · NORTHLINE PRECISION",
    name: "Morgan Chen",
    role: "Operations Director",
    company: "Northline Precision",
    location: "Chicago, Illinois",
    country: "United States",
    territory: "Central territory",
    status: "Needs first contact",
    avatar: "MC",
    email: "morgan.chen@northlineprecision.example",
    phone: "+1 (312) 555-0184",
    machineCode: "AX-400 · CNC TURNING",
    machineTitle: "Axis 400 · Precision CNC lathe",
    spindle: "Standard · 8,000 rpm",
    tooling: "10-station turret",
    coolant: "Standard coolant",
    price: "$50,900",
    enquiryId: "NL-ENQ-10482",
    note: "Customer has not specified delivery timing or installation requirements.",
  },
  priya: {
    key: "priya",
    enquiryCode: "NL-ENQ-10471 · SUMMIT COMPONENTS",
    name: "Priya Shah",
    role: "Production Manager",
    company: "Summit Components",
    location: "Milwaukee, Wisconsin",
    country: "United States",
    territory: "Central territory",
    status: "Requirements review",
    avatar: "PS",
    email: "priya.shah@summitcomponents.example",
    phone: "+1 (414) 555-0192",
    machineCode: "ARC-700 · CNC MILLING",
    machineTitle: "Arc 700 · Vertical machining centre",
    spindle: "Inline direct-drive · 12,000 rpm",
    tooling: "30+1 side-mount tool changer",
    coolant: "Through-spindle coolant (300 psi)",
    price: "$64,500",
    enquiryId: "NL-ENQ-10471",
    note: "Customer requested 4th-axis rotary table and high-pressure coolant options.",
  },
  luis: {
    key: "luis",
    enquiryCode: "NL-ENQ-10453 · REDWOOD FABRICATION",
    name: "Luis Ortega",
    role: "General Manager",
    company: "Redwood Fabrication",
    location: "Des Moines, Iowa",
    country: "United States",
    territory: "Central territory",
    status: "Quote in progress",
    avatar: "LO",
    email: "luis.ortega@redwoodfab.example",
    phone: "+1 (515) 555-0144",
    machineCode: "FL-6 · FIBER LASER",
    machineTitle: "Flare 6 · High precision fiber laser",
    spindle: "6kW fiber laser resonator",
    tooling: "Dual shuttle table 3000x1500mm",
    coolant: "Closed loop water chiller",
    price: "$89,000",
    enquiryId: "NL-ENQ-10453",
    note: "Customer requested pricing including dust collector filtration and on-site training.",
  },
};

const RepresentativeCustomerDetails = () => {
  const [searchParams] = useSearchParams();
  const customerKey = searchParams.get("customer") || "morgan";
  const customer = CUSTOMER_DATA[customerKey] || CUSTOMER_DATA.morgan;

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / CUSTOMER CONTACT</span>
      </div>

      <div className="page-crumb rep-crumb">
        <Link to="/representative/customers">
          <i className="bi bi-arrow-left"></i> Customers
        </Link>
        <span>/</span>
        <span>Customer details</span>
      </div>

      <section className="rep-record-heading rep-customer-heading">
        <div>
          <div className="eyebrow">
            <span></span> {customer.enquiryCode}
          </div>
          <h2>
            {customer.name} <em> contact.</em>
          </h2>
          <p>
            {customer.role} <span>·</span> {customer.location} <span>·</span>{" "}
            {customer.territory}
          </p>
        </div>
        <span className="status-pill">{customer.status}</span>
      </section>

      <div className="rep-detail-grid rep-customer-detail-grid">
        <section className="rep-section">
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Contact information</h3>
              <p>
                Reach the customer to discuss the application and schedule.
              </p>
            </div>
          </div>

          <div className="rep-customer-card">
            <span className="rep-customer-avatar">
              {customer.avatar}
            </span>
            <div>
              <strong>{customer.name}</strong>
              <span>
                {customer.role} · {customer.company}
              </span>
            </div>
          </div>

          <div className="rep-contact-lines">
            <a href={`mailto:${customer.email}`}>
              <i className="bi bi-envelope"></i> {customer.email}
            </a>
            <a href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}>
              <i className="bi bi-telephone"></i> {customer.phone}
            </a>
            <span>
              <i className="bi bi-geo-alt"></i> {customer.location} ·{" "}
              {customer.country}
            </span>
          </div>

          <div className="rep-contact-actions">
            <a
              className="button button-dark"
              href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}
            >
              <i className="bi bi-telephone"></i> Call customer
            </a>
            <a
              className="button button-outline"
              href={`mailto:${customer.email}`}
            >
              <i className="bi bi-envelope"></i> Email customer
            </a>
          </div>
        </section>

        <section className="rep-section">
          <div className="rep-section-heading">
            <span>02</span>
            <div>
              <h3>Requested configuration</h3>
              <p>
                Review machine requirements before confirming compatibility.
              </p>
            </div>
          </div>

          <div className="rep-config-summary">
            <div className="rep-machine-line">
              <div>
                <small>{customer.machineCode}</small>
                <strong>{customer.machineTitle}</strong>
              </div>
              <span>Qty 1</span>
            </div>

            <dl>
              <dd>
                <div>
                  <dl>
                    <dt>Spindle</dt>
                    <dd>{customer.spindle}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Tooling</dt>
                    <dd>{customer.tooling}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Coolant</dt>
                    <dd>{customer.coolant}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Indicative price</dt>
                    <dd>{customer.price}</dd>
                  </dl>
                </div>
              </dd>
            </dl>

            <p className="rep-inline-note">{customer.note}</p>
          </div>

          <Link
            className="rep-text-link"
            to={`/representative/quotes?enquiry=${customer.enquiryId}`}
          >
            Continue to quote preparation <i className="bi bi-arrow-right"></i>
          </Link>
        </section>

        <section className="rep-section rep-customer-wide">
          <div className="rep-section-heading">
            <span>03</span>
            <div>
              <h3>Conversation &amp; custom requirements</h3>
              <p>
                Discuss how the machine will be used and capture any custom
                work.
              </p>
            </div>
          </div>

          <div className="rep-conversation-placeholder">
            <i className="bi bi-chat-square-text"></i>
            <div>
              <strong>No conversation logged yet</strong>
              <span>
                Confirm materials, tolerances, production volume, special
                tooling, installation, and delivery schedule.
              </span>
            </div>
          </div>

          <div className="rep-requirement-tags">
            <span>Application</span>
            <span>Material &amp; tolerances</span>
            <span>Custom options</span>
            <span>Installation</span>
            <span>Delivery date</span>
          </div>
        </section>
      </div>

      <p className="summary-note rep-disclaimer">
        Sample customer record. Contact history and customer data are not
        connected to a live service.
      </p>
    </main>
  );
};

export default RepresentativeCustomerDetails;
