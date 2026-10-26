<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const SignUp = () => {
<<<<<<< HEAD
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
=======
  const { user, isAuthenticated, register, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4

  // If already logged in, redirect straight to dashboard
  if (isAuthenticated) {
    const targetDashboard =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

<<<<<<< HEAD
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
=======
  // Steps: 'form' | 'otp' | 'rep_pending'
  const [step, setStep] = useState("form");
  const [role, setRole] = useState("customer");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // OTP states
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const isCustomer = role === "customer";

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle Initial Registration (Submits form & triggers OTP)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and privacy notice to continue.");
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
      return;
    }

    setLoading(true);
<<<<<<< HEAD
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
=======

    try {
      const res = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        company: company.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        termsAccepted: agreeToTerms,
      });

      if (res.success && res.requiresOtp) {
        setStep("otp");
        setCountdown(60);
        setCanResend(false);
        setInfoMsg(`Verification code sent to ${email.trim().toLowerCase()}`);
      } else if (!res.success) {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOtp(email.trim().toLowerCase(), otp.trim());

      if (res.success) {
        if (isCustomer) {
          // Customer is verified and automatically logged in
          navigate("/customer/dashboard");
        } else {
          // Representative is verified and now awaits admin approval
          setStep("rep_pending");
        }
      } else {
        setError(res.message || "Invalid or expired verification code.");
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (!canResend || loading) return;
    setError("");
    setInfoMsg("");
    setLoading(true);

    try {
      const res = await resendOtp(email.trim().toLowerCase());
      if (res.success) {
        setInfoMsg("A new 6-digit code has been sent to your email.");
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(res.message || "Failed to resend code.");
      }
    } catch (err) {
      setError("Network error while requesting new code.");
    } finally {
      setLoading(false);
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
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
<<<<<<< HEAD
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
=======
          {/* STEP 1: Registration Form */}
          {step === "form" && (
            <>
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
                    setError("");
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
                    setError("");
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
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
              </div>

              <h2>Create your account</h2>

              <p>
                {isCustomer
                  ? "Enter your details to receive an email verification code."
                  : "Apply as a sales representative. An email verification code will be sent."}
              </p>

              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#fef2f2",
                    border: "1px solid #f87171",
                    borderRadius: "6px",
                    color: "#991b1b",
                    fontSize: "14px",
                    marginBottom: "18px",
                  }}
                >
                  <i className="bi bi-exclamation-circle" style={{ marginRight: "8px" }}></i>
                  {error}
                </div>
              )}

              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="signup-first-name">
                      First name *
                    </label>
                    <input
                      className="form-control"
                      id="signup-first-name"
                      autoComplete="given-name"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="signup-last-name">
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
                    <label className="form-label" htmlFor="signup-company">
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
                    <label className="form-label" htmlFor="signup-email">
                      Work email *
                    </label>
                    <input
                      className="form-control"
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 form-group">
                    <label className="form-label" htmlFor="signup-password">
                      Create password *
                    </label>
                    <input
                      className="form-control"
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <label className="consent-row">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the <Link to="/terms">terms</Link> and have read
                    the <Link to="/privacy">privacy notice</Link>.
                  </span>
                </label>
<<<<<<< HEAD
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
=======

                <button
                  type="submit"
                  disabled={loading}
                  className="button button-lime mt-3"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    "Sending verification code..."
                  ) : (
                    <>
                      {isCustomer
                        ? "Continue to Email Verification"
                        : "Verify Representative Email"}
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>

                <p className="auth-switch">
                  Already have an account? <Link to="/login">Log in</Link>
                </p>
              </form>
            </>
          )}

          {/* STEP 2: 6-Digit OTP Verification Screen */}
          {step === "otp" && (
            <div>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#e0f2fe",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "16px",
                }}
              >
                <i className="bi bi-shield-check"></i>
              </div>

              <div className="eyebrow">
                <span></span> Two-step Verification
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
              </div>

              <h2>Enter 6-digit code</h2>

              <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                We sent a 6-digit verification code to{" "}
                <strong style={{ color: "#0f172a" }}>{email}</strong>.
                Enter the code below to complete your registration.
              </p>

              {infoMsg && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "6px",
                    color: "#166534",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
<<<<<<< HEAD
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
=======
                  <i className="bi bi-check-circle" style={{ marginRight: "6px" }}></i>
                  {infoMsg}
                </div>
              )}

              {error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#fef2f2",
                    border: "1px solid #f87171",
                    borderRadius: "6px",
                    color: "#991b1b",
                    fontSize: "13px",
                    marginBottom: "16px",
                  }}
                >
                  <i className="bi bi-exclamation-circle" style={{ marginRight: "6px" }}></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label className="form-label" htmlFor="otp-input" style={{ fontWeight: 600 }}>
                    Verification Code
                  </label>
                  <input
                    id="otp-input"
                    className="form-control"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{
                      fontSize: "28px",
                      letterSpacing: "8px",
                      textAlign: "center",
                      fontWeight: 700,
                      padding: "12px",
                      fontFamily: "monospace",
                    }}
                    autoFocus
                    required
                  />
                  <small style={{ color: "#64748b", display: "block", marginTop: "6px" }}>
                    Code expires in 10 minutes.
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.trim().length !== 6}
                  className="button button-lime"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: loading || otp.trim().length !== 6 ? "not-allowed" : "pointer",
                    opacity: loading || otp.trim().length !== 6 ? 0.7 : 1,
                    marginBottom: "16px",
                  }}
                >
                  {loading ? (
                    "Verifying..."
                  ) : (
                    <>
                      Verify & Activate Account
                      <i className="bi bi-check-lg"></i>
                    </>
                  )}
                </button>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid #f1f5f9",
                    fontSize: "14px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError("");
                      setInfoMsg("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    Wrong email? Go back
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    style={{
                      background: "none",
                      border: "none",
                      color: canResend ? "#0284c7" : "#94a3b8",
                      fontWeight: 600,
                      cursor: canResend ? "pointer" : "not-allowed",
                      padding: 0,
                    }}
                  >
                    {canResend ? "Resend code" : `Resend code in ${countdown}s`}
                  </button>
                </div>
              </form>
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
            </div>
          )}

<<<<<<< HEAD
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
=======
          {/* STEP 3: Representative Pending Approval Notice */}
          {step === "rep_pending" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  margin: "0 auto 20px",
                }}
              >
                <i className="bi bi-envelope-check"></i>
              </div>

              <div className="eyebrow" style={{ justifyContent: "center" }}>
                <span></span> Application Under Review
              </div>

              <h2>Email Verified!</h2>

              <p style={{ color: "#475569", lineHeight: "1.7", margin: "16px 0 24px" }}>
                Thank you for verifying your email address, <strong>{firstName}</strong>.
                Your application as a Sales Representative has been submitted to the
                MACHINE Systems administration team for review.
              </p>

              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "left",
                  fontSize: "14px",
                  color: "#334155",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  <i className="bi bi-clock-history" style={{ marginRight: "6px", color: "#0284c7" }}></i>
                  What happens next?
                </div>
                <div>
                  Our team verifies company credentials within 1 business day.
                  You will receive an approval confirmation email once your account is active.
                </div>
              </div>

              <Link
                to="/login"
                className="button button-lime"
                style={{ width: "100%", display: "inline-block", textAlign: "center" }}
              >
                Return to Sign In
              </Link>
            </div>
          )}
>>>>>>> 3cdc328a050876157e848e61151db4f1f4c113e4
        </section>
      </main>
    </div>
  );
};

export default SignUp;
