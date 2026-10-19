import { Link } from "react-router-dom";
const QuotationDetails = () => {
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
          <Link  to="/my-enquiries">
            <i className="bi bi-file-earmark-text"></i> My enquiries

          </Link>
          <Link className="active" aria-current="page" to="/my-quotations">
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
            <Link to="/my-quotations">
              <i className="bi bi-arrow-left"></i> My quotations

            </Link>
            <span>/</span>
            <span>Quote NL-Q-2026-0419</span>
          </div>
          <section className="page-heading">
            <div>
              <div className="eyebrow">
                <span></span> INDICATIVE QUOTATION · VALID 30 DAYS

              </div>
              <h1>Your machine 

                <em>quotation.</em>
              </h1>
              <p>Quote NL-Q-2026-0419 · Issued September 28, 2026 · USD</p>
            </div>
            <button className="quote-download-button" type="button" onClick={() => window.print()}>
              <i className="bi bi-download"></i> Print / save PDF

            </button>
          </section>
          <article className="quote-sheet">
            <div className="quote-sheet-header">
              <Link className="brand" to="/">
                <span className="brand-icon">
                  <i className="bi bi-asterisk"></i>
                </span>
                <span className="brand-type">MACHINE

                  <small>SYSTEMS</small>
                </span>
              </Link>
              <div className="quote-meta">
                <span>INDICATIVE QUOTATION</span>
                <strong>NL-Q-2026-0419</strong>
                <small>Valid 30 days · USD</small>
              </div>
            </div>
            <div className="quote-rule"></div>
            <div className="quote-addresses">
              <div>
                <span>PREPARED FOR</span>
                <strong>Morgan Chen</strong>
                <p>Meridian Precision Works</p>
              </div>
              <div>
                <span>PREPARED BY</span>
                <strong>MACHINE Systems</strong>
                <p>Regional Sales Team · United States</p>
              </div>
              <div>
                <span>ISSUED</span>
                <strong>28 September 2026</strong>
                <p>Enquiry NL-ENQ-09916</p>
              </div>
            </div>
            <div className="quote-machine">
              <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Vertical machining centre"/>
              <div>
                <span>PROPOSED PLATFORM</span>
                <h2>Arc 700 · Vertical machining centre</h2>
                <p>Flexible, rigid machining for accurate production across a wide range of parts.</p>
              </div>
            </div>
            <div className="quote-line quote-line-heading">
              <span>ITEM / SPECIFICATION</span>
              <span>QTY</span>
              <span>INDICATIVE PRICE</span>
            </div>
            <div className="quote-line">
              <span>
                <strong>Arc 700 base machine</strong>
                <small>Full enclosure · 40-tool magazine · 8,000 rpm spindle</small>
              </span>
              <span>1</span>
              <span>$72,400</span>
            </div>
            <div className="quote-line">
              <span>
                <strong>Commissioning and operator training</strong>
                <small>Scope to be confirmed with your representative</small>
              </span>
              <span>1</span>
              <span>$6,100</span>
            </div>
            <div className="quote-total">
              <span>INDICATIVE CONFIGURATION TOTAL

                <small>Excludes taxes, freight, and installation</small>
              </span>
              <strong>$78,500</strong>
            </div>
            <div className="quote-notes">
              <p>This estimate is indicative and not a binding offer.</p>
              <p>Final specifications, delivery, and pricing require technical review.</p>
              <p>
                <Link to="/contact">Contact your representative</Link> to discuss your application.

              </p>
            </div>
            <div className="quote-sheet-footer">
              <span>MACHINE SYSTEMS · BUILT AROUND YOUR PRODUCTION</span>
              <span>northlinesystems.example</span>
            </div>
          </article>
          <p className="summary-note">Sample quotation for interface preview only.</p>
        </main>
      </div>
    </div>
  )
}

export default QuotationDetails
