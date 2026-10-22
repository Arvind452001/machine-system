import { Link } from "react-router-dom";
const EnquiryDetails = () => {
  return (
    <main className="customer-content account-hub">
          <div className="page-crumb">
            <Link to="/customer/enquiries">
              <i className="bi bi-arrow-left"></i> My enquiries

            </Link>
            <span>/</span>
            <span>Enquiry details</span>
          </div>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span></span> ENQUIRY NL-ENQ-10482

              </div>
              <h1>Axis 400 

                <em> enquiry.</em>
              </h1>
              <p>Submitted October 12, 2026 · Precision CNC lathe</p>
            </div>
            <span className="status-pill">Awaiting contact</span>
          </section>
          <div className="account-detail-grid">
            <section className="account-detail-card">
              <div className="account-detail-title">
                <span>01</span>
                <div>
                  <h2>Request summary</h2>
                  <p>Your selected machine and starting specification.</p>
                </div>
              </div>
              <div className="account-machine-summary">
                <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=900&amp;fmt=webp" alt="CNC lathe"/>
                <div>
                  <small>AX-400 · CNC TURNING</small>
                  <h3>Axis 400</h3>
                  <p>Precision CNC lathe</p>
                </div>
              </div><dl className="account-specs">


                <div><dt>Spindle</dt><dd>Standard · 8,000 rpm</dd></div>


                <div><dt>Tooling</dt><dd>10-station turret</dd></div>


                <div><dt>Coolant</dt><dd>Standard coolant</dd></div>


                <div><dt>Reference</dt><dd>NL-ENQ-10482</dd></div></dl>
            </section>
            <aside className="account-detail-card account-status-card">
              <div className="account-detail-title">
                <span>02</span>
                <div>
                  <h2>What happens next</h2>
                  <p>Our regional team will review your requirements.</p>
                </div>
              </div>
              <ol className="account-timeline">
                <li className="done">
                  <span>
                    <i className="bi bi-check"></i>
                  </span>
                  <div>
                    <strong>Enquiry received</strong>
                    <small>October 12, 2026</small>
                  </div>
                </li>
                <li className="current">
                  <span>2</span>
                  <div>
                    <strong>Specialist review</strong>
                    <small>We are checking your configuration</small>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Personal follow-up</strong>
                    <small>Your local team will be in touch</small>
                  </div>
                </li>
              </ol>
              <div className="account-total">
                <span>Indicative starting price</span>
                <strong>$50,900</strong>
              </div>
              <Link className="button button-dark w-100" to="/contact">Contact our team 

                <i className="bi bi-arrow-right"></i>
              </Link>
            </aside>
          </div>
          <p className="summary-note">Sample enquiry record. Account activity is not connected to a live service.</p>
        </main>
  );
};

export default EnquiryDetails;
