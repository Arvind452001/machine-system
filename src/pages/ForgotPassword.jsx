import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      const msg = "Please enter your registered email address.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      setSentSuccess(true);
      showSuccessAlert(
        "Reset Link Sent",
        res.data?.message || "A secure password reset link has been dispatched to your email."
      );
    } catch (err) {
      const failMsg =
        err.response?.data?.message ||
        err.message ||
        "Could not process password reset. Please verify your email.";
      setErrorMessage(failMsg);
      showErrorAlert("Request Failed", failMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="auth-page">
        <section className="auth-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Security &amp; Access
          </div>

          <h1>
            Trouble<br />
            signing <em> in?</em>
          </h1>

          <p>
            No worries. Enter your registered email address and we will dispatch a secure link to reset your account password.
          </p>

          <div className="auth-intro-note">
            <i className="bi bi-shield-check"></i>
            <span>
              Reset links expire in 10 minutes for your security.
              <br />
              Check your spam or junk folder if you don't see it right away.
            </span>
          </div>
        </section>

        <section className="auth-panel">
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>
              Reset Password
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
              Enter your work email to receive password reset instructions.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{errorMessage}</span>
            </div>
          )}

          {sentSuccess ? (
            <div
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "#4ade80",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  margin: "0 auto 16px",
                }}
              >
                <i className="bi bi-envelope-check"></i>
              </div>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Check your inbox
              </h3>
              <p style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
                We sent a password reset link to <strong style={{ color: "#fff" }}>{email}</strong>.
                Please check your email and click the button to set a new password.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  className="button button-lime"
                  onClick={() => setSentSuccess(false)}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Resend Email
                </button>
                <Link
                  to="/login"
                  className="button button-outline"
                  style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="email">
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="button button-lime"
                style={{ width: "100%", justifyContent: "center", cursor: "pointer", marginBottom: "16px" }}
                disabled={loading}
              >
                {loading ? "Sending reset link..." : "Send Reset Link"}
                <i className="bi bi-arrow-right"></i>
              </button>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link
                  to="/login"
                  style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="bi bi-arrow-left"></i> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default ForgotPassword;
