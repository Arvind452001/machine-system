import { useState } from "react";
import { Link } from "react-router-dom";

const LogIn = () => {
  const [role, setRole] = useState("customer");

  const isCustomer = role === "customer";

  return (
    <div>
      <main className="auth-page">
        <section className="auth-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Your MACHINE workspace
          </div>

          <h1>
            Good to have<br />
            you <em>back.</em>
          </h1>

          <p>
            Pick up where you left off. Your machine enquiries and
            conversations belong in one place.
          </p>

          <div className="auth-intro-note">
            <i className="bi bi-shield-check"></i>
            <span>
              Account access is a design preview.
              <br />
              Authentication is not connected.
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
              ? "After login, open your customer dashboard to view enquiries and quotations."
              : "After login, open your representative dashboard to manage customer enquiries and conversations."}
          </p>

          <div className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Work email
              </label>
              <input
                className="form-control"
                id="login-email"
                type="email"
                autoComplete="email"
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
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>

            <div className="auth-form-meta">
              <label>
                <input type="checkbox" /> Keep me signed in
              </label>
              <Link to="/contact">Forgot password?</Link>
            </div>

            <Link
              className="button button-lime"
              to={
                isCustomer
                  ? "/customer-dashboard"
                  : "/representative-dashboard"
              }
            >
              {isCustomer
                ? "Continue to my account"
                : "Continue to representative dashboard"}

              <i className="bi bi-arrow-right"></i>
            </Link>

            <p className="auth-switch">
              {isCustomer
                ? "New to MACHINE? "
                : "New representative? "}

              <Link to="/signup">Create an account</Link>
            </p>

            <p className="summary-note">
              Static preview only: this link opens the selected dashboard
              without checking credentials.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogIn;