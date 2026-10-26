import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";
import { reviewsApi } from "../api/reviewsApi";
import { faqsApi } from "../api/faqsApi";
import { BASE_URL } from "../api/axiosInstance";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const DUMMY_REVIEW_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
];

const resolveImageUrl = (img) => {
  if (!img || img === "string") {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
  }
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  const cleanBase = (BASE_URL || "https://node.aitechnotech.in/machine").replace(/\/+$/, "");
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  return `${cleanBase}${cleanPath}`;
};

const Home = () => {
  const [machines, setMachines] = useState([]);
  const [loadingMachines, setLoadingMachines] = useState(true);

  // Reviews state (GET /api/v1/reviews & POST /api/v1/reviews)
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    authorName: "",
    authorTitle: "",
    company: "",
    country: "United States",
    rating: 5,
    headline: "",
    comment: "",
    machinePurchased: "",
  });

  // FAQs state (GET /api/v1/faqs)
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const fetchReviews = () => {
    setLoadingReviews(true);
    reviewsApi
      .getReviews()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setReviews(list);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("refresh-carousels"));
        }, 100);
      })
      .catch((err) => {
        console.warn("Could not load reviews:", err.message);
      })
      .finally(() => {
        setLoadingReviews(false);
      });
  };

  useEffect(() => {
    let mounted = true;
    machinesApi
      .getMachines({ limit: 6 })
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setMachines(list);
      })
      .catch((err) => {
        console.warn("Could not load machines for homepage:", err.message);
      })
      .finally(() => {
        if (mounted) setLoadingMachines(false);
      });

    fetchReviews();

    faqsApi
      .getFaqs()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const sorted = list
          .filter((f) => f.isActive !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setFaqs(sorted);
      })
      .catch((err) => {
        console.warn("Could not load FAQs for homepage:", err.message);
      })
      .finally(() => {
        if (mounted) setLoadingFaqs(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.authorName.trim() || !reviewForm.comment.trim()) {
      showErrorAlert("Validation Error", "Please provide your name and review comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const payload = {
        authorName: reviewForm.authorName.trim(),
        authorTitle: reviewForm.authorTitle.trim() || "Operations Lead",
        company: reviewForm.company.trim() || "Manufacturing Works",
        country: reviewForm.country.trim() || "United States",
        rating: Number(reviewForm.rating) || 5,
        headline: reviewForm.headline.trim() || "High precision and dependable machinery",
        comment: reviewForm.comment.trim(),
        machinePurchased: reviewForm.machinePurchased.trim() || "MS Platform",
      };

      await reviewsApi.createReview(payload);
      showSuccessAlert(
        "Review Submitted",
        "Thank you! Your feedback has been successfully submitted."
      );
      setShowReviewModal(false);
      setReviewForm({
        authorName: "",
        authorTitle: "",
        company: "",
        country: "United States",
        rating: 5,
        headline: "",
        comment: "",
        machinePurchased: "",
      });
      fetchReviews();
    } catch (err) {
      showErrorAlert("Submission Failed", err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Group reviews into pages of up to 3 cards
  const reviewPages = [];
  for (let i = 0; i < reviews.length; i += 3) {
    reviewPages.push(reviews.slice(i, i + 3));
  }
  return (
    <div>
        <main>
      <section className="hero hero-slider" aria-label="MACHINE industrial machinery">
        <div className="hero-copy">
          <div className="eyebrow">
            <span></span> Precision equipment. Personal expertise.

          </div>
          <h1>Your next great<br/>run starts 

            <em>here.</em>
          </h1>
          <p>Discover dependable industrial machines, configure the details for your work, and get a considered quote from a local expert.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/machines">Explore machines 

              <i className="bi bi-arrow-up-right"></i>
            </Link>
            <Link className="quiet-link" to="#how-it-works">See how it works 

              <i className="bi bi-arrow-down-right"></i>
            </Link>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <span>JM</span>
              <span>AL</span>
              <span>RK</span>
            </div>
            <span>Trusted by makers in 

              <strong>28 countries</strong>
            </span>
          </div>
        </div>
        <div className="carousel slide hero-image-carousel" id="machineHero" data-carousel data-carousel-interval="6000" aria-label="Machine photography">
          <div className="carousel-inner" data-carousel-track>
            <div className="carousel-item active" data-carousel-slide>
              <div className="hero-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="Precision industrial equipment on a production floor"/></div>
            </div>
            <div className="carousel-item" data-carousel-slide>
              <div className="hero-image">
                <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Machining equipment inside a bright factory"/></div>
            </div>
            <div className="carousel-item" data-carousel-slide>
              <div className="hero-image">
                <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=85" alt="Industrial cutting equipment in a production cell"/></div>
            </div>
          </div>
          <button className="carousel-control-prev hero-carousel-control" type="button" data-carousel-prev aria-label="Previous machine image">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button className="carousel-control-next hero-carousel-control" type="button" data-carousel-next aria-label="Next machine image">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
        <div className="hero-vertical">CONFIGURE 

          <span>·</span> COMPARE 

          <span>·</span> CONNECT

        </div>
      </section>
      <section className="about-section section-space" id="about" aria-labelledby="about-title">
        <div className="row g-5 align-items-center">
          <div className="about-media col-12 col-lg-5">
            <div className="about-image-stack">
              <figure className="about-image about-image-main">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85" alt="MACHINE engineer reviewing equipment on a production floor" loading="lazy"/>
                <figcaption>ENGINEERED AROUND REAL WORK</figcaption>
              </figure>
            </div>
          </div>
          <div className="about-copy col-12 col-lg-6 offset-lg-1">
            <div className="eyebrow">
              <span></span> About MACHINE

            </div>
            <h2 id="about-title">Built around your work.<br/>
              <em>Ready for what's next.</em>
            </h2>
            <p>MACHINE pairs proven industrial machinery with practical, local expertise. We start with your parts, materials, and production goals, then help you shape a platform that fits the work ahead.</p>
            <div className="about-points">
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>Machines with purpose</strong>
                  <small>Turning, milling, and laser systems selected for real production needs.</small>
                </span>
              </div>
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>Advice that stays practical</strong>
                  <small>Clear conversations about capability, options, and fit.</small>
                </span>
              </div>
              <div>
                <i className="bi bi-check2"></i>
                <span>
                  <strong>People close to your work</strong>
                  <small>Local specialists to help shape a considered specification.</small>
                </span>
              </div>
            </div>
            <Link className="button button-dark about-cta" to="#contact">More About Us 

              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </div>
      </section>
      <section className="proof-strip" aria-label="MACHINE at a glance">
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-gear-wide-connected"></i>
          </span>
          <div>
            <strong>40

              <span>+</span>
            </strong>
            <p>years building production machinery</p>
          </div>
        </article>
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-globe-americas"></i>
          </span>
          <div>
            <strong>28</strong>
            <p>countries with local support</p>
          </div>
        </article>
        <article className="proof-card">
          <span className="proof-icon">
            <i className="bi bi-person-check"></i>
          </span>
          <div>
            <strong>1:1</strong>
            <p>guidance from a real specialist</p>
          </div>
        </article>
        <article className="proof-card proof-card-note">
          <span className="proof-icon">
            <i className="bi bi-shield-check"></i>
          </span>
          <div>
            <strong>Made to work</strong>
            <p>Purpose-built machines. Support that stays with you.</p>
          </div>
        </article>
      </section>
      <section className="featured section-space" id="machines">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span></span> The MACHINE range

            </div>
            <h2>Find your starting point.</h2>
            <p>Six proven platforms. Plenty of room to make them yours.</p>
          </div>
          <Link className="text-arrow" to="/machines">View all machines 
<i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="machine-carousel" aria-label="Featured machines">
          {loadingMachines ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7c72" }}>
              <div
                className="spinner-border text-secondary mb-3"
                role="status"
                style={{ width: "2rem", height: "2rem" }}
              ></div>
              <div>Loading machines from catalogue...</div>
            </div>
          ) : machines.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7c72",
                background: "#fff",
                borderRadius: "10px",
                border: "1px solid #e1e6e0",
                margin: "20px 0",
              }}
            >
              <i className="bi bi-info-circle mb-2 d-block" style={{ fontSize: "1.8rem" }}></i>
              <strong style={{ color: "#173f35" }}>No machines currently available.</strong>
              <p className="mt-1 mb-0" style={{ fontSize: "14px" }}>
                Check back soon as new machines are published to the catalogue.
              </p>
            </div>
          ) : (
            <div className="machine-grid">
              {machines.map((m) => {
                const img = resolveImageUrl(m.images?.[0]);
                const sku = m.sku || m.slug?.toUpperCase() || "MACH";
                const cat = (m.category || "CNC").toUpperCase();
                const price =
                  m.basePrice != null
                    ? `$${Number(m.basePrice).toLocaleString()}`
                    : "Contact";
                const detailUrl = `/machine-details?id=${m.slug || m._id}`;

                return (
                  <article className="machine-card" key={m._id || m.slug}>
                    <Link className="machine-image" to={detailUrl}>
                      <img
                        src={img}
                        alt={m.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
                        }}
                      />
                      <span className="machine-category">{cat}</span>
                      <span className="image-arrow">
                        <i className="bi bi-arrow-up-right"></i>
                      </span>
                    </Link>
                    <div className="machine-card-body">
                      <div className="machine-meta">
                        <span>{sku}</span>
                        <span>{cat}</span>
                      </div>
                      <h3>{m.name}</h3>
                      <p>
                        {m.summary ||
                          m.description?.slice(0, 80) ||
                          "Production machinery platform."}
                      </p>
                      <div className="machine-card-bottom">
                        <span>
                          FROM <strong>{price}</strong>
                        </span>
                        <Link to={detailUrl} aria-label={`View ${m.name}`}>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section className="how-section" id="how-it-works">
        <div className="how-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> A clearer way to buy

          </div>
          <h2>From first idea<br/>to first 

            <em> part.</em>
          </h2>
          <p>Get a useful estimate, then work through the important details with someone who knows the machine and your market.</p>
          <Link className="button button-dark" to="/machines">Start configuring 

            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="steps-list">
          <article className="journey-step">
            <span className="step-number">01</span>
            <span className="step-icon">
              <i className="bi bi-toggles"></i>
            </span>
            <div>
              <h3>Choose your platform</h3>
              <p>Compare machine capabilities, footprint, and starting price.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">02</span>
            <span className="step-icon">
              <i className="bi bi-sliders"></i>
            </span>
            <div>
              <h3>Shape your specification</h3>
              <p>Explore available options and build a clear starting configuration.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">03</span>
            <span className="step-icon">
              <i className="bi bi-chat-dots"></i>
            </span>
            <div>
              <h3>Talk with a local expert</h3>
              <p>Share your application and discuss the requirements that matter.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
          <article className="journey-step">
            <span className="step-number">04</span>
            <span className="step-icon">
              <i className="bi bi-file-earmark-check"></i>
            </span>
            <div>
              <h3>Receive your final quote</h3>
              <p>Your representative confirms the details and prepares a tailored quotation.</p>
            </div>
            <i className="bi bi-arrow-up-right step-arrow"></i>
          </article>
        </div>
      </section>
      <section className="capability-section section-space">
        <div className="capability-photo">
          <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1100&q=85" alt="Engineer inspecting industrial manufacturing equipment" loading="lazy"/>
          <span>BUILT WITH THE PEOPLE WHO RUN IT</span>
        </div>
        <div className="capability-copy">
          <div className="eyebrow">
            <span></span> More than a machine

          </div>
          <h2>Good engineering<br/>keeps showing up.</h2>
          <p>Every production floor has its own pressures. Our team helps match the right platform and options to your material, workflow, and plans for growth.</p>
          <div className="capability-points">
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>Practical guidance</strong>
                <small>Talk through the application with a real specialist.</small>
              </span>
            </div>
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>Regional support</strong>
                <small>Work with a representative who understands your market.</small>
              </span>
            </div>
            <div>
              <i className="bi bi-check2"></i>
              <span>
                <strong>A considered quote</strong>
                <small>Final pricing follows a technical conversation.</small>
              </span>
            </div>
          </div>
          <Link className="text-arrow" to="/contact">Meet your local team 

            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
      </section>      <section className="testimonial-section" id="testimonial">
        <div className="testimonial-intro">
          <div>
            <div className="eyebrow">
              <span></span> Customer stories
            </div>
            <h2>Good work travels.<br/>
              <em> Good partners stay.</em>
            </h2>
          </div>
          <p>Verified field feedback from machine operators and engineering leads.</p>
          <button
            type="button"
            className="button button-dark"
            style={{ marginTop: "14px", fontSize: "11px", padding: "7px 14px", width: "fit-content", cursor: "pointer" }}
            onClick={() => setShowReviewModal(true)}
          >
            <i className="bi bi-pencil-square"></i> Share your review
          </button>
        </div>
        <div className="carousel slide testimonial-carousel" id="customerStories" data-carousel data-carousel-interval="7000">
          <div className="carousel-inner testimonial-pages" data-carousel-track>
            {loadingReviews ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7c72" }}>
                Loading customer stories from live database...
              </div>
            ) : reviewPages.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#6b7c72" }}>
                No customer reviews recorded yet. Be the first to share your experience.
              </div>
            ) : (
              reviewPages.map((page, pageIdx) => (
                <div
                  className={`carousel-item ${pageIdx === 0 ? "active" : ""} testimonial-page`}
                  id={`customer-story-page-${pageIdx + 1}`}
                  data-carousel-slide
                  key={pageIdx}
                >
                  {page.map((rev, cardIdx) => {
                    const globalIdx = pageIdx * 3 + cardIdx;
                    const photoUrl =
                      rev.imageUrl ||
                      rev.image ||
                      rev.avatar ||
                      DUMMY_REVIEW_AVATARS[globalIdx % DUMMY_REVIEW_AVATARS.length];

                    return (
                      <figure className="testimonial-card" key={rev._id || globalIdx}>
                        <img
                          className="testimonial-photo"
                          src={photoUrl}
                          alt={`Portrait of ${rev.authorName}`}
                          loading="lazy"
                        />
                        <blockquote>“{rev.comment || rev.headline}”</blockquote>
                        <figcaption>
                          <strong>{rev.authorName}</strong>
                          <span>{rev.authorTitle || "Verified Customer"}</span>
                          <small>
                            {rev.company}
                            {rev.country ? ` · ${rev.country}` : ""}
                            {rev.machinePurchased ? ` · ${rev.machinePurchased}` : ""}
                          </small>
                        </figcaption>
                        <span className="testimonial-mark">
                          <i className="bi bi-quote"></i>
                        </span>
                      </figure>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          {reviewPages.length > 1 && (
            <div className="testimonial-controls">
              <button
                className="carousel-control-prev story-control"
                type="button"
                data-carousel-prev
                aria-label="Previous customer stories"
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <button
                className="carousel-control-next story-control"
                type="button"
                data-carousel-next
                aria-label="Next customer stories"
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Review Submission Modal (POST /api/v1/reviews) */}
      {showReviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(18, 30, 24, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowReviewModal(false)}
        >
          <div
            style={{
              background: "#ffffff",
              maxWidth: "540px",
              width: "100%",
              borderRadius: "8px",
              padding: "28px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
              border: "1px solid #d4ddd7",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: "6px" }}>
                  <span></span> VERIFIED REVIEW
                </div>
                <h3 style={{ margin: 0, fontSize: "20px", color: "#16281e" }}>
                  Share your experience
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7c72" }}>
                  Your feedback helps other machine operators and engineering leads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6b7c72",
                  padding: "4px",
                }}
                aria-label="Close modal"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Your Name *
                  </span>
                  <input
                    required
                    className="rep-input"
                    placeholder="e.g. Daniel Torres"
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                  />
                </label>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Job Title *
                  </span>
                  <input
                    required
                    className="rep-input"
                    placeholder="e.g. Head of Tooling Operations"
                    value={reviewForm.authorTitle}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorTitle: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Company *
                  </span>
                  <input
                    required
                    className="rep-input"
                    placeholder="e.g. Meridian Precision Works"
                    value={reviewForm.company}
                    onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                  />
                </label>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Country *
                  </span>
                  <input
                    required
                    className="rep-input"
                    placeholder="e.g. United States"
                    value={reviewForm.country}
                    onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: "12px" }}>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Machine Purchased *
                  </span>
                  <input
                    required
                    className="rep-input"
                    placeholder="e.g. MS-T1000 CNC Turning Center"
                    value={reviewForm.machinePurchased}
                    onChange={(e) => setReviewForm({ ...reviewForm, machinePurchased: e.target.value })}
                  />
                </label>
                <label style={{ display: "grid", gap: "5px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                    Rating
                  </span>
                  <select
                    className="rep-input"
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </label>
              </div>

              <label style={{ display: "grid", gap: "5px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                  Review Headline *
                </span>
                <input
                  required
                  className="rep-input"
                  placeholder="e.g. Unmatched rigidity on titanium batches"
                  value={reviewForm.headline}
                  onChange={(e) => setReviewForm({ ...reviewForm, headline: e.target.value })}
                />
              </label>

              <label style={{ display: "grid", gap: "5px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#546559" }}>
                  Your Comments &amp; Results *
                </span>
                <textarea
                  required
                  rows={4}
                  className="rep-textarea"
                  placeholder="Describe your production results, tooling life, tolerances, or commissioning experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setShowReviewModal(false)}
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-lime"
                  disabled={submittingReview}
                >
                  <i className="bi bi-send"></i> {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <section className="faq-section section-space" id="faq" aria-label="Frequently asked questions">
        <div className="faq-intro">
          <div className="eyebrow eyebrow-light">
            <span></span> Before you configure

          </div>
          <span className="faq-index">MACHINE FIELD NOTES 

          </span>
          <h2>Good questions.<br/>
            <em>Clear answers.</em>
          </h2>
          <p>Know what to expect before you choose a platform or start a conversation with our team.</p>
          <Link className="faq-contact" to="/contact">
            <i className="bi bi-headset"></i>
            <span>Have a specific application?

              <strong>Talk with a specialist</strong>
            </span>
            <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="faq-list">
          {loadingFaqs ? (
            <div style={{ padding: "30px 20px", color: "#6b7c72" }}>
              Loading frequently asked questions...
            </div>
          ) : faqs.length === 0 ? (
            <div style={{ padding: "30px 20px", color: "#6b7c72" }}>
              No frequently asked questions available at this time.
            </div>
          ) : (
            faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <details
                  key={faq._id || index}
                  open
                  className={isOpen ? "is-open" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
                  }}
                >
                  <summary>
                    <span className="faq-number">
                      {faq.questionNumber || String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-question">{faq.question}</span>
                    <i className="bi bi-plus"></i>
                  </summary>
                  <div className="faq-collapse">
                    <div className="faq-collapse-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </details>
              );
            })
          )}
        </div>
      </section>
      <section className="field-stories" id="field-stories" aria-label="MACHINE field stories">
        <div className="field-stories-heading">
          <div>
            <div className="eyebrow">
              <span></span> From the shop floor

            </div>
            <h2>Good work starts with<br/>
              <em>the right details.</em>
            </h2>
          </div>
          <p>Explore the machines, choices, and conversations that help shape a confident next step.</p>
        </div>
        <div className="carousel slide field-carousel" id="fieldCarousel" data-carousel data-carousel-interval="7000">
          <div className="carousel-inner" data-carousel-track>
            <div className="carousel-item active" id="field-story-1" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=85" alt="Engineer reviewing industrial production equipment" loading="lazy"/>
                  <span>01 / GETTING STARTED</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">A CLEARER FIRST STEP</span>
                  <h3>Start with the work you need to do.</h3>
                  <p>Part geometry, materials, tolerances, and output goals are a practical place to begin a machine conversation.</p>
                  <Link className="field-slide-link" to="/machines">Explore the machine range 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-2" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp" alt="CNC turning equipment on a production floor" loading="lazy"/>
                  <span>02 / CNC TURNING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">PRECISION CNC TURNING</span>
                  <h3>Precision turning, built for flexibility.</h3>
                  <p>Explore precision turning platforms and compare starting specifications for short or long production runs.</p>
                  <Link className="field-slide-link" to="/machines?category=Turning">View Turning Machines 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-3" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp" alt="Vertical machining centre in a factory" loading="lazy"/>
                  <span>03 / CNC MILLING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">HIGH-RIGIDITY MACHINING</span>
                  <h3>Make room for demanding parts.</h3>
                  <p>Review vertical and 5-axis machining platforms, then discuss tooling, spindle, and coolant requirements.</p>
                  <Link className="field-slide-link" to="/machines?category=Milling">View Milling Machines 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-4" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=85" alt="Laser cutting machinery in an industrial workspace" loading="lazy"/>
                  <span>04 / LASER CUTTING</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">HIGH-POWER FIBER LASER</span>
                  <h3>Bring sheet cutting into focus.</h3>
                  <p>Compare fiber laser platforms and consider power, handling, extraction, and cutting area.</p>
                  <Link className="field-slide-link" to="/machines?category=Laser">View Laser Machines 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-5" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1200&q=85" alt="Manufacturing team working with industrial equipment" loading="lazy"/>
                  <span>05 / CONFIGURATION</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">YOUR BUILD · YOUR PROCESS</span>
                  <h3>Shape a specification around your workflow.</h3>
                  <p>Use the configuration preview to compare options, then bring the details to your local representative.</p>
                  <Link className="field-slide-link" to="/configure">Configure a machine 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
            <div className="carousel-item" id="field-story-6" data-carousel-slide>
              <article className="field-slide">
                <div className="field-slide-image">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85" alt="Specialist working with manufacturing equipment" loading="lazy"/>
                  <span>06 / LOCAL EXPERTISE</span>
                </div>
                <div className="field-slide-copy">
                  <span className="field-slide-kicker">A REAL CONVERSATION</span>
                  <h3>Get practical guidance from a local team.</h3>
                  <p>Talk through your application, confirm compatible options, and work toward a quote that fits your operation.</p>
                  <Link className="field-slide-link" to="/enquiry">Start an enquiry 

                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </article>
            </div>
          </div>
          <div className="field-carousel-footer">
            <div className="field-indicators" aria-label="Choose a field story">
              <button className="active" type="button" data-carousel-to="0" aria-current="true" aria-label="Story 1"></button>
              <button type="button" data-carousel-to="1" aria-label="Story 2"></button>
              <button type="button" data-carousel-to="2" aria-label="Story 3"></button>
              <button type="button" data-carousel-to="3" aria-label="Story 4"></button>
              <button type="button" data-carousel-to="4" aria-label="Story 5"></button>
              <button type="button" data-carousel-to="5" aria-label="Story 6"></button>
            </div>
            <div className="field-carousel-controls">
              <button className="field-carousel-arrow" type="button" data-carousel-prev aria-label="Previous story">
                <i className="bi bi-arrow-left"></i>
              </button>
              <button className="field-carousel-arrow" type="button" data-carousel-next aria-label="Next story">
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="closing-cta" id="contact">
        <div className="closing-icon">
          <i className="bi bi-chat-square-text"></i>
        </div>
        <div>
          <span className="eyebrow eyebrow-light">Your next shift starts somewhere</span>
          <h2>Let's find the right machine.</h2>
        </div>
        <p>Bring us the part, the process, or just the question.</p>
        <Link className="button button-dark" to="/machines">Explore the range 

          <i className="bi bi-arrow-right"></i>
        </Link>
      </section>
    </main>
    </div>
  )
}

export default Home
