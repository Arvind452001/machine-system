import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const SignUp = () => {
  const navigate = useNavigate();
  const { register, verifyOtp, resendOtp } = useAuth();

  const [role, setRole] = useState("customer");
  const [step, setStep] = useState("form"); // "form" | "otp" | "rep_pending"

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // OTP Fields
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const isCustomer = role === "customer";

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!termsAgreed) {
      const msg = "Please agree to the terms and privacy notice.";
      setErrorMessage(msg);
      showErrorAlert("Terms Required", msg);
      return;
    }

    if (!email.trim() || !password.trim()) {
      const msg = "Please provide both an email and password.";
      setErrorMessage(msg);
      showErrorAlert("Missing Fields", msg);
      return;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters long.";
      setErrorMessage(msg);
      showErrorAlert("Password Too Short", msg);
      return;
    }

    setLoading(true);
    const fullName =
      [firstName, lastName].filter(Boolean).join(" ").trim() ||
      email.split("@")[0];

    const result = await register({
      firstName,
      lastName,
      name: fullName,
      company,
      email: email.trim().toLowerCase(),
      password,
      role,
      termsAccepted: true,
    });
    setLoading(false);

    if (result.success) {
      if (result.requiresOtp) {
        setStep("otp");
        setCountdown(60);
        setCanResend(false);
        setInfoMessage(`We sent a 6-digit verification code to ${email.trim()}.`);
        showSuccessAlert(
          "Verification Code Sent",
          `Please check your inbox at ${email.trim()} for your 6-digit code.`
        );
      } else {
        await showSuccessAlert(
          "Account Created",
          "Your account has been registered successfully."
        );
        navigate(
          isCustomer ? "/customer/dashboard" : "/representative/dashboard",
          { replace: true }
        );
      }
    } else {
      const failMsg = result.message || "Failed to create account.";
      setErrorMessage(failMsg);
      showErrorAlert("Registration Failed", failMsg);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      const msg = "Please enter the complete 6-digit verification code.";
      setErrorMessage(msg);
      showErrorAlert("Invalid Code", msg);
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email.trim().toLowerCase(), cleanOtp);
    setLoading(false);

    if (result.success) {
      if (result.requiresApproval || role === "representative") {
        setStep("rep_pending");
        showSuccessAlert(
          "Email Verified",
          "Your representative account application is now under review."
        );
      } else {
        await showSuccessAlert(
          "Account Activated",
          "Your email has been verified! Redirecting to your customer dashboard..."
        );
        navigate("/customer/dashboard", { replace: true });
      }
    } else {
      const failMsg = result.message || "Invalid or expired verification code.";
      setErrorMessage(failMsg);
      showErrorAlert("Verification Failed", failMsg);
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    setErrorMessage("");
    const result = await resendOtp(email.trim().toLowerCase());
    setLoading(false);

    if (result.success) {
      setCountdown(60);
      setCanResend(false);
      setInfoMessage("A new verification code has been sent to your email.");
      showSuccessAlert(
        "Code Resent",
        `A new 6-digit verification code was sent to ${email.trim()}.`
      );
    } else {
      const failMsg = result.message || "Failed to resend code.";
      setErrorMessage(failMsg);
      showErrorAlert("Resend Failed", failMsg);
    }
  };

  const handleResetToSignUp = () => {
    setStep("form");
    setOtp("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCompany("");
    setTermsAgreed(false);
    setErrorMessage("");
    setInfoMessage("");
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
                  <i
                    className="bi bi-exclamation-triangle-fill"
                    style={{ fontSize: "1.1rem" }}
                  ></i>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6 form-group">
                    <label className="form-label" htmlFor="signup-first-name">
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
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-12 form-group">
                    <label className="form-label" htmlFor="signup-password">
                      Create password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        className="form-control"
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingRight: "44px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "#6b7c72",
                          cursor: "pointer",
                          fontSize: "1.15rem",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="consent-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px" }}>
                  <input
                    id="signup-terms"
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#27624c" }}
                  />
                  <label htmlFor="signup-terms" style={{ cursor: "pointer", fontSize: "14px", color: "#475569", margin: 0 }}>
                    I agree to the <Link to="/terms" onClick={(e) => e.stopPropagation()}>terms</Link> and have read the <Link to="/privacy" onClick={(e) => e.stopPropagation()}>privacy notice</Link>.
                  </label>
                </div>

                <button
                  className="button button-lime mt-3"
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      Continue to verification
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
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#e8f7ee",
                  color: "#27624c",
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
              </div>

              <h2>Enter 6-digit code</h2>

              <p
                style={{
                  color: "#475569",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                We sent a 6-digit verification code to{" "}
                <strong style={{ color: "#0f172a" }}>{email}</strong>. Enter the
                code below to complete your registration.
              </p>

              {infoMessage && (
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
                  <i
                    className="bi bi-check-circle"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {infoMessage}
                </div>
              )}

              {errorMessage && (
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
                  <i
                    className="bi bi-exclamation-circle"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label
                    className="form-label"
                    htmlFor="otp-input"
                    style={{ fontWeight: 600 }}
                  >
                    Verification Code
                  </label>
                  <input
                    id="otp-input"
                    className="form-control"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, ""))
                    }
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
                  <small
                    style={{
                      color: "#64748b",
                      display: "block",
                      marginTop: "6px",
                    }}
                  >
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
                    cursor:
                      loading || otp.trim().length !== 6
                        ? "not-allowed"
                        : "pointer",
                    opacity: loading || otp.trim().length !== 6 ? 0.7 : 1,
                    marginBottom: "16px",
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Verifying code...
                    </>
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
                      setErrorMessage("");
                      setInfoMessage("");
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
                    {canResend
                      ? "Resend code"
                      : `Resend code in ${countdown}s`}
                  </button>
                </div>
              </form>
            </div>
          )}

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

              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.7",
                  margin: "16px 0 24px",
                }}
              >
                Thank you for verifying your email address,{" "}
                <strong>{firstName || "Representative"}</strong>. Your application
                as a Sales Representative has been submitted to the MACHINE Systems
                administration team for review.
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
                  <i
                    className="bi bi-clock-history"
                    style={{ marginRight: "6px", color: "#0284c7" }}
                  ></i>
                  What happens next?
                </div>
                <div>
                  Our team verifies company credentials within 1 business day.
                  You will receive an approval confirmation email once your
                  account is active.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Link
                  to="/login"
                  className="button button-lime"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    padding: "12px",
                  }}
                >
                  Return to Sign In
                  <i className="bi bi-box-arrow-in-right"></i>
                </Link>

                <button
                  type="button"
                  onClick={handleResetToSignUp}
                  className="button"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    background: "transparent",
                    border: "1px solid #d1d5db",
                    color: "#374151",
                    padding: "12px",
                    fontWeight: 500,
                    borderRadius: "4px",
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                  Return to Sign Up
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SignUp;
