import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { contentApi } from "../api/contentApi";

/**
 * Helper to derive anchor IDs matching standard terms anchors
 */
const getSectionId = (title) => {
  const lower = title.toLowerCase();
  if (lower.includes("acceptance") || lower.includes("permitted")) return "acceptance";
  if (lower.includes("product") || lower.includes("information")) return "information";
  if (lower.includes("enquir") || lower.includes("quotes") || lower.includes("configuration")) return "quotes";
  if (lower.includes("account")) return "accounts";
  if (lower.includes("intellectual") || lower.includes("property")) return "ip";
  if (lower.includes("third-party") || lower.includes("links")) return "third-party";
  if (lower.includes("availability")) return "availability";
  if (lower.includes("liability")) return "liability";
  if (lower.includes("change")) return "changes";
  if (lower.includes("contact")) return "contact";

  // Fallback slugification
  return lower
    .replace(/^\d+[\.\s]*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/**
 * Helper to format navigation label from section heading (e.g. "1. Acceptance and permitted use" -> "Acceptance and permitted use")
 */
const getNavLabel = (title) => {
  return title.replace(/^\d+[\.\s]*/, "").trim();
};

/**
 * Helper to parse markdown-like body into structured sections
 */
const parseContentBody = (rawBody = "") => {
  const lines = rawBody.split("\n");
  let lastUpdated = "";
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for "Last updated: ..."
    if (/^last updated:/i.test(line)) {
      lastUpdated = line.replace(/^last updated:\s*/i, "").trim();
      continue;
    }

    // Check for heading (### or ##)
    if (/^#{1,3}\s+/.test(line)) {
      const headingText = line.replace(/^#{1,3}\s+/, "").trim();
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headingText,
        id: getSectionId(headingText),
        navLabel: getNavLabel(headingText),
        paragraphs: [],
      };
      continue;
    }

    // Accumulate paragraph text into current section
    if (currentSection) {
      currentSection.paragraphs.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { lastUpdated, sections };
};

/**
 * Render paragraph text, converting [Text](url) markdown links into React Router Link or <a>
 */
const renderParagraphWithLinks = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];

    if (url.startsWith("/")) {
      parts.push(
        <Link key={match.index} to={url}>
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a key={match.index} href={url} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const Terms = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentData, setContentData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    contentApi
      .getContentBySlug("terms")
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && res?.data) {
          setContentData(res.data);
        } else if (res?.data) {
          setContentData(res.data);
        } else {
          setContentData(res);
        }
      })
      .catch((err) => {
        console.error("Failed to load terms:", err);
        if (isMounted) setError("Unable to load the terms of service right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle anchor scrolling once content is loaded or on hash change
  useEffect(() => {
    if (!loading && location.hash) {
      const targetId = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, location.hash]);

  const parsed = parseContentBody(contentData?.body || "");
  const formattedDate =
    parsed.lastUpdated ||
    (contentData?.publishedAt
      ? new Date(contentData.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "October 21, 2026");

  return (
    <main>
      <div className="page-crumb">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <span>{contentData?.title || "Terms & Conditions"}</span>
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
        {loading ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", width: "100%" }}>
            <div className="spinner-border text-danger" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p style={{ marginTop: "1rem", color: "#666" }}>Loading Terms &amp; Conditions...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "3rem 1rem", textAlign: "center", width: "100%" }}>
            <p style={{ color: "#d9534f", fontSize: "1.1rem" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline-dark"
              style={{ marginTop: "1rem" }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <nav className="legal-nav" aria-label="Terms and conditions sections">
              <strong>ON THIS PAGE</strong>
              {parsed.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.navLabel}
                </a>
              ))}
            </nav>

            <div className="legal-copy">
              <p className="legal-updated">Last updated: {formattedDate}</p>

              {parsed.sections.length > 0 ? (
                parsed.sections.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((p, idx) => (
                      <p key={idx}>{renderParagraphWithLinks(p)}</p>
                    ))}
                  </section>
                ))
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {contentData?.body}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Terms;
