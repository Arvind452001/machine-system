import { useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    topic: "Machine information",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiClient.createContact(formData);
      setSuccess(true);
      await showSuccessAlert(
        "Message Sent",
        "Thank you! Your message has been received by our specialist team."
      );
      setFormData((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      const errMsg =
        err.message || "Failed to send message. Please try again.";
      setError(errMsg);
      showErrorAlert("Submission Failed", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="contact-page">
        <div className="page-crumb">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Home
          </Link>
          <span>/</span>
          <span>Contact</span>
        </div>
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> Here to help
            </div>
            <h1>
              Talk to a <em> specialist.</em>
            </h1>
            <p>Tell us what you are making and our team will help you find the right next step.</p>
          </div>
          <span className="page-index">NORTHLINE / CONTACT</span>
        </section>
        <section className="contact-page-layout">
          <div className="contact-details-panel">
            <div className="contact-panel-kicker">
              NORTHLINE SYSTEMS <span>·</span> CUSTOMER TEAM
            </div>
            <h2>Good work starts with a conversation.</h2>
            <p>Ask about machine specifications, applications, service, or finding a local representative.</p>
            <a className="contact-detail-row" href="mailto:hello@northlinesystems.example">
              <span className="contact-detail-icon">
                <i className="bi bi-envelope"></i>
              </span>
              <span>
                <small>EMAIL OUR TEAM</small>
                <strong>hello@northlinesystems.example</strong>
              </span>
              <i className="bi bi-arrow-up-right"></i>
            </a>
            <a className="contact-detail-row" href="tel:+18005550142">
              <span className="contact-detail-icon">
                <i className="bi bi-telephone"></i>
              </span>
              <span>
                <small>CALL CUSTOMER SUPPORT</small>
                <strong>+1 (800) 555-0142</strong>
              </span>
              <i className="bi bi-arrow-up-right"></i>
            </a>
            <div className="contact-hours">
              <i className="bi bi-clock"></i>
              <span>
                <strong>Support hours</strong>
                <br />
                Monday–Friday, 8:00 am–5:00 pm Central Time
              </span>
            </div>
            <div className="contact-panel-note">
              <i className="bi bi-geo-alt"></i> Your enquiry will be routed to the appropriate regional team.
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <span>01</span>
              <div>
                <h2>Send us a message</h2>
                <p>Leave your details and a short note.</p>
              </div>
            </div>

            {success && (
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  background: "#e8f4ed",
                  color: "#275b3f",
                  fontWeight: 500,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
                <span>Thank you! Your message has been received by our specialist team.</span>
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "14px 18px",
                  borderRadius: "4px",
                  marginBottom: "16px",
                  background: "#fdf2f2",
                  color: "#991b1b",
                  fontWeight: 500,
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="row g-3">
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="contact-name">
                  Your name <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Morgan Chen"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="contact-email">
                  Work email <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="morgan@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="contact-phone">
                  Phone number
                </label>
                <input
                  className="form-control"
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 555 010 2048"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="contact-topic">
                  What can we help with?
                </label>
                <select
                  className="form-select"
                  id="contact-topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                >
                  <option>Machine information</option>
                  <option>Application advice</option>
                  <option>Service and support</option>
                  <option>Parts and accessories</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="col-12 form-group">
                <label className="form-label" htmlFor="contact-message">
                  Your message <span className="required">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="contact-message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Tell us about your question or project…"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <label className="consent-row">
              <input type="checkbox" required defaultChecked />
              <span>
                Northline Systems may contact me about this message. Read our{" "}
                <Link to="/privacy">privacy notice</Link>.
              </span>
            </label>
            <button className="button button-lime mt-3" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send message"} <i className="bi bi-arrow-right"></i>
            </button>
            <p className="contact-form-note">Your inquiry is logged securely in our backend database.</p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Contact;
