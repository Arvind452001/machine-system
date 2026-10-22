import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <main>
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>Terms &amp; Conditions</span>
      </div>

      <section className="info-hero">
        <div>
          <div className="eyebrow">
            <span></span> Using this website
          </div>
          <h1>
            Terms &amp; <em> conditions.</em>
          </h1>
          <p>
            These terms explain the basic conditions for accessing and using the
            MACHINE Systems website and its product information.
          </p>
        </div>
        <div
          className="info-hero-art"
          role="img"
          aria-label="Industrial machinery in a production environment"
        >
          <span>MACHINE SYSTEMS / TERMS</span>
          <strong>Useful information. Clear expectations.</strong>
        </div>
      </section>

      <section className="info-content legal-layout">
        <nav className="legal-nav" aria-label="Terms and conditions sections">
          <strong>ON THIS PAGE</strong>
          <a href="#acceptance">Acceptance and use</a>
          <a href="#information">Product information</a>
          <a href="#quotes">Enquiries and quotes</a>
          <a href="#accounts">Accounts</a>
          <a href="#ip">Intellectual property</a>
          <a href="#liability">Liability</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="legal-copy">
          <p className="legal-updated">Last updated: October 21, 2026</p>
          <section id="acceptance">
            <h2>1. Acceptance and permitted use</h2>
            <p>
              By accessing or using this website, you agree to these terms. If you
              do not agree, please do not use the site. You may use the website
              for lawful business purposes and must not interfere with its
              operation, attempt unauthorized access, or misuse its content or
              services.
            </p>
          </section>
          <section id="information">
            <h2>2. Product and website information</h2>
            <p>
              Product descriptions, images, specifications, configuration
              previews, and indicative pricing are provided for general
              information and may change without notice. They are not a binding
              offer or a guarantee of availability, suitability, or final
              specification. Confirm important requirements with a MACHINE
              Systems representative before making a purchasing decision.
            </p>
          </section>
          <section id="quotes">
            <h2>3. Enquiries, configurations, and quotes</h2>
            <p>
              Submitting an enquiry or saving a configuration does not place an
              order or guarantee a price, delivery date, or product allocation.
              Any quote, order, sale, warranty, or delivery will be subject to
              the separate terms provided with the applicable transaction and
              confirmed by an authorized representative.
            </p>
          </section>
          <section id="accounts">
            <h2>4. Accounts and information you provide</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for activity under your account. Please
              provide information that is accurate and up to date, and notify us
              if you believe your account has been used without authorization.
              Our handling of personal information is described in our{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>
          <section id="ip">
            <h2>5. Intellectual property</h2>
            <p>
              Unless otherwise stated, website text, design, graphics, and other
              materials are owned by or used with permission by MACHINE Systems
              and are protected by applicable intellectual property laws. You may
              view and use the site for its intended purpose; other copying,
              distribution, or commercial use requires prior permission.
            </p>
          </section>
          <section id="third-party">
            <h2>6. Third-party services and links</h2>
            <p>
              Links to third-party websites or services are provided for
              convenience. MACHINE Systems does not control and is not
              responsible for their content, availability, or practices. Your
              use of third-party services is subject to their own terms.
            </p>
          </section>
          <section id="availability">
            <h2>7. Availability and changes</h2>
            <p>
              We may update, suspend, or discontinue website features or
              content at any time. We aim to keep the site available and accurate
              but do not guarantee uninterrupted access or that all information
              will always be error-free.
            </p>
          </section>
          <section id="liability">
            <h2>8. Limitation of liability</h2>
            <p>
              To the extent permitted by applicable law, MACHINE Systems is not
              liable for indirect or consequential losses arising from use of, or
              inability to use, this website. Nothing in these terms excludes
              liability that cannot lawfully be excluded. These terms do not
              replace any rights or remedies that apply to a confirmed purchase
              under its separate agreement.
            </p>
          </section>
          <section id="changes">
            <h2>9. Changes to these terms</h2>
            <p>
              We may revise these terms by publishing an updated version on this
              page. The date above indicates the latest revision. Please review
              the terms periodically.
            </p>
          </section>
          <section id="contact">
            <h2>10. Contact</h2>
            <p>
              If you have questions about these terms, please contact us
              through the <Link to="/contact">Contact Us page</Link>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Terms;
