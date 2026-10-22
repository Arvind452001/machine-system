import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <main>
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>Privacy Policy</span>
      </div>

      <section className="info-hero">
        <div>
          <div className="eyebrow">
            <span></span> Your information, handled thoughtfully
          </div>
          <h1>
            Privacy <em> policy.</em>
          </h1>
          <p>
            This page explains what information we may collect when you use our
            website, why we use it, and the choices available to you.
          </p>
        </div>
        <div
          className="info-hero-art"
          role="img"
          aria-label="A specialist reviewing information in an industrial setting"
        >
          <span>MACHINE SYSTEMS / PRIVACY</span>
          <strong>Clear about how information is used.</strong>
        </div>
      </section>

      <section className="info-content legal-layout">
        <nav className="legal-nav" aria-label="Privacy policy sections">
          <strong>ON THIS PAGE</strong>
          <a href="#information">Information we collect</a>
          <a href="#use">How we use it</a>
          <a href="#sharing">When we share it</a>
          <a href="#choices">Your choices</a>
          <a href="#security">Retention and security</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="legal-copy">
          <p className="legal-updated">Last updated: October 21, 2026</p>
          <section id="information">
            <h2>1. Information we collect</h2>
            <p>
              When you browse the site, create an account, configure a machine,
              or send an enquiry, we may collect information you provide, such
              as your name, business contact details, account credentials,
              project requirements, and messages. We may also collect basic
              technical information about your visit, including device and
              browser details, pages viewed, and approximate usage data through
              cookies or similar technologies where enabled.
            </p>
          </section>
          <section id="use">
            <h2>2. How we use information</h2>
            <p>
              We use information to operate and improve the website, manage
              accounts and saved configurations, respond to enquiries, connect
              you with an appropriate representative, prepare requested product
              information or quotes, maintain security, and meet applicable
              legal obligations. We do not use enquiry details for unrelated
              purposes without an appropriate basis.
            </p>
          </section>
          <section id="sharing">
            <h2>3. When we share information</h2>
            <p>
              We may share relevant details with MACHINE Systems
              representatives and service providers who help us operate the
              site or respond to your request. We may also disclose information
              when required by law or where necessary to protect the rights,
              safety, and security of users or our services. We do not sell
              personal information for money.
            </p>
          </section>
          <section id="cookies">
            <h2>4. Cookies and similar technologies</h2>
            <p>
              Cookies may be used to support essential website functions,
              remember preferences, and understand site usage. You can manage
              cookies through your browser settings. Blocking some cookies may
              affect how parts of the site work.
            </p>
          </section>
          <section id="choices">
            <h2>5. Your choices and rights</h2>
            <p>
              Depending on where you live, you may have rights to request
              access to, correction of, or deletion of personal information, or
              to object to or restrict certain processing. You can also ask us
              to update your communication preferences. Contact us using the
              details below to make a request; we may need to verify your
              identity first.
            </p>
          </section>
          <section id="security">
            <h2>6. Retention and security</h2>
            <p>
              We retain information for as long as reasonably needed for the
              purposes described in this policy, including responding to
              enquiries and meeting legal or operational requirements. We use
              reasonable safeguards designed to protect information, but no
              method of transmission or storage is completely secure.
            </p>
          </section>
          <section id="children">
            <h2>7. Children and external links</h2>
            <p>
              This website is intended for business users and is not directed
              to children. The site may link to third-party websites; their
              privacy practices are governed by their own policies.
            </p>
          </section>
          <section id="changes">
            <h2>8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The date above
              indicates when it was most recently revised. Continued use of the
              site after an update means the revised policy is available for
              review.
            </p>
          </section>
          <section id="contact">
            <h2>9. Contact us</h2>
            <p>
              For questions or privacy requests, contact MACHINE Systems through
              our <Link to="/contact">Contact Us page</Link>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
