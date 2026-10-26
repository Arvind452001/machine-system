import { useEffect, useState } from "react";
import { authApi, apiClient } from "../api";
import { useAuth } from "../context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const ProfileSettings = () => {
  const { user, updateProfile: updateAuthUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    region: user?.country || user?.region || "United States",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let mounted = true;
    authApi
      .getMe()
      .then((res) => {
        if (mounted && (res?.data || res?.user)) {
          const u = res.data?.user || res.data || res.user || res;
          setProfileData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            company: u.company || "",
            region: u.country || u.region || "United States",
          });
        }
      })
      .catch((err) => {
        console.warn("Could not load latest profile:", err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage({ text: "", type: "" });
    try {
      const res = await (updateAuthUser
        ? updateAuthUser({
            name: profileData.name,
            phone: profileData.phone,
            company: profileData.company,
            country: profileData.region,
            region: profileData.region,
          })
        : authApi.updateProfile({
            name: profileData.name,
            phone: profileData.phone,
            company: profileData.company,
            country: profileData.region,
            region: profileData.region,
          }));

      if (res?.success === false) {
        throw new Error(res.message || "Failed to update profile");
      }

      const msg = res?.message || res?.data?.message || "Profile updated successfully!";
      setProfileMessage({ text: msg, type: "success" });
      showSuccessAlert("Profile Updated", msg);
    } catch (err) {
      const errTxt = err.message || "Failed to update profile";
      setProfileMessage({ text: errTxt, type: "error" });
      showErrorAlert("Update Failed", errTxt);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      const msg = "New passwords do not match";
      setPasswordMessage({ text: msg, type: "error" });
      showErrorAlert("Validation Error", msg);
      return;
    }
    setSavingPassword(true);
    setPasswordMessage({ text: "", type: "" });
    try {
      const res = await apiClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      const msg = res?.message || "Password updated successfully!";
      setPasswordMessage({ text: msg, type: "success" });
      showSuccessAlert("Password Updated", msg);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errTxt = err.message || "Failed to update password";
      setPasswordMessage({ text: errTxt, type: "error" });
      showErrorAlert("Password Update Failed", errTxt);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <main className="customer-content profile-settings-content">
      <section className="customer-welcome profile-welcome">
        <div>
          <div className="eyebrow">
            <span></span> ACCOUNT PREFERENCES
          </div>
          <h1>
            Profile <em> settings.</em>
          </h1>
          <p>Keep your contact details up to date for quotes and machine enquiries.</p>
        </div>
      </section>

      <form className="profile-settings-form" id="profile-settings-form" onSubmit={handleProfileSubmit}>
        <section className="profile-form-card">
          <div className="profile-form-heading">
            <span>01</span>
            <div>
              <h2>Personal details</h2>
              <p>How your Northline team can reach you.</p>
            </div>
          </div>
          <div className="profile-fields">
            <div className="profile-field">
              <label htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                name="name"
                autoComplete="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="profile-field">
              <label htmlFor="profile-email">Work email</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                autoComplete="email"
                value={profileData.email}
                disabled
                title="Email cannot be changed directly"
              />
            </div>
            <div className="profile-field">
              <label htmlFor="profile-phone">Phone number</label>
              <input
                id="profile-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="profile-company">Company</label>
              <input
                id="profile-company"
                name="company"
                autoComplete="organization"
                value={profileData.company}
                onChange={handleProfileChange}
              />
            </div>
          </div>
        </section>
        <section className="profile-form-card">
          <div className="profile-form-heading">
            <span>02</span>
            <div>
              <h2>Regional preferences</h2>
              <p>Help us connect you with the right local team.</p>
            </div>
          </div>
          <div className="profile-fields profile-fields-single">
            <div className="profile-field">
              <label htmlFor="profile-region">Country or region</label>
              <select
                id="profile-region"
                name="region"
                value={profileData.region}
                onChange={handleProfileChange}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {profileMessage.text && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "4px",
              margin: "12px 0",
              fontSize: "13px",
              background: profileMessage.type === "success" ? "#e8f4ed" : "#fdf2f2",
              color: profileMessage.type === "success" ? "#275b3f" : "#991b1b",
            }}
          >
            {profileMessage.text}
          </div>
        )}

        <div className="profile-form-actions profile-between-cards-actions mb-5">
          <p>Profile information is securely saved in your database account.</p>
          <button className="button button-dark" type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save changes"} <i className="bi bi-check2"></i>
          </button>
        </div>
      </form>

      <form className="profile-settings-form password-settings-form" id="password-settings-form" onSubmit={handlePasswordSubmit}>
        <section className="profile-form-card">
          <div className="profile-form-heading">
            <span>03</span>
            <div>
              <h2>Password &amp; security</h2>
              <p>Choose a strong password to help protect your account.</p>
            </div>
          </div>
          <div className="profile-fields">
            <div className="profile-field">
              <label htmlFor="current-password">Current password</label>
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="new-password">New password</label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="Re-enter new password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {passwordMessage.text && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px",
                margin: "12px 0",
                fontSize: "13px",
                background: passwordMessage.type === "success" ? "#e8f4ed" : "#fdf2f2",
                color: passwordMessage.type === "success" ? "#275b3f" : "#991b1b",
              }}
            >
              {passwordMessage.text}
            </div>
          )}

          <div className="profile-form-actions password-form-actions">
            <p>Your password is encrypted using modern bcrypt hashing.</p>
            <button className="button button-dark" type="submit" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update password"} <i className="bi bi-shield-lock"></i>
            </button>
          </div>
        </section>
      </form>
    </main>
  );
};

export default ProfileSettings;
