import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "../api/contentApi";

const fallbackHowItWorksData = {
  hero: {
    eyebrow: "A clearer path to the right machine",
    title: "From first look to the right quote.",
    subtitle:
      "Explore machine platforms, shape a configuration around your process, and speak with a representative before you make a decision.",
    artTag: "MACHINE SYSTEMS / YOUR PROCESS",
    artText: "Configure. Compare. Connect.",
  },
  sectionHeading: {
    eyebrow: "Four straightforward steps",
    title: "Good decisions start with good questions.",
    description:
      "There is no need to have every detail figured out before you begin. Use the catalogue to explore, then bring your priorities to a local expert.",
  },
  steps: [
    {
      id: "step-1",
      stepTag: "01 / SELECT PLATFORM",
      title: "Choose a machine",
      description:
        "Browse machine families and compare specifications to select the platform best suited for your shop floor.",
    },
    {
      id: "step-2",
      stepTag: "02 / ADD TO BASKET",
      title: "Add with default config",
      description:
        "Add machines directly to your enquiry basket with factory default configurations. Manage quantities and multiple machines.",
    },
    {
      id: "step-3",
      stepTag: "03 / CONFIGURE",
      title: "Shape the options",
      description:
        "Configure options directly from the basket. Customize spindles, tooling, and automation packages with real-time sync.",
    },
    {
      id: "step-4",
      stepTag: "04 / SUBMIT REQUEST",
      title: "Review & submit",
      description:
        "Review your configured shortlist, verify engineering details, and submit your formal enquiry for specialist review.",
    },
  ],
  bottomSection: {
    eyebrow: "Before you enquire",
    title: "Bring what you know.",
    description:
      "Helpful details can include the material and dimensions of your parts, target tolerances, current process, expected volumes, and any space or installation considerations. If you are still exploring, that is a good place to start too.",
    linkText: "Explore the machine range",
    linkUrl: "/machines",
  },
};

const HowItWorks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(fallbackHowItWorksData);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    contentApi
      .getContentBySlug("how-it-works")
      .then((res) => {
        if (!mounted) return;
        const rawItem = res?.data || res;
        if (rawItem && rawItem.body) {
          try {
            if (typeof rawItem.body === "string" && rawItem.body.trim().startsWith("{")) {
              const parsed = JSON.parse(rawItem.body);
              setData({
                hero: parsed.hero || fallbackHowItWorksData.hero,
                sectionHeading: parsed.sectionHeading || fallbackHowItWorksData.sectionHeading,
                steps: Array.isArray(parsed.steps) ? parsed.steps : fallbackHowItWorksData.steps,
                bottomSection: parsed.bottomSection || fallbackHowItWorksData.bottomSection,
              });
            } else if (typeof rawItem.body === "object") {
              setData(rawItem.body);
            }
          } catch (e) {
            console.warn("Using fallback how-it-works data:", e);
          }
        }
      })
      .catch((err) => {
        console.error("Could not fetch how-it-works content from API:", err);
        if (mounted) setError("Could not connect to content API.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hero = data.hero || fallbackHowItWorksData.hero;
  const sectionHeading = data.sectionHeading || fallbackHowItWorksData.sectionHeading;
  const steps = Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : fallbackHowItWorksData.steps;
  const bottomSection = data.bottomSection || fallbackHowItWorksData.bottomSection;

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
            <span></span> {hero.eyebrow}
          </div>
          <h1>
            {hero.title.includes("to the") ? (
              <>
                {hero.title.split("to the")[0]}to <em>the{hero.title.split("to the")[1]}</em>
              </>
            ) : (
              hero.title
            )}
          </h1>
          <p>{hero.subtitle}</p>
        </div>
        <div
          className="info-hero-art"
          role="img"
          aria-label="Industrial machine equipment on a production floor"
        >
          <span>{hero.artTag || "MACHINE SYSTEMS / YOUR PROCESS"}</span>
          <strong>{hero.artText || "Configure. Compare. Connect."}</strong>
        </div>
      </section>

      {loading ? (
        <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
          <div className="spinner-border text-danger" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ marginTop: "1rem", color: "#666" }}>Loading How It Works...</p>
        </div>
      ) : (
        <section className="info-content">
          <div className="info-section-heading">
            <div className="eyebrow">
              <span></span> {sectionHeading.eyebrow}
            </div>
            <h2>
              {sectionHeading.title.includes("start with") ? (
                <>
                  {sectionHeading.title.split("start with")[0]}start with <em>{sectionHeading.title.split("start with")[1]}</em>
                </>
              ) : (
                sectionHeading.title
              )}
            </h2>
            <p>{sectionHeading.description}</p>
          </div>

          <div className="process-list">
            {steps.map((step, index) => {
              const tagNumber = String(index + 1).padStart(2, "0");
              const defaultTag = `${tagNumber} / STEP`;
              return (
                <article key={step.id || index} className="process-step">
                  <span>{step.stepTag || defaultTag}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              );
            })}
          </div>

          <div className="info-split">
            <div>
              <div className="eyebrow">
                <span></span> {bottomSection.eyebrow}
              </div>
              <h2>{bottomSection.title}</h2>
            </div>
            <div>
              <p>{bottomSection.description}</p>
              {bottomSection.linkText && bottomSection.linkUrl && (
                <Link className="info-link" to={bottomSection.linkUrl}>
                  {bottomSection.linkText} <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default HowItWorks;
