import { Link } from "react-router-dom";
const MyEnquiries = () => {
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
          <Link className="active" aria-current="page" to="/my-enquiries">
            <i className="bi bi-file-earmark-text"></i> My enquiries

          </Link>
          <Link  to="/my-quotations">
            <i className="bi bi-receipt"></i> My quotations

          </Link>
          <Link  to="/my-machines">
            <i className="bi bi-gear"></i> My machines

          </Link>
          <Link to="/profile-settings">
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
        <main className="customer-content account-hub">
          <div className="page-crumb">
            <Link to="/customer-dashboard">
              <i className="bi bi-arrow-left"></i> My workspace

            </Link>
            <span>/</span>
            <span>My enquiries</span>
          </div>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span></span> YOUR PROJECTS

              </div>
              <h1>My 

                <em>enquiries.</em>
              </h1>
              <p>Follow every machine request from first review to final quotation.</p>
            </div>
            <Link className="button button-dark" to="/machines">Explore machines 

              <i className="bi bi-arrow-right"></i>
            </Link>
          </section>
          <div className="account-notice">
            <i className="bi bi-info-circle"></i>
            <span>Sample account data for this website preview.</span>
          </div>
          <section className="account-table">
            <div className="table-head">
              <span>REFERENCE / MACHINE</span>
              <span>DATE</span>
              <span>STATUS</span>
              <span>INDICATIVE PRICE</span>
              <span></span>
            </div>
            <div className="enquiry-row">
              <div className="enquiry-name">
                <strong>Axis 400 · Precision CNC lathe</strong>
                <small>NL-ENQ-10482</small>
              </div>
              <span>Oct 12, 2026</span>
              <span className="status-pill">Awaiting contact</span>
              <span>$50,900</span>
              <Link className="row-action" to="/enquiry-details?id=NL-ENQ-10482" aria-label="View Axis 400 enquiry">
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
            <div className="enquiry-row">
              <div className="enquiry-name">
                <strong>Arc 700 · Vertical machining centre</strong>
                <small>NL-ENQ-09916</small>
              </div>
              <span>Sep 28, 2026</span>
              <span className="status-pill ready">Quote ready</span>
              <span>$78,500</span>
              <Link className="row-action" to="/enquiry-details?id=NL-ENQ-09916" aria-label="View Arc 700 enquiry">
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
            <div className="enquiry-row">
              <div className="enquiry-name">
                <strong>Flare 6 · Fiber laser system</strong>
                <small>NL-ENQ-08354</small>
              </div>
              <span>Aug 14, 2026</span>
              <span className="status-pill ready">Quote ready</span>
              <span>$108,600</span>
              <Link className="row-action" to="/enquiry-details?id=NL-ENQ-08354" aria-label="View Flare 6 enquiry">
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
          </section>
          <div className="account-bottom">
            <span className="account-help">
              <i className="bi bi-headset"></i> Questions about a request? 

              <Link to="/contact">Contact our team</Link>
            </span>
            <Link className="button button-lime" to="/enquiry">Start an enquiry 

              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MyEnquiries
