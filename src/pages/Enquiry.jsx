import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const Enquiry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const queryMachineName =
    searchParams.get("machine") || "Industrial Machinery Platform";
  const queryPrice = Number(searchParams.get("price")) || 0;
  const querySku = searchParams.get("sku") || "MD-SYS";

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    country: user?.region || "United States",
    timeline: "Within 3 months",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || (user.name ? user.name.split(" ")[0] : ""),
        lastName: prev.lastName || user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        company: prev.company || user.company || "",
        country: prev.country || user.country || user.region || "United States",
      }));
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showErrorAlert(
        "Customer Sign-In Required",
        "You must be logged in to submit an enquiry so your assigned representative can track it in your customer portal."
      );
      navigate("/login", { state: { from: `/enquiry${window.location.search}` } });
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim() || formData.email,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        country: formData.country,
        timeline: formData.timeline,
        message: formData.message || `Enquiry regarding ${queryMachineName}.`,
        machine: queryMachineName,
        machineTitle: `${queryMachineName} · Industrial System`,
        machineCode: querySku,
        quantity: 1,
        indicativePrice: queryPrice,
      };

      const res = await enquiriesApi.createEnquiry(payload);
      const enqNum =
        res?.data?.enquiryNumber || res?.data?.referenceNumber || "Submitted";
      await showSuccessAlert(
        "Enquiry Submitted Successfully",
        `Enquiry ${enqNum} has been received. Your regional representative will review your project.`
      );
      navigate("/customer/enquiries");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit enquiry. Please try again.";
      setErrorMsg(errMsg);
      showErrorAlert("Submission Failed", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/basket">
            <i className="bi bi-arrow-left"></i> Back to basket
          </Link>
          <span>/</span>
          <span>Send enquiry</span>
        </div>

        {!isAuthenticated && (
          <div
            style={{
              maxWidth: "1140px",
              margin: "0 auto 24px",
              padding: "16px 20px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <i className="bi bi-shield-lock" style={{ fontSize: "20px", color: "#d97706" }}></i>
              <div>
                <strong>Customer Sign-In Required:</strong>
                <div style={{ fontSize: "13px", marginTop: "2px" }}>
                  You must be logged in to submit an enquiry so your regional representative can assign your project to your customer portal.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link
                to="/login"
                state={{ from: `/enquiry${window.location.search}` }}
                className="button button-dark"
                style={{ padding: "8px 18px", fontSize: "12px", textDecoration: "none" }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="button button-outline"
                style={{ padding: "8px 18px", fontSize: "12px", textDecoration: "none" }}
              >
                Register
              </Link>
            </div>
          </div>
        )}

        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> Start a conversation
            </div>
            <h1>
              Let's talk <em> production.</em>
            </h1>
            <p>Share a few details so your local representative can prepare.</p>
          </div>
          <span className="page-index">02 / ENQUIRY</span>
        </section>

        {successMsg && (
          <div
            style={{
              maxWidth: "1140px",
              margin: "0 auto 20px",
              padding: "16px 20px",
              background: "#e8f4ed",
              color: "#275b3f",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-check-circle-fill"></i>
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              maxWidth: "1140px",
              margin: "0 auto 20px",
              padding: "16px 20px",
              background: "#fdf2f2",
              color: "#991b1b",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontWeight: 500,
            }}
          >
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <section className="enquiry-layout">
          <form className="enquiry-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <span>01</span>
              <div>
                <h2>Your details</h2>
                <p>How your representative can reach you.</p>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="first-name">
                  First name <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  required
                  placeholder="Morgan"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="last-name">
                  Last name <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="last-name"
                  name="lastName"
                  autoComplete="family-name"
                  required
                  placeholder="Chen"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="email">
                  Work email <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="email"
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
                <label className="form-label" htmlFor="phone">
                  Phone number <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="+1 555 010 2048"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="company">
                  Company <span className="required">*</span>
                </label>
                <input
                  className="form-control"
                  id="company"
                  name="company"
                  autoComplete="organization"
                  required
                  placeholder="Company name"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="form-label" htmlFor="country">
                  Country / region <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select a country</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-section mt-4">
              <span>02</span>
              <div>
                <h2>Your project</h2>
                <p>A little context helps us prepare.</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="timeline">
                When are you looking to install?
              </label>
              <select
                className="form-select"
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
              >
                <option value="">Choose a timeframe</option>
                <option>As soon as possible</option>
                <option>Within 3 months</option>
                <option>Within 6 months</option>
                <option>6–12 months</option>
                <option>Researching for now</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">
                What should we know? <span className="optional-label">OPTIONAL</span>
              </label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="4"
                placeholder="Materials, throughput, floor space, or questions for our team…"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <label className="consent-row">
              <input type="checkbox" required defaultChecked />
              <span>
                Northline Systems may contact me about this enquiry. Read our{" "}
                <Link to="/privacy">privacy notice</Link>.
              </span>
            </label>
            <button className="button button-lime mt-3" type="submit" disabled={loading}>
              {loading ? "Submitting enquiry..." : "Submit enquiry"} <i className="bi bi-arrow-right"></i>
            </button>
            <p className="summary-note mt-3">Enquiry data is saved to the live backend database.</p>
          </form>
          <aside className="enquiry-aside">
            <div className="aside-title">
              <i className="bi bi-bag-check"></i> CONFIGURATION SUMMARY
            </div>
            <div className="order-item">
              <span>{querySku}</span>
              <strong>{queryMachineName}</strong>
              <p>Platform specification &amp; custom options review</p>
            </div>
            <div className="order-total">
              <span>Indicative starting price</span>
              <strong>${queryPrice.toLocaleString()}</strong>
            </div>
            <div className="aside-help">
              <i className="bi bi-person-check"></i>
              <span>
                <strong>A local expert, not a bot.</strong>
                <br />
                Your country representative can review the build and discuss custom requirements.
              </span>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Enquiry;
