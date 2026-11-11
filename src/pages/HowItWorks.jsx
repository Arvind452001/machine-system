import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <main>
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>How it works</span>
      </div>

      <section className="info-hero">
        <div>
          <div className="eyebrow">
            <span></span> A clearer path to the right machine
          </div>
          <h1>
            From first look to <em> the right quote.</em>
          </h1>
          <p>
            Explore machine platforms, shape a configuration around your process,
            and speak with a representative before you make a decision.
          </p>
        </div>
        <div
          className="info-hero-art"
          role="img"
          aria-label="Industrial machine equipment on a production floor"
        >
          <span>MACHINE SYSTEMS / YOUR PROCESS</span>
          <strong>Configure. Compare. Connect.</strong>
        </div>
      </section>

      <section className="info-content">
        <div className="info-section-heading">
          <div className="eyebrow">
            <span></span> Four straightforward steps
          </div>
          <h2>
            Good decisions start with <em>good questions.</em>
          </h2>
          <p>
            There is no need to have every detail figured out before you begin.
            Use the catalogue to explore, then bring your priorities to a local
            expert.
          </p>
        </div>

        <div className="process-list">
          <article className="process-step">
            <span>01 / SELECT PLATFORM</span>
            <h3>Choose a machine</h3>
            <p>
              Browse machine families and compare specifications to select the platform best suited for your shop floor.
            </p>
          </article>
          <article className="process-step">
            <span>02 / ADD TO BASKET</span>
            <h3>Add with default config</h3>
            <p>
              Add machines directly to your enquiry basket with factory default configurations. Manage quantities and multiple machines.
            </p>
          </article>
          <article className="process-step">
            <span>03 / CONFIGURE</span>
            <h3>Shape the options</h3>
            <p>
              Configure options directly from the basket. Customize spindles, tooling, and automation packages with real-time sync.
            </p>
          </article>
          <article className="process-step">
            <span>04 / SUBMIT REQUEST</span>
            <h3>Review &amp; submit</h3>
            <p>
              Review your configured shortlist, verify engineering details, and submit your formal enquiry for specialist review.
            </p>
          </article>
        </div>

        <div className="info-split">
          <div>
            <div className="eyebrow">
              <span></span> Before you enquire
            </div>
            <h2>Bring what you know.</h2>
          </div>
          <div>
            <p>
              Helpful details can include the material and dimensions of your
              parts, target tolerances, current process, expected volumes, and
              any space or installation considerations. If you are still
              exploring, that is a good place to start too.
            </p>
            <Link className="info-link" to="/machines">
              Explore the machine range <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;
