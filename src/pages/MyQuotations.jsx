import { Link } from "react-router-dom";
const MyQuotations = () => {
  return (
    <main className="customer-content account-hub">
          <div className="page-crumb">
            <Link to="/customer/dashboard">
              <i className="bi bi-arrow-left"></i> My workspace

            </Link>
            <span>/</span>
            <span>My quotations</span>
          </div>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span></span> YOUR PROJECTS

              </div>
              <h1>My 

                <em> quotations.</em>
              </h1>
              <p>Review pricing, specifications, and quote validity for your projects.</p>
            </div>
          </section>
          <div className="account-notice">
            <i className="bi bi-info-circle"></i>
            <span>Sample account data for this website preview. Final pricing is confirmed by your regional team.</span>
          </div>
          <section className="account-table">
            <div className="table-head">
              <span>QUOTE / MACHINE</span>
              <span>ISSUED</span>
              <span>STATUS</span>
              <span>INDICATIVE TOTAL</span>
              <span></span>
            </div>
            <div className="enquiry-row">
              <div className="enquiry-name">
                <strong>Arc 700 · Vertical machining centre</strong>
                <small>NL-Q-2026-0419 · Enquiry NL-ENQ-09916</small>
              </div>
              <span>Sep 28, 2026</span>
              <span className="status-pill ready">Ready · 30 days</span>
              <span>$78,500</span>
              <Link className="row-action" to="/customer/quotation-details?id=NL-Q-2026-0419" aria-label="View Arc 700 quotation">
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
            <div className="enquiry-row">
              <div className="enquiry-name">
                <strong>Flare 6 · Fiber laser system</strong>
                <small>NL-Q-2026-0382 · Enquiry NL-ENQ-08354</small>
              </div>
              <span>Aug 14, 2026</span>
              <span className="status-pill ready">Ready · 30 days</span>
              <span>$108,600</span>
              <Link className="row-action" to="/customer/quotation-details?id=NL-Q-2026-0382" aria-label="View Flare 6 quotation">
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
          </section>
          <div className="account-bottom">
            <span className="account-help">
              <i className="bi bi-headset"></i> Want to discuss an estimate? 

              <Link to="/contact">Talk to our team</Link>
            </span>
            <Link className="button button-dark" to="/customer/enquiries">View enquiries 

              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </main>
  );
};

export default MyQuotations;
