import { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
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

          <h2>Create your account</h2>

          <p>
            {isCustomer
              ? "Your customer dashboard brings enquiries and quotations together after sign-in."
              : "Create your representative account to manage customer enquiries and quotation conversations."}
          </p>

          <div className="auth-form">
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
                />
              </div>

              <div className="col-12 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-email"
                >
                  Work email
                </label>
                <input
                  className="form-control"
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </div>

              <div className="col-12 form-group">
                <label
                  className="form-label"
                  htmlFor="signup-password"
                >
                  Create password
                </label>
                <input
                  className="form-control"
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <label className="consent-row">
              <input type="checkbox" />
              <span>
                I agree to the <Link to="/terms">terms</Link> and have read
                the <Link to="/privacy">privacy notice</Link>.
              </span>
            </label>

            <Link
              className="button button-lime mt-3"
              to={
                isCustomer
                  ? "/customer-dashboard"
                  : "/representative-dashboard"
              }
            >
              {isCustomer
                ? "Continue to customer dashboard"
                : "Continue to representative dashboard"}

              <i className="bi bi-arrow-right"></i>
            </Link>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <p className="summary-note">
              Static preview only: account details are not saved or verified.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignUp;