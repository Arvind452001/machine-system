import { Link } from "react-router-dom";
const Enquiry = () => {
  return (
    <div>
       <main>
      <div className="page-crumb">
        <Link to="/basket">
          <i className="bi bi-arrow-left"></i> Back to basket

        </Link>
        <span>/</span>
        <span>Send enquiry</span>
      </div>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> Start a conversation

          </div>
          <h1>Let's talk 

            <em>production.</em>
          </h1>
          <p>Share a few details so your local representative can prepare.</p>
        </div>
        <span className="page-index">02 / ENQUIRY</span>
      </section>
      <section className="enquiry-layout">
        <form className="enquiry-form">
          <div className="form-section">
            <span>01</span>
            <div>
              <h2>Your details</h2>
              <p>How your representative can reach you.</p>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="first-name">First name 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="first-name" name="firstName" autoComplete="given-name" required placeholder="Morgan"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="last-name">Last name 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="last-name" name="lastName" autoComplete="family-name" required placeholder="Chen"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="email">Work email 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="email" name="email" type="email" autoComplete="email" required placeholder="morgan@company.com"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="phone">Phone number 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="phone" name="phone" type="tel" autoComplete="tel" required placeholder="+1 555 010 2048"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="company">Company 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="company" name="company" autoComplete="organization" required placeholder="Company name"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="country">Country / region 

                <span className="required">*</span>
              </label>
              <select className="form-select" id="country" name="country" required>
                <option value="">Select a country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-section mt-4">
            <span>02</span>
            <div>
              <h2>Your project</h2>
              <p>A little context helps us prepare.</p>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="timeline">When are you looking to install?</label>
            <select className="form-select" id="timeline" name="timeline">
              <option value="">Choose a timeframe</option>
              <option>As soon as possible</option>
              <option>Within 3 months</option>
              <option>Within 6 months</option>
              <option>6â€“12 months</option>
              <option>Researching for now</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">What should we know? 

              <span className="optional-label">OPTIONAL</span>
            </label>
            <textarea className="form-control" id="message" name="message" rows="4" placeholder="Materials, throughput, floor space, or questions for our teamâ€¦"></textarea>
          </div>
          <label className="consent-row">
            <input type="checkbox" required/>
            <span>Northline Systems may contact me about this enquiry. Read our 

              <Link to="/privacy">privacy notice</Link>.

            </span>
          </label>
          <button className="button button-lime mt-3" type="button">Continue to confirmation 

            <i className="bi bi-arrow-right"></i>
          </button>
          <p className="summary-note mt-3">This form is a static preview and does not send enquiry details.</p>
        </form>
        <aside className="enquiry-aside">
          <div className="aside-title">
            <i className="bi bi-bag-check"></i> CONFIGURATION SUMMARY

          </div>
          <div className="order-item">
            <span>AX-400</span>
            <strong>Axis 400 · Precision CNC lathe</strong>
            <p>Standard spindle · 10-station turret · Standard coolant · Safety enclosure</p>
          </div>
          <div className="order-total">
            <span>Indicative starting price</span>
            <strong>$48,500</strong>
          </div>
          <div className="aside-help">
            <i className="bi bi-person-check"></i>
            <span>
              <strong>A local expert, not a bot.</strong><br/>Your country representative can review the build and discuss custom requirements.

            </span>
          </div>
        </aside>
      </section>
    </main>
    </div>
  )
}

export default Enquiry
