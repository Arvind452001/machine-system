import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || !confirmPassword) {
      const msg = "Please enter and confirm your new password.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match. Please re-enter.";
      setErrorMessage(msg);
      showErrorAlert("Validation Error", msg);
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, { password });
      setResetCompleted(true);
      await showSuccessAlert(
        "Password Updated",
        "Your password has been successfully reset. You can now sign in with your new password."
      );
      navigate("/login", { replace: true });
    } catch (err) {
      const failMsg =
        err.response?.data?.message ||
        err.message ||
        "Invalid or expired reset token. Please request a new link.";
      setErrorMessage(failMsg);
      showErrorAlert("Reset Failed", failMsg);
    } finally {
      setLoading(false);
    }
  };

  const eyeBtnStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#a1a1aa",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    zIndex: 2,
  };

  return (
    <div>
      <main className="auth-page">
        <section className="auth-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Account Recovery
          </div>

          <h1>
            Set a new<br />
            secure <em> password.</em>
          </h1>

          <p>
            Choose a strong password with at least 6 characters. Make sure you don't reuse old passwords.
          </p>

          <div className="auth-intro-note">
            <i className="bi bi-shield-lock-fill"></i>
            <span>
              Your new password will take effect immediately across all active sessions and portals.
            </span>
          </div>
        </section>

        <section className="auth-panel">
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", color: "#fff" }}>
              New Password
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
              Enter and confirm your new credentials below.
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

          {resetCompleted ? (
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
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
                Password Updated!
              </h3>
              <p style={{ color: "#a1a1aa", fontSize: "14px", marginBottom: "20px" }}>
                Your password has been changed successfully.
              </p>
              <Link
                to="/login"
                className="button button-lime"
                style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
              >
                Proceed to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label className="form-label" htmlFor="password">
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control"
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    style={eyeBtnStyle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    style={eyeBtnStyle}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="button button-lime"
                style={{ width: "100%", justifyContent: "center", cursor: "pointer", marginBottom: "16px" }}
                disabled={loading}
              >
                {loading ? "Updating password..." : "Set New Password"}
                <i className="bi bi-arrow-right"></i>
              </button>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <Link
                  to="/forgot-password"
                  style={{ color: "#a1a1aa", fontSize: "14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="bi bi-arrow-left"></i> Request another link
                </Link>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};

export default ResetPassword;
