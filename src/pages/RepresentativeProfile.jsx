import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const RepresentativeProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    role: user?.jobRole || user?.role || "Representative",
    email: user?.email || "",
    phone: user?.phone || "",
    region: user?.region || user?.country || "United States",
    territory: user?.territory || "Central",
    timezone: user?.timezone || "UTC",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    authApi
      .getMe()
      .then((res) => {
        if (mounted && (res?.data || res?.user)) {
          const u = res.data?.user || res.data || res.user || res;
          setProfile({
            name: u.name || "",
            role: u.jobRole || (u.role === "representative" ? "Country Representative" : u.role) || "Representative",
            email: u.email || "",
            phone: u.phone || "",
            region: u.country || u.region || "United States",
            territory: u.territory || "Territory",
            timezone: u.timezone || "UTC",
          });
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch rep profile:", err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile({
        name: profile.name,
        phone: profile.phone,
        country: profile.region,
        region: profile.region,
        territory: profile.territory,
        timezone: profile.timezone,
        jobRole: profile.role,
      });
      setSaved(true);
      showSuccessAlert("Profile Updated", "Your representative profile details have been saved.");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      showErrorAlert("Save Failed", err.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ACCOUNT</span>
        <span>
          <i className="bi bi-circle-fill"></i> REPRESENTATIVE
        </span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> REPRESENTATIVE ACCOUNT
          </div>
          <h1>My profile.</h1>
          <p>Manage your contact information and territory details.</p>
        </div>
      </section>

      {saved && (
        <div
          style={{
            background: "#e8f4ed",
            color: "#275b3f",
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          <i
            className="bi bi-check-circle-fill"
            style={{ fontSize: "16px" }}
          ></i>
          <span>Profile details saved successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="rep-detail-grid rep-customer-detail-grid"
      >
        <section className="rep-section">
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Personal details</h3>
              <p>Contact information used for customer follow-up.</p>
            </div>
          </div>

          <div className="rep-field-pair">
            <label>
              <span>Full name</span>
              <input
                className="rep-input"
                name="name"
                required
                value={profile.name}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Role</span>
              <input
                className="rep-input"
                name="role"
                value={profile.role}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Work email</span>
              <input
                className="rep-input"
                name="email"
                required
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                className="rep-input"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="rep-section">
          <div className="rep-section-heading">
            <span>02</span>
            <div>
              <h3>Territory</h3>
              <p>Regional assignment for enquiries and customers.</p>
            </div>
          </div>

          <div className="rep-field-pair">
            <label>
              <span>Country / region</span>
              <select
                className="rep-input"
                name="region"
                value={profile.region}
                onChange={handleChange}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
              </select>
            </label>
            <label>
              <span>Territory</span>
              <input
                className="rep-input"
                name="territory"
                value={profile.territory}
                onChange={handleChange}
              />
            </label>
            <label>
              <span>Time zone</span>
              <select
                className="rep-input"
                name="timezone"
                value={profile.timezone}
                onChange={handleChange}
              >
                <option value="Central Time (US & Canada)">
                  Central Time (US &amp; Canada)
                </option>
                <option value="Eastern Time (US & Canada)">
                  Eastern Time (US &amp; Canada)
                </option>
                <option value="Pacific Time (US & Canada)">
                  Pacific Time (US &amp; Canada)
                </option>
              </select>
            </label>
          </div>

          <div className="rep-customer-card" style={{ marginTop: "12px" }}>
            <span className="rep-customer-avatar">AM</span>
            <div>
              <strong>{profile.territory} territory</strong>
              <span>
                {profile.region} · 3 active enquiries
              </span>
            </div>
          </div>
        </section>

        <div className="rep-customer-wide rep-contact-actions">
          <Link
            className="button button-outline"
            to="/representative/dashboard"
          >
            <i className="bi bi-arrow-left"></i> Back to overview
          </Link>
          <button className="button button-dark" type="submit" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2"></i> Save profile
              </>
            )}
          </button>
        </div>
      </form>

      <p className="summary-note rep-disclaimer">
        Static preview. Profile changes are not saved to a live service.
      </p>
    </main>
  );
};

export default RepresentativeProfile;
