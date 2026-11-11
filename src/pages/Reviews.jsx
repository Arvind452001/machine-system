import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { reviewsApi } from "../api/reviewsApi";
import { useAuth } from "../context/AuthContext";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const AVATAR_PALETTES = [
  { bg: "#173f35", text: "#e8fdf2", border: "#2e7456" },
  { bg: "#3d140b", text: "#ffedd5", border: "#9a3412" },
  { bg: "#1e293b", text: "#f1f5f9", border: "#475569" },
  { bg: "#2d2013", text: "#fef3c7", border: "#92400e" },
  { bg: "#0f2c3d", text: "#e0f2fe", border: "#0284c7" },
  { bg: "#23272f", text: "#e2e8f0", border: "#52525b" },
];

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "MS";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarPalette = (str) => {
  let hash = 0;
  for (let i = 0; i < (str || "").length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
};

const Reviews = () => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Review submission modal state (for logged-in users)
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

  const fetchReviews = () => {
    setLoading(true);
    reviewsApi
      .getReviews()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setReviews(list);
      })
      .catch((err) => {
        console.warn("Could not load reviews:", err.message);
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Prefill modal form when logged in
  useEffect(() => {
    if (user && showReviewModal) {
      setReviewForm((prev) => ({
        ...prev,
        authorName: prev.authorName || user.name || "",
        company: prev.company || user.company || "",
        authorTitle: prev.authorTitle || user.title || user.designation || "Engineering Lead",
        country: prev.country || user.country || "United States",
      }));
    }
  }, [user, showReviewModal]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.authorName.trim() || !reviewForm.comment.trim()) {
      showErrorAlert("Validation Error", "Please provide your name and review feedback.");
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
        "Thank you! Your verified feedback has been published."
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
      showErrorAlert(
        "Submission Failed",
        err.response?.data?.message || "Could not submit review at this moment."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (r.authorName && r.authorName.toLowerCase().includes(q)) ||
        (r.company && r.company.toLowerCase().includes(q)) ||
        (r.country && r.country.toLowerCase().includes(q)) ||
        (r.machinePurchased && r.machinePurchased.toLowerCase().includes(q)) ||
        (r.headline && r.headline.toLowerCase().includes(q)) ||
        (r.comment && r.comment.toLowerCase().includes(q));

      const matchesRating =
        ratingFilter === "all" || String(r.rating) === String(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  // Overall stats
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: "5.0", fiveStarPercent: 100, total: 0 };
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / reviews.length).toFixed(1);
    const fiveStar = reviews.filter((r) => Number(r.rating) === 5).length;
    const fiveStarPercent = Math.round((fiveStar / reviews.length) * 100);
    return { avg, fiveStarPercent, total: reviews.length };
  }, [reviews]);

  return (
    <main style={{ minHeight: "80vh", background: "#fbfcfb", paddingBottom: "70px" }}>
      {/* Breadcrumb */}
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>Customer Reviews</span>
      </div>

      {/* Hero Section */}
      <section className="info-hero" style={{ paddingBottom: "35px" }}>
        <div>
          <div className="eyebrow">
            <span></span> VERIFIED CUSTOMER REVIEWS
          </div>
          <h1>
            Customer <em>Stories &amp; Feedback.</em>
          </h1>
          <p>
            Real results, tooling life observations, and field performance notes directly from
            operators and manufacturing engineers.
          </p>

          {/* Aggregate Rating Banner */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "24px",
              padding: "16px 24px",
              background: "#ffffff",
              border: "1px solid #dce1da",
              borderRadius: "6px",
              boxShadow: "0 6px 18px rgba(32, 40, 35, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "32px", fontWeight: "700", color: "#173f35", lineHeight: 1 }}>
                {stats.avg}
              </span>
              <span style={{ color: "#7d8980", fontSize: "14px" }}>/ 5.0</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ display: "flex", gap: "3px", color: "#eab308", fontSize: "16px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className="bi bi-star-fill"></i>
                ))}
              </div>
              <small style={{ color: "#4f5c53", fontSize: "11px", fontWeight: "500" }}>
                Based on {stats.total} verified customer evaluations
              </small>
            </div>

            <div
              style={{
                marginLeft: "auto",
                borderLeft: "1px solid #e4e9e2",
                paddingLeft: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {isAuthenticated ? (
                <button
                  type="button"
                  className="button button-dark"
                  style={{
                    fontSize: "11px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onClick={() => setShowReviewModal(true)}
                >
                  <i className="bi bi-pencil-square"></i> Share your review
                </button>
              ) : (
                <div style={{ fontSize: "11px", color: "#4f5c53" }}>
                  Purchased equipment?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "var(--lime)",
                      fontWeight: "600",
                      textDecoration: "underline",
                    }}
                  >
                    Sign in to leave feedback
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content Container */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 6%" }}>
        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "28px",
            padding: "16px 20px",
            background: "#ffffff",
            border: "1px solid #dce1da",
            borderRadius: "6px",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "460px" }}>
            <i
              className="bi bi-search"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7d8980",
                fontSize: "13px",
              }}
            ></i>
            <input
              type="search"
              placeholder="Search by customer, company, country, or machine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px 9px 36px",
                fontSize: "12px",
                border: "1px solid #dce1da",
                borderRadius: "4px",
                background: "#f9faf9",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#4f5c53", fontWeight: "500" }}>Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                fontSize: "12px",
                border: "1px solid #dce1da",
                borderRadius: "4px",
                background: "#ffffff",
                color: "#202823",
                cursor: "pointer",
              }}
            >
              <option value="all">All Ratings ({reviews.length})</option>
              <option value="5">5 Stars ★★★★★</option>
              <option value="4">4 Stars ★★★★</option>
              <option value="3">3 Stars ★★★</option>
            </select>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#6b7c72" }}>
            <div className="spinner-border text-danger" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: "14px", fontSize: "13px" }}>Loading verified customer reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              background: "#ffffff",
              border: "1px solid #dce1da",
              borderRadius: "6px",
              color: "#7d8980",
            }}
          >
            <i className="bi bi-chat-left-dots" style={{ fontSize: "36px", display: "block", marginBottom: "12px", color: "#c94f2d" }}></i>
            <h3 style={{ fontSize: "16px", color: "#202823", margin: "0 0 6px" }}>No reviews match your filters</h3>
            <p style={{ fontSize: "12px", margin: 0 }}>Try clearing your search term or select "All Ratings".</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "24px",
            }}
          >
            {filteredReviews.map((rev, idx) => {
              const initials = getInitials(rev.authorName);
              const palette = getAvatarPalette(rev.authorName || rev.company || "Customer");
              const hasCustomPhoto = Boolean(rev.imageUrl || rev.image || rev.avatar);
              const photoUrl = rev.imageUrl || rev.image || rev.avatar;

              return (
                <figure
                  key={rev._id || idx}
                  className="testimonial-card"
                  style={{
                    margin: 0,
                    minHeight: "330px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    border: "1px solid #d8dfd6",
                    background: "#ffffff",
                    padding: "24px",
                    borderRadius: "4px",
                    boxShadow: "0 8px 24px rgba(32, 40, 35, 0.05)",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease",
                  }}
                >
                  {/* Top Row: Avatar & Stars */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {hasCustomPhoto ? (
                        <img
                          className="testimonial-photo"
                          src={photoUrl}
                          alt={`Portrait of ${rev.authorName}`}
                          style={{ margin: 0, width: "50px", height: "50px" }}
                        />
                      ) : (
                        <div
                          className="testimonial-photo testimonial-initials-avatar"
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: 0,
                            backgroundColor: palette.bg,
                            color: palette.text,
                            border: `2px solid ${palette.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "17px",
                            fontWeight: "700",
                            letterSpacing: "0.06em",
                            userSelect: "none",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                          }}
                        >
                          {initials}
                        </div>
                      )}

                      <div>
                        <strong style={{ display: "block", color: "var(--ink)", fontSize: "13px" }}>
                          {rev.authorName}
                        </strong>
                        <span style={{ display: "block", color: "#5e6b61", fontSize: "10px" }}>
                          {rev.authorTitle || "Verified Customer"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "2px", color: "#eab308", fontSize: "13px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className={`bi ${s <= (Number(rev.rating) || 5) ? "bi-star-fill" : "bi-star"}`}
                        ></i>
                      ))}
                    </div>
                  </div>

                  {/* Headline */}
                  {rev.headline && (
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#202823",
                        lineHeight: 1.4,
                      }}
                    >
                      &ldquo;{rev.headline}&rdquo;
                    </h3>
                  )}

                  {/* Comment */}
                  <blockquote
                    style={{
                      margin: "0 0 18px",
                      color: "#38453c",
                      fontSize: "12px",
                      fontWeight: "400",
                      lineHeight: "1.75",
                      flexGrow: 1,
                    }}
                  >
                    {rev.comment}
                  </blockquote>

                  {/* Footer metadata */}
                  <figcaption
                    style={{
                      marginTop: "auto",
                      paddingTop: "12px",
                      borderTop: "1px solid #e4e9e2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "6px",
                      fontSize: "9px",
                      color: "#879188",
                    }}
                  >
                    <span>
                      <strong style={{ color: "#4f5c53" }}>{rev.company}</strong>
                      {rev.country ? ` · ${rev.country}` : ""}
                    </span>

                    {rev.machinePurchased && (
                      <span
                        style={{
                          background: "#f1f5f2",
                          color: "#173f35",
                          padding: "2px 7px",
                          borderRadius: "3px",
                          fontWeight: "500",
                        }}
                      >
                        {rev.machinePurchased}
                      </span>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Submission Modal (For Logged-in Users) */}
      {showReviewModal && (
        <div
          id="testimonial"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(18, 24, 20, 0.72)",
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
              boxShadow: "0 24px 48px rgba(0,0,0,0.22)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div>
                <div className="eyebrow" style={{ marginBottom: "6px" }}>
                  <span></span> VERIFIED REVIEW
                </div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#202823" }}>
                  Share your experience
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#6b7c72" }}>
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

            <form onSubmit={handleReviewSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    placeholder="e.g. Daniel Torres"
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.authorTitle}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorTitle: e.target.value })}
                    placeholder="e.g. Head of Tooling Operations"
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.company}
                    onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                    placeholder="e.g. Meridian Precision Works"
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.country}
                    onChange={(e) => setReviewForm({ ...reviewForm, country: e.target.value })}
                    placeholder="United States"
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Machine Purchased *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.machinePurchased}
                    onChange={(e) => setReviewForm({ ...reviewForm, machinePurchased: e.target.value })}
                    placeholder="e.g. MS-T1000 CNC Turning Center"
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                    Rating
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px", background: "#ffffff" }}
                  >
                    <option value="5">5 Stars ★★★★★</option>
                    <option value="4">4 Stars ★★★★</option>
                    <option value="3">3 Stars ★★★</option>
                    <option value="2">2 Stars ★★</option>
                    <option value="1">1 Star ★</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.headline}
                  onChange={(e) => setReviewForm({ ...reviewForm, headline: e.target.value })}
                  placeholder="e.g. Unmatched rigidity on titanium batches"
                  style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "600", color: "#202823", textTransform: "uppercase", marginBottom: "4px" }}>
                  Your Comments &amp; Results *
                </label>
                <textarea
                  required
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Describe your production results, tooling life, tolerances, or commissioning experience..."
                  style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px", fontFamily: "inherit", resize: "vertical" }}
                ></textarea>
              </div>

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
    </main>
  );
};

export default Reviews;
