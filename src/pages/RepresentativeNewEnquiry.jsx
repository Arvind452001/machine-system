import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RepresentativeNewEnquiry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    machine: "",
    quantity: 1,
    timeline: "Not discussed",
    status: "Needs first contact",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/representative/enquiries");
    }, 1200);
  };

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / CREATE ENQUIRY</span>
      </div>

      <div className="page-crumb rep-crumb">
        <Link to="/representative/enquiries">
          <i className="bi bi-arrow-left"></i> Assigned enquiries
        </Link>
        <span>/</span>
        <span>New customer enquiry</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> CUSTOMER INTAKE
          </div>
          <h1>New customer enquiry.</h1>
          <p>
            Capture the customer's details and the machine they want to
            discuss.
          </p>
        </div>
      </section>

      {submitted && (
        <div
          style={{
            background: "#e8f4ed",
            color: "#275b3f",
            padding: "14px 18px",
            borderRadius: "4px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          <i className="bi bi-check-circle-fill" style={{ fontSize: "16px" }}></i>
          <span>
            Enquiry created successfully! Redirecting to assigned enquiries queue...
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rep-detail-grid rep-customer-detail-grid"
      >
        <section className="rep-section">
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Customer details</h3>
              <p>Who should the representative follow up with?</p>
            </div>
          </div>

          <div className="rep-field-pair">
            <label>
              <span>First name</span>
              <input
                className="rep-input"
                name="firstName"
                placeholder="Morgan"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                className="rep-input"
                name="lastName"
                placeholder="Chen"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Work email</span>
              <input
                className="rep-input"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                className="rep-input"
                name="phone"
                placeholder="+1 555 010 2048"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Company</span>
              <input
                className="rep-input"
                name="company"
                placeholder="Company name"
                required
                value={formData.company}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Location</span>
              <input
                className="rep-input"
                name="location"
                placeholder="City, state"
                value={formData.location}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="rep-section">
          <div className="rep-section-heading">
            <span>02</span>
            <div>
              <h3>Enquiry details</h3>
              <p>Record the machine and project context.</p>
            </div>
          </div>

          <div className="rep-field-pair">
            <label>
              <span>Machine</span>
              <select
                className="rep-input"
                name="machine"
                required
                value={formData.machine}
                onChange={handleChange}
              >
                <option value="">Select a machine</option>
                <option value="Axis 400 · CNC lathe">
                  Axis 400 · CNC lathe
                </option>
                <option value="Arc 700 · Vertical machining centre">
                  Arc 700 · Vertical machining centre
                </option>
                <option value="Flare 6 · Fiber laser">
                  Flare 6 · Fiber laser
                </option>
                <option value="Other / not sure">Other / not sure</option>
              </select>
            </label>
            <label>
              <span>Quantity</span>
              <input
                className="rep-input"
                min="1"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Expected timeline</span>
              <select
                className="rep-input"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
              >
                <option value="Not discussed">Not discussed</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Within 6 months">Within 6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="Researching">Researching</option>
              </select>
            </label>
            <label>
              <span>Enquiry status</span>
              <select
                className="rep-input"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Needs first contact">Needs first contact</option>
                <option value="Requirements review">Requirements review</option>
                <option value="Quote in progress">Quote in progress</option>
              </select>
            </label>
          </div>

          <label className="rep-field-label" htmlFor="enquiry-notes">
            Project notes
          </label>
          <textarea
            className="rep-textarea"
            id="enquiry-notes"
            name="notes"
            placeholder="Application, materials, capacity, timing, or customer questions"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
          />
        </section>

        <div className="rep-customer-wide rep-contact-actions">
          <Link
            className="button button-outline"
            to="/representative/enquiries"
          >
            <i className="bi bi-x-lg"></i> Cancel
          </Link>
          <button className="button button-dark" type="submit">
            <i className="bi bi-check2"></i> Create enquiry
          </button>
        </div>
      </form>

      <p className="summary-note rep-disclaimer">
        Static preview. Enquiry details are not saved or sent to a live service.
      </p>
    </main>
  );
};

export default RepresentativeNewEnquiry;
