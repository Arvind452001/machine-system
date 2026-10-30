import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";
import { machinesApi } from "../api/machinesApi";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const Enquiry = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Retrieve configuration from router state or saved localStorage
  const locationState = location.state || {};
  let savedConfig = null;
  try {
    const raw = localStorage.getItem("machine_configured_enquiry");
    if (raw) savedConfig = JSON.parse(raw);
  } catch (e) {
    // ignore
  }

  const queryMachineName =
    searchParams.get("machine") ||
    locationState.machineName ||
    savedConfig?.machineName ||
    "Axis 400 · Precision CNC lathe";
  const queryPrice =
    Number(searchParams.get("price")) ||
    Number(locationState.calculatedTotal) ||
    Number(savedConfig?.calculatedTotal) ||
    0;
  const querySku =
    searchParams.get("sku") ||
    locationState.machineCode ||
    savedConfig?.machineCode ||
    "AX-400";
  const initialMachineId =
    searchParams.get("machineId") ||
    searchParams.get("id") ||
    locationState.machineId ||
    savedConfig?.machineId ||
    "";
  const initialOptions =
    locationState.selectedOptions ||
    savedConfig?.selectedOptions ||
    [];

  const [machineId, setMachineId] = useState(initialMachineId);
  const [machineName, setMachineName] = useState(queryMachineName);
  const [machineCode, setMachineCode] = useState(querySku);
  const [calculatedTotal, setCalculatedTotal] = useState(queryPrice);
  const [selectedOptions, setSelectedOptions] = useState(
    Array.isArray(initialOptions) ? initialOptions : []
  );

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "",
    lastName: user?.name ? user.name.split(" ").slice(1).join(" ") : "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    country: user?.region || user?.country || "United States",
    whenToInstall: "Within 1-3 months",
    whatShouldWeKnow: "",
    contactConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync user profile data if available
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

  // Lookup machine from API to populate machineId & default options if not yet provided
  useEffect(() => {
    let mounted = true;
    machinesApi
      .getMachines()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (list.length === 0) return;

        const match = list.find((m) => {
          if (initialMachineId && m._id === initialMachineId) return true;
          if (querySku && (m.sku?.toLowerCase() === querySku.toLowerCase() || m.code?.toLowerCase() === querySku.toLowerCase())) return true;
          if (queryMachineName && m.name?.toLowerCase() === queryMachineName.toLowerCase()) return true;
          if (querySku && m.slug?.toLowerCase() === querySku.toLowerCase()) return true;
          return false;
        });

        if (match) {
          if (!machineId) setMachineId(match._id);
          if (!machineName || machineName === "Industrial Machinery Platform") {
            setMachineName(match.name);
          }
          if (!machineCode || machineCode === "MD-SYS") {
            setMachineCode(match.sku || match.code || querySku);
          }
          if (!calculatedTotal && match.basePrice) {
            setCalculatedTotal(Number(match.basePrice));
          }
          setSelectedOptions((prev) => {
            if (Array.isArray(prev) && prev.length > 0) return prev;
            if (Array.isArray(match.availableOptions) && match.availableOptions.length > 0) {
              return match.availableOptions
                .filter((o) => o && (o.isDefault || Number(o.priceDelta) === 0))
                .map((o) => ({
                  name: o.name || o.label || "Standard option",
                  priceDelta: Number(o.priceDelta) || 0,
                }));
            }
            return [];
          });
        } else if (!machineId && list[0]?._id) {
          setMachineId(list[0]._id);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch machines list in Enquiry:", err.message);
      });

    return () => {
      mounted = false;
    };
  }, [initialMachineId, querySku, queryMachineName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      const activeMachineId =
        machineId || initialMachineId || "6ad9fc28e39daefd54e568ff";
      const activeMachineName =
        machineName || queryMachineName || "Axis 400 · Precision CNC lathe";
      const activeMachineCode = machineCode || querySku || "AX-400";
      const activeCalculatedTotal = Number(
        calculatedTotal || queryPrice || 0
      );
      const activeSelectedOptions =
        Array.isArray(selectedOptions) && selectedOptions.length > 0
          ? selectedOptions
          : [];

      // Send complete payload strictly matching Swagger specification
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        country: formData.country,
        whenToInstall: formData.whenToInstall || "Within 1-3 months",
        whatShouldWeKnow:
          formData.whatShouldWeKnow.trim() ||
          `Looking for information regarding ${activeMachineName}.`,
        machineCode: activeMachineCode,
        machineName: activeMachineName,
        machineId: activeMachineId,
        calculatedTotal: activeCalculatedTotal,
        selectedOptions: activeSelectedOptions,
        contactConsent: Boolean(formData.contactConsent),

        // Backward compatibility attributes for legacy services
        name: `${formData.firstName} ${formData.lastName}`.trim() || formData.email,
        timeline: formData.whenToInstall || "Within 1-3 months",
        message:
          formData.whatShouldWeKnow.trim() ||
          `Looking for information regarding ${activeMachineName}.`,
        machine: activeMachineName,
        machineTitle: `${activeMachineName} · Industrial System`,
        quantity: 1,
        indicativePrice: activeCalculatedTotal,
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
                id="whenToInstall"
                name="whenToInstall"
                value={formData.whenToInstall}
                onChange={handleChange}
              >
                <option value="">Choose a timeframe</option>
                <option value="Within 1-3 months">Within 1-3 months</option>
                <option value="Within 3-6 months">Within 3-6 months</option>
                <option value="6-12 months">6–12 months</option>
                <option value="As soon as possible">As soon as possible</option>
                <option value="Researching for now">Researching for now</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="whatShouldWeKnow">
                What should we know? <span className="optional-label">OPTIONAL</span>
              </label>
              <textarea
                className="form-control"
                id="whatShouldWeKnow"
                name="whatShouldWeKnow"
                rows="4"
                placeholder="Looking for titanium milling capabilities, high precision tolerance, and 2 shifts/day throughput."
                value={formData.whatShouldWeKnow}
                onChange={handleChange}
              ></textarea>
            </div>
            <label className="consent-row">
              <input
                type="checkbox"
                id="contactConsent"
                name="contactConsent"
                checked={formData.contactConsent}
                onChange={handleChange}
                required
              />
              <span>
                Northline Systems may contact me about this enquiry. Read our{" "}
                <Link to="/privacy">privacy notice</Link>.
              </span>
            </label>
            <button className="button button-lime mt-3" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting enquiry...
                </>
              ) : (
                <>
                  Submit enquiry <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
            <p className="summary-note mt-3">Enquiry data is saved to the live backend database.</p>
          </form>
          <aside className="enquiry-aside">
            <div className="aside-title">
              <i className="bi bi-bag-check"></i> CONFIGURATION SUMMARY
            </div>
            <div className="order-item">
              <span>{machineCode || querySku}</span>
              <strong>{machineName || queryMachineName}</strong>
              <p>Platform specification &amp; custom options review</p>
            </div>
            <div className="order-total">
              <span>Calculated Total</span>
              <strong>${(calculatedTotal || queryPrice).toLocaleString()}</strong>
            </div>

            {selectedOptions && selectedOptions.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    marginBottom: "8px",
                  }}
                >
                  Selected Options ({selectedOptions.length})
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "13px",
                    display: "grid",
                    gap: "6px",
                  }}
                >
                  {selectedOptions.map((opt, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#374151",
                      }}
                    >
                      <span>{opt.name}</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: opt.priceDelta > 0 ? "#0d9488" : "#9ca3af",
                        }}
                      >
                        {opt.priceDelta > 0
                          ? `+$${Number(opt.priceDelta).toLocaleString()}`
                          : "Included"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
