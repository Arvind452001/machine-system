import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const LogIn = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // If already logged in, do not show login page - redirect straight to dashboard
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
      const msg = "Please enter both work email and password.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    const result = await login(email, password, role);

    if (result.success) {
      await showSuccessAlert("Welcome Back", "Authentication successful.");
      const fromPath = location.state?.from?.pathname;
      const defaultDashboard =
        result.user.role === "representative"
          ? "/representative/dashboard"
          : "/customer/dashboard";

      const validDestination =
        fromPath && fromPath !== "/login" && fromPath !== "/signup"
          ? fromPath
          : defaultDashboard;

      navigate(validDestination, { replace: true });
    } else {
      const failMsg = result.message || "Login failed. Please verify credentials.";
      setErrorMessage(failMsg);
      showErrorAlert("Login Failed", failMsg);
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
            Good to have<br />
            you <em> back.</em>
          </h1>

          <p>
            Pick up where you left off. Your machine enquiries, quotations,
            and representative conversations belong in one place.
          </p>

          <div className="auth-intro-note">
            <i className="bi bi-shield-lock"></i>
            <span>
              Your account and session are securely protected.
              <br />
              Enter your credentials to access your workspace.
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
              onClick={() => setRole("customer")}
              className={isCustomer ? "button button-lime" : "button"}
              style={{ flex: 1, cursor: "pointer" }}
              aria-pressed={isCustomer}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("representative")}
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

          <h2>Log in</h2>

          <p>
            {isCustomer
              ? "Sign in to open your customer dashboard, submit machine enquiries, and review quotations."
              : "Sign in to access your representative dashboard, manage customer enquiries, and prepare quotes."}
          </p>

          {/* Error Message Alert */}
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
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Work email
              </label>
              <input
                className="form-control"
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <input
                className="form-control"
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="auth-form-meta">
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Keep me signed in
              </label>
              <Link to="/contact">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="button button-lime"
              style={{ width: "100%", justifyContent: "center", cursor: "pointer" }}
            >
              {isCustomer
                ? "Sign in as Customer"
                : "Sign in as Representative"}
              <i className="bi bi-arrow-right"></i>
            </button>

            <p className="auth-switch">
              {isCustomer
                ? "New to MACHINE? "
                : "New representative? "}
              <Link to="/signup">Create an account</Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default LogIn;