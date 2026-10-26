import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const SignUp = () => {
  const { user, isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, do not show signup page - redirect straight to dashboard
  if (isAuthenticated) {
    const targetDashboard =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

  const isCustomer = role === "customer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      const msg = "Please provide a work email and password.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErrorMessage(msg);
      showErrorAlert("Password Too Short", msg);
      return;
    }

    setLoading(true);
    const result = await register({
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" ").trim() || email.split("@")[0],
      company,
      email: email.trim(),
      password,
      role,
    });
    setLoading(false);

    if (result.success) {
      await showSuccessAlert(
        "Account Created",
        "Your account has been registered successfully."
      );
      navigate(
        isCustomer ? "/customer/dashboard" : "/representative/dashboard",
        { replace: true }
      );
    } else {
      const failMsg = result.message || "Failed to create account.";
      setErrorMessage(failMsg);
      showErrorAlert("Registration Failed", failMsg);
    }
  };

  return (
    <div>
      <main className="auth-page">
        <section className="auth-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Your MACHINE workspace
          </div>

          <h1>
            Make the next<br />
            step <em>yours.</em>
          </h1>

          <p>
            Create a place to keep your machine enquiries, configurations,
            and quotation conversations together.
          </p>

          <div className="auth-intro-note">
            <i className="bi bi-person-check"></i>
            <span>
              {isCustomer
                ? "One customer account."
                : "One representative account."}
              <br />
              {isCustomer
                ? "A clearer view of every enquiry."
                : "A better way to manage customer enquiries."}
            </span>
          </div>
        </section>

        <section className="auth-panel">
          {/* Role Switch Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setRole("customer");
                setErrorMessage("");
              }}
              className={isCustomer ? "button button-lime" : "button"}
              style={{ flex: 1, cursor: "pointer" }}
              aria-pressed={isCustomer}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("representative");
                setErrorMessage("");
              }}
              className={!isCustomer ? "button button-lime" : "button"}
              style={{ flex: 1, cursor: "pointer" }}
              aria-pressed={!isCustomer}
            >
              Representative
            </button>
          </div>

          <div className="eyebrow">
            <span></span>
            {isCustomer ? "Customer account" : "Representative account"}
          </div>

          <h2>Create your account</h2>

          <p>
            {isCustomer
              ? "Your customer dashboard brings enquiries and quotations together after sign-in."
              : "Create your representative account to manage customer enquiries and quotation conversations."}
          </p>

          {errorMessage && (
            <div
              role="alert"
              style={{
                margin: "16px 0",
                padding: "12px 16px",
                background: "#fde8e4",
                border: "1px solid #e87a5d",
                color: "#9e2c14",
                borderRadius: "6px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "1.1rem" }}></i>
              <span>{errorMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-6 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-first-name"
                >
                  First name
                </label>
                <input
                  className="form-control"
                  id="signup-first-name"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="col-sm-6 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-last-name"
                >
                  Last name
                </label>
                <input
                  className="form-control"
                  id="signup-last-name"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="col-12 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-company"
                >
                  Company
                </label>
                <input
                  className="form-control"
                  id="signup-company"
                  autoComplete="organization"
                  placeholder="Company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="col-12 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-email"
                >
                  Work email *
                </label>
                <input
                  className="form-control"
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="col-12 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-password"
                >
                  Create password *
                </label>
                <input
                  className="form-control"
                  id="signup-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <label className="consent-row">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
              />
              <span>
                I agree to the <Link to="/terms">terms</Link> and have read
                the <Link to="/privacy">privacy notice</Link>.
              </span>
            </label>

            <button
              className="button button-lime mt-3"
              type="submit"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}
            >
              {loading
                ? "Creating account..."
                : isCustomer
                ? "Continue to customer dashboard"
                : "Continue to representative dashboard"}

              <i className="bi bi-arrow-right"></i>
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SignUp;