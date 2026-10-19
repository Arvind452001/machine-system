import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div>
      <main className="contact-page">
        <div className="page-crumb">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Home
          </Link>
          <span>/</span>
          <span>Privacy Policy</span>
        </div>
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> TRUST & TRANSPARENCY
            </div>
            <h1>
              Privacy <em>Policy.</em>
            </h1>
            <p>How MACHINE Systems protects and manages your personal and business data.</p>
          </div>
          <span className="page-index">LEGAL / PRIVACY</span>
        </section>
        <section className="contact-page-layout">
          <div className="contact-details-panel">
            <div className="contact-panel-kicker">
              DATA PRIVACY <span>·</span> MACHINE SYSTEMS
            </div>
            <h2>Commitment to Data Security</h2>
            <p>
              We only collect information necessary to prepare machine configurations, handle technical enquiries, and provide customer support.
            </p>
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", color: "#556157", fontSize: "13px", lineHeight: "1.7" }}>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>Information We Collect</strong>
                Information you provide when submitting machine enquiries, requesting quotations, or configuring systems (e.g. name, work email, company name, phone number, and machine requirements).
              </div>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>How We Use It</strong>
                To prepare accurate equipment quotations, connect you with local application specialists, and provide product support.
              </div>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>Data Protection</strong>
                Your information is never sold to third parties. We enforce industry-standard security practices across all systems.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
