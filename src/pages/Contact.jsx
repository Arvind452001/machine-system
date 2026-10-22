import { Link } from "react-router-dom";
const Contact = () => {
  return (
    <div>
        <main className="contact-page">
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home

        </Link>
        <span>/</span>
        <span>Contact</span>
      </div>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> Here to help

          </div>
          <h1>Talk to a 

            <em> specialist.</em>
          </h1>
          <p>Tell us what you are making and our team will help you find the right next step.</p>
        </div>
        <span className="page-index">NORTHLINE / CONTACT</span>
      </section>
      <section className="contact-page-layout">
        <div className="contact-details-panel">
          <div className="contact-panel-kicker">NORTHLINE SYSTEMS 

            <span>·</span> CUSTOMER TEAM

          </div>
          <h2>Good work starts with a conversation.</h2>
          <p>Ask about machine specifications, applications, service, or finding a local representative.</p>
          <a className="contact-detail-row" href="mailto:hello@northlinesystems.example">
            <span className="contact-detail-icon">
              <i className="bi bi-envelope"></i>
            </span>
            <span>
              <small>EMAIL OUR TEAM</small>
              <strong>hello@northlinesystems.example</strong>
            </span>
            <i className="bi bi-arrow-up-right"></i>
          </a>
          <a className="contact-detail-row" href="tel:+18005550142">
            <span className="contact-detail-icon">
              <i className="bi bi-telephone"></i>
            </span>
            <span>
              <small>CALL CUSTOMER SUPPORT</small>
              <strong>+1 (800) 555-0142</strong>
            </span>
            <i className="bi bi-arrow-up-right"></i>
          </a>
          <div className="contact-hours">
            <i className="bi bi-clock"></i>
            <span>
              <strong>Support hours</strong><br/>Monday–Friday, 8:00 am–5:00 pm Central Time

            </span>
          </div>
          <div className="contact-panel-note">
            <i className="bi bi-geo-alt"></i> Your enquiry will be routed to the appropriate regional team.

          </div>
        </div>
        <form className="contact-form" action="mailto:hello@northlinesystems.example" method="post" enctype="text/plain">
          <div className="form-section">
            <span>01</span>
            <div>
              <h2>Send us a message</h2>
              <p>Leave your details and a short note.</p>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="contact-name">Your name 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="contact-name" name="name" autoComplete="name" required placeholder="Morgan Chen"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="contact-email">Work email 

                <span className="required">*</span>
              </label>
              <input className="form-control" id="contact-email" name="email" type="email" autoComplete="email" required placeholder="morgan@company.com"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="contact-phone">Phone number</label>
              <input className="form-control" id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 010 2048"/>
            </div>
            <div className="col-md-6 form-group">
              <label className="form-label" htmlFor="contact-topic">What can we help with?</label>
              <select className="form-select" id="contact-topic" name="topic">
                <option>Machine information</option>
                <option>Application advice</option>
                <option>Service and support</option>
                <option>Parts and accessories</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="col-12 form-group">
              <label className="form-label" htmlFor="contact-message">Your message 

                <span className="required">*</span>
              </label>
              <textarea className="form-control" id="contact-message" name="message" rows="5" required placeholder="Tell us about your question or project…"></textarea>
            </div>
          </div>
          <label className="consent-row">
            <input type="checkbox" required/>
            <span>Northline Systems may contact me about this message. Read our 

              <Link to="/privacy">privacy notice</Link>.

            </span>
          </label>
          <button className="button button-lime mt-3" type="submit">Send message 

            <i className="bi bi-arrow-right"></i>
          </button>
          <p className="contact-form-note">This static demo opens your email app to send the message. For a live website, connect a secure form service.</p>
        </form>
      </section>
    </main>
    </div>
  )
}

export default Contact
