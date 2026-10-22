import { Link, useSearchParams } from "react-router-dom";

const ENQUIRIES_DATA = {
  "NL-ENQ-10482": {
    id: "NL-ENQ-10482",
    dateReceived: "OCTOBER 12, 2026",
    type: "CNC TURNING",
    machineTitle: "Axis 400",
    machineFull: "Axis 400 · Precision CNC lathe",
    machineCode: "AX-400 · CNC TURNING",
    company: "Northline Precision",
    contactName: "Morgan Chen",
    contactAvatar: "MC",
    contactRole: "Operations Director",
    email: "morgan.chen@northlineprecision.example",
    phone: "+1 (312) 555-0184",
    location: "Chicago, Illinois · United States",
    status: "Needs first contact",
    spindle: "Standard · 8,000 rpm",
    tooling: "10-station turret",
    coolant: "Standard coolant",
    price: "$50,900",
    customerKey: "morgan",
    subject: "Production capacity expansion",
    message:
      "We are reviewing options for a new turning cell and would like to confirm the spindle and tooling package for our current materials.",
  },
  "NL-ENQ-10471": {
    id: "NL-ENQ-10471",
    dateReceived: "OCTOBER 11, 2026",
    type: "CNC MILLING",
    machineTitle: "Arc 700",
    machineFull: "Arc 700 · Vertical machining centre",
    machineCode: "ARC-700 · CNC MILLING",
    company: "Summit Components",
    contactName: "Priya Shah",
    contactAvatar: "PS",
    contactRole: "Production Manager",
    email: "priya.shah@summitcomponents.example",
    phone: "+1 (414) 555-0192",
    location: "Milwaukee, Wisconsin · United States",
    status: "Requirements review",
    spindle: "Inline direct-drive · 12,000 rpm",
    tooling: "30+1 side-mount tool changer",
    coolant: "Through-spindle coolant (300 psi)",
    price: "$64,500",
    customerKey: "priya",
    subject: "Aerospace tolerance verification",
    message:
      "Looking for rapid cycle time on complex aluminum housings. Need to confirm 4th axis integration timeline and high-pressure coolant options.",
  },
  "NL-ENQ-10453": {
    id: "NL-ENQ-10453",
    dateReceived: "OCTOBER 09, 2026",
    type: "FIBER LASER",
    machineTitle: "Flare 6",
    machineFull: "Flare 6 · High precision fiber laser",
    machineCode: "FL-6 · FIBER LASER",
    company: "Redwood Fabrication",
    contactName: "Luis Ortega",
    contactAvatar: "LO",
    contactRole: "General Manager",
    email: "luis.ortega@redwoodfab.example",
    phone: "+1 (515) 555-0144",
    location: "Des Moines, Iowa · United States",
    status: "Quote in progress",
    spindle: "6kW fiber laser resonator",
    tooling: "Dual shuttle table 3000x1500mm",
    coolant: "Closed loop water chiller",
    price: "$89,000",
    customerKey: "luis",
    subject: "Sheet metal cutting speed upgrade",
    message:
      "Planning to replace our CO2 laser with fiber. Please include exhaust filtration and automated sheet loader in the commercial quote.",
  },
};

const RepresentativeEnquiryDetails = () => {
  const [searchParams] = useSearchParams();
  const enquiryId = searchParams.get("id") || "NL-ENQ-10482";
  const enq = ENQUIRIES_DATA[enquiryId] || ENQUIRIES_DATA["NL-ENQ-10482"];

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ENQUIRY DETAILS</span>
      </div>

      <div className="page-crumb rep-crumb">
        <Link to="/representative/enquiries">
          <i className="bi bi-arrow-left"></i> Assigned enquiries
        </Link>
        <span>/</span>
        <span>{enq.id}</span>
      </div>

      <section className="rep-record-heading rep-customer-heading">
        <div>
          <div className="eyebrow">
            <span></span> RECEIVED {enq.dateReceived} · {enq.type}
          </div>
          <h2>
            {enq.machineTitle} <em>enquiry.</em>
          </h2>
          <p>
            {enq.company} <span>·</span> {enq.contactName} <span>·</span>{" "}
            {enq.id}
          </p>
        </div>
        <span className="status-pill">{enq.status}</span>
      </section>

      <div className="rep-detail-grid rep-customer-detail-grid">
        <section className="rep-section">
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Customer</h3>
              <p>Contact details for this machine request.</p>
            </div>
          </div>

          <div className="rep-customer-card">
            <span className="rep-customer-avatar">{enq.contactAvatar}</span>
            <div>
              <strong>{enq.contactName}</strong>
              <span>
                {enq.contactRole} · {enq.company}
              </span>
            </div>
            <Link
              aria-label="Open customer record"
              to={`/representative/customer-details?customer=${enq.customerKey}`}
            >
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>

          <div className="rep-contact-lines">
            <a href={`mailto:${enq.email}`}>
              <i className="bi bi-envelope"></i> {enq.email}
            </a>
            <a href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}>
              <i className="bi bi-telephone"></i> {enq.phone}
            </a>
            <span>
              <i className="bi bi-geo-alt"></i> {enq.location}
            </span>
          </div>

          <Link
            className="rep-text-link"
            to={`/representative/customer-details?customer=${enq.customerKey}`}
          >
            Open customer details <i className="bi bi-arrow-right"></i>
          </Link>
        </section>

        <section className="rep-section">
          <div className="rep-section-heading">
            <span>02</span>
            <div>
              <h3>Requested machine</h3>
              <p>Configuration submitted with the enquiry.</p>
            </div>
          </div>

          <div className="rep-config-summary">
            <div className="rep-machine-line">
              <div>
                <small>{enq.machineCode}</small>
                <strong>{enq.machineFull}</strong>
              </div>
              <span>Qty 1</span>
            </div>

            <dl>
              <dd>
                <div>
                  <dl>
                    <dt>Spindle</dt>
                    <dd>{enq.spindle}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Tooling</dt>
                    <dd>{enq.tooling}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Coolant</dt>
                    <dd>{enq.coolant}</dd>
                  </dl>
                </div>
                <div>
                  <dl>
                    <dt>Indicative price</dt>
                    <dd>{enq.price}</dd>
                  </dl>
                </div>
              </dd>
            </dl>

            <p className="rep-inline-note">
              Delivery timing and installation requirements were not provided.
            </p>
          </div>
        </section>

        <section className="rep-section rep-customer-wide">
          <div className="rep-section-heading">
            <span>03</span>
            <div>
              <h3>Customer message</h3>
              <p>Project context submitted with this enquiry.</p>
            </div>
          </div>

          <div className="rep-conversation-placeholder">
            <i className="bi bi-chat-square-text"></i>
            <div>
              <strong>{enq.subject}</strong>
              <span>{enq.message}</span>
            </div>
          </div>

          <div className="rep-contact-actions">
            <a
              className="button button-dark"
              href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
            >
              <i className="bi bi-telephone"></i> Call customer
            </a>
            <a
              className="button button-outline"
              href={`mailto:${enq.email}?subject=${encodeURIComponent(
                `${enq.machineTitle} enquiry - ${enq.id}`
              )}`}
            >
              <i className="bi bi-envelope"></i> Email customer
            </a>
            <Link
              className="button button-lime"
              to={`/representative/quotes?enquiry=${enq.id}`}
            >
              <i className="bi bi-receipt"></i> Prepare quote
            </Link>
          </div>
        </section>
      </div>

      <p className="summary-note rep-disclaimer">
        Sample enquiry details. Customer data and status are not connected to a
        live service.
      </p>
    </main>
  );
};

export default RepresentativeEnquiryDetails;
