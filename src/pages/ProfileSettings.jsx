import { Link } from "react-router-dom";
const ProfileSettings = () => {
  return (
   <div className="customer-shell">
      <aside className="customer-sidebar">
        <div className="customer-sidebar-intro">
          <span className="customer-nav-label">YOUR WORKSPACE</span>
          <h2>Built around<br/>your 

            <em>work.</em>
          </h2>
          <p>Enquiries, quotations, and machine details in one place.</p>
        </div>
        <nav className="customer-nav" aria-label="Customer navigation">
          <Link to="/customer-dashboard">
            <i className="bi bi-grid-1x2"></i> Overview

          </Link>
          <Link to="/my-enquiries">
            <i className="bi bi-file-earmark-text"></i> My enquiries

          </Link>
          <Link to="/my-quotations">
            <i className="bi bi-receipt"></i> My quotations

          </Link>
          <Link to="/my-machines">
            <i className="bi bi-gear"></i> My machines

          </Link>
          <Link className="active" to="/profile-settings" aria-current="page">
            <i className="bi bi-person-gear"></i> Profile settings

          </Link>
          <Link to="/login">
            <i className="bi bi-box-arrow-right"></i> Log out

          </Link>
        </nav>
       <div className="customer-sidebar-note">
          <i className="bi bi-headset"></i> Need a help?<br/>
        
        </div>
      </aside>
      <div className="customer-main">
        <main className="customer-content profile-settings-content">
          <section className="customer-welcome profile-welcome">
            <div>
              <div className="eyebrow">
                <span></span> ACCOUNT PREFERENCES

              </div>
              <h1>Profile 

                <em>settings.</em>
              </h1>
              <p>Keep your contact details up to date for quotes and machine enquiries.</p>
            </div>
           
          </section>

          <form className="profile-settings-form" id="profile-settings-form">
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
                  <input id="profile-name" name="name" autoComplete="name" value="Morgan Chen" required/>
                </div>
                <div className="profile-field">
                  <label htmlFor="profile-email">Work email</label>
                  <input id="profile-email" name="email" type="email" autoComplete="email" value="morgan@meridian.example" required/>
                </div>
                <div className="profile-field">
                  <label htmlFor="profile-phone">Phone number</label>
                  <input id="profile-phone" name="phone" type="tel" autoComplete="tel" value="+1 (555) 010-2048"/>
                </div>
                <div className="profile-field">
                  <label htmlFor="profile-company">Company</label>
                  <input id="profile-company" name="company" autoComplete="organization" value="Meridian Precision Works"/>
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
                  <select id="profile-region" name="region">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>
            <div className="profile-form-actions profile-between-cards-actions mb-5">
              <p>Static preview · Changes are not saved.</p>
              <button className="button button-dark" type="button">Save changes <i className="bi bi-check2"></i></button>
            </div>
            
          </form>

          
          <form className="profile-settings-form password-settings-form" id="password-settings-form">
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
                  <input id="current-password" name="current-password" type="password" autoComplete="current-password" required placeholder="Enter current password"/>
                </div>
                <div className="profile-field">
                  <label htmlFor="new-password">New password</label>
                  <input id="new-password" name="new-password" type="password" autoComplete="new-password" minlength="8" required placeholder="At least 8 characters"/>
                </div>
                <div className="profile-field">
                  <label htmlFor="confirm-password">Confirm new password</label>
                  <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" minlength="8" required placeholder="Re-enter new password"/>
                </div>
              </div>
              <div className="profile-form-actions password-form-actions">
                <p>Static preview · Password is not changed or saved.</p>
                <button className="button button-dark" type="button">Update password <i className="bi bi-shield-lock"></i></button>
              </div>
            </section>
          </form>
          <p className="summary-note">Static preview: profile and password changes are not saved.</p>
        </main>
      
      </div>
    </div>
  )
}

export default ProfileSettings
