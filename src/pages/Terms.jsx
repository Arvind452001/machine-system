import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div>
      <main className="contact-page">
        <div className="page-crumb">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Home
          </Link>
          <span>/</span>
          <span>Terms of Service</span>
        </div>
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> TERMS & CONDITIONS
            </div>
            <h1>
              Terms of <em>Service.</em>
            </h1>
            <p>Guidelines and terms governing use of the MACHINE Systems platform and quotations.</p>
          </div>
          <span className="page-index">LEGAL / TERMS</span>
        </section>
        <section className="contact-page-layout">
          <div className="contact-details-panel">
            <div className="contact-panel-kicker">
              TERMS OF USE <span>·</span> MACHINE SYSTEMS
            </div>
            <h2>Platform Terms & Indicative Estimates</h2>
            <p>
              All equipment specifications and estimates provided on this site are indicative and subject to final technical review and official quotation.
            </p>
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px", color: "#556157", fontSize: "13px", lineHeight: "1.7" }}>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>Indicative Pricing</strong>
                Prices shown on the website and configuration tools are starting estimates in USD before taxes, shipping, customs, tooling, and installation unless explicitly stated.
              </div>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>Specification Review</strong>
                Machine dimensions, options, cycle times, and compatibility are subject to confirmation by your regional sales engineer based on your specific workpiece requirements.
              </div>
              <div>
                <strong style={{ color: "#111", display: "block", marginBottom: "4px" }}>Intellectual Property</strong>
                All brand marks, machine imagery, schematics, and platform documentation are protected trademarks and copyrights of MACHINE Systems.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Terms;
