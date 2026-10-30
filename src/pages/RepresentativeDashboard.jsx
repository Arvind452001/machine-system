import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const getStatusBadgeStyle = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("quote")) {
    return { background: "#ede9fe", color: "#6d28d9", border: "1px solid #ddd6fe" };
  }
  if (s.includes("review")) {
    return { background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
  }
  if (s.includes("won") || s.includes("order")) {
    return { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
  }
  if (s.includes("contact") || s === "needs first contact") {
    return { background: "#ffedd5", color: "#c2410c", border: "1px solid #fed7aa" };
  }
  // assigned / new
  return { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
};

const RepresentativeDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    assignedCount: "00",
    needsFirstContactCount: "00",
    quotesInProgressCount: "00",
    quotesSentCount: "00",
    winRate: "56%",
  });
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. GET /api/v1/stats/representative
    apiClient
      .getRepresentativeDashboard()
      .then((res) => {
        if (mounted && res) {
          const data = res.data?.data || res.data || res;
          const m = data.metrics || {};
          setMetrics({
            assignedCount: String(m.assignedEnquiries ?? 0).padStart(2, "0"),
            needsFirstContactCount: String(m.pendingQuotes ?? 0).padStart(2, "0"),
            quotesInProgressCount: String(m.pendingQuotes ?? 0).padStart(2, "0"),
            quotesSentCount: String(m.acceptedQuotes ?? 0).padStart(2, "0"),
            winRate: `${m.winRate || 56}%`,
          });
        }
      })
      .catch((err) => {
        console.warn("Using offline representative stats fallback:", err.message);
      });

    // 2. GET /api/v1/enquiries/assigned
    apiClient
      .getAssignedEnquiries()
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (items.length > 0) {
          const mapped = items.map((enq) => {
            const status = enq.status || "Assigned";
            const dateStr = enq.createdAt
              ? new Date(enq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Recent";

            const custName =
              enq.fullName ||
              (enq.firstName && enq.lastName ? `${enq.firstName} ${enq.lastName}` : "") ||
              enq.customer?.name ||
              enq.customerDetails?.name ||
              enq.name ||
              "Enterprise Customer";

            const initials = custName
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "CU";

            const machineName =
              enq.machineName ||
              enq.machine?.name ||
              enq.machineSummary?.name ||
              "Industrial Machine Platform";

            const machineCode =
              enq.machineCode ||
              enq.machine?.sku ||
              enq.machineSummary?.machineCode ||
              "";

            const company =
              enq.company ||
              enq.customer?.company ||
              enq.customerDetails?.company ||
              "Direct Account";

            const calculatedTotal = Number(
              enq.calculatedTotal ||
              enq.targetBudget ||
              enq.machineSummary?.indicativePrice ||
              enq.indicativePrice ||
              0
            );

            const optionsCount = Array.isArray(enq.selectedOptions)
              ? enq.selectedOptions.length
              : 0;

            return {
              id: enq._id,
              enquiryNumber: enq.referenceNumber || enq.enquiryNumber || enq._id,
              date: dateStr,
              machine: machineName,
              machineCode: machineCode,
              company: company,
              contact: custName,
              initials: initials,
              status: status,
              calculatedTotal: calculatedTotal,
              optionsCount: optionsCount,
            };
          });

          setQueue(mapped);

          // Update metrics from actual queue count if API was default
          setMetrics((prev) => ({
            ...prev,
            assignedCount: String(mapped.length).padStart(2, "0"),
            needsFirstContactCount: String(
              mapped.filter(
                (q) =>
                  q.status.toLowerCase() === "new" ||
                  q.status.toLowerCase() === "assigned" ||
                  q.status.toLowerCase().includes("contact")
              ).length
            ).padStart(2, "0"),
            quotesInProgressCount: String(
              mapped.filter((q) => q.status.toLowerCase().includes("quote")).length
            ).padStart(2, "0"),
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load assigned enquiries queue:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const repName = user?.name ? user.name.split(" ")[0] : "Representative";

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / OVERVIEW</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> REGIONAL SALES REPRESENTATIVE
          </div>
          <h1>Good day, {repName}.</h1>
          <p>
            Your active territory enquiries, custom machine configurations, and commercial proposals.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="button button-lime" to="/representative/new-enquiry">
            <i className="bi bi-plus-lg"></i> New Customer Enquiry
          </Link>
          <Link className="button button-dark" to="/representative/quotes">
            <i className="bi bi-file-earmark-check"></i> Quotes Hub
          </Link>
          <Link className="button button-outline" to="/representative/customers">
            <i className="bi bi-people"></i> Accounts
          </Link>
        </div>
      </section>

      {/* METRICS ROW */}
      <section
        aria-label="Representative workload"
        className="customer-metrics rep-metrics"
      >
        <article className="customer-metric">
          <span>ASSIGNED LEADS</span>
          <strong>{metrics.assignedCount}</strong>
          <i className="bi bi-inbox-fill"></i>
        </article>
        <article className="customer-metric">
          <span>NEEDS FIRST CONTACT</span>
          <strong>{metrics.needsFirstContactCount}</strong>
          <i className="bi bi-telephone-fill"></i>
        </article>
        <article className="customer-metric">
          <span>QUOTES IN PIPELINE</span>
          <strong>{metrics.quotesInProgressCount}</strong>
          <i className="bi bi-file-earmark-text-fill"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>TERRITORY WIN RATE</span>
          <strong>{metrics.winRate}</strong>
          <i className="bi bi-trophy-fill"></i>
        </article>
      </section>

      {/* FULL-WIDTH ASSIGNED ENQUIRIES TABLE (TOP 5) */}
      <section className="rep-full-width-section" aria-label="Assigned Enquiries Queue">
        <div className="rep-full-table-card">
          <div className="card-header-bar">
            <div className="rep-table-title-group">
              <span className="eyebrow" style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, letterSpacing: "0.08em" }}>
                YOUR TERRITORY PIPELINE
              </span>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <h2>Assigned Enquiries</h2>
                <span className="rep-badge-count">
                  <i className="bi bi-inbox-fill text-muted"></i>
                  Showing {Math.min(5, queue.length)} of {queue.length}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                className="button button-lime"
                to="/representative/enquiries"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <span>View All ({queue.length}) Enquiries</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          <div className="rep-table-wrapper">
            {loading ? (
              <LoadingSpinner text="Loading assigned customer queue..." minHeight="200px" size="2rem" />
            ) : queue.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center", color: "#64748b" }}>
                <i className="bi bi-inbox" style={{ fontSize: "2.6rem", color: "#cbd5e1", display: "block", marginBottom: "12px" }}></i>
                <strong style={{ fontSize: "16px", color: "#1e293b", display: "block" }}>No Assigned Enquiries Yet</strong>
                <p style={{ fontSize: "13px", marginTop: "4px", color: "#64748b" }}>
                  All territory enquiries are currently processed. New customer submissions will appear here.
                </p>
                <Link className="button button-dark" to="/representative/new-enquiry" style={{ marginTop: "16px", textDecoration: "none" }}>
                  <i className="bi bi-plus-lg me-1"></i> Register New Customer Lead
                </Link>
              </div>
            ) : (
              <table className="rep-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "160px" }}>Enquiry Ref & Date</th>
                    <th style={{ minWidth: "220px" }}>Customer & Company</th>
                    <th style={{ minWidth: "260px" }}>Machine & Build Options</th>
                    <th style={{ width: "130px" }}>Indicative Value</th>
                    <th style={{ width: "150px" }}>Workflow Status</th>
                    <th style={{ width: "110px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.slice(0, 5).map((item) => (
                    <tr key={item.enquiryNumber || item.id}>
                      {/* Ref & Date */}
                      <td>
                        <div className="rep-table-ref-col">
                          <span className="rep-ref-pill">{item.enquiryNumber}</span>
                          <span className="rep-table-date">
                            <i className="bi bi-calendar3"></i> {item.date}
                          </span>
                        </div>
                      </td>

                      {/* Customer & Company */}
                      <td>
                        <div className="rep-table-customer-col">
                          <span className="rep-table-avatar">{item.initials}</span>
                          <div className="rep-table-customer-info">
                            <strong>{item.contact}</strong>
                            <span>
                              <i className="bi bi-building me-1" style={{ color: "#94a3b8" }}></i>
                              {item.company}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Machine & Options */}
                      <td>
                        <div className="rep-table-machine-col">
                          <strong title={item.machine}>{item.machine}</strong>
                          <div className="rep-table-badges-row">
                            {item.machineCode && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#334155",
                                  background: "#f1f5f9",
                                  padding: "2px 7px",
                                  borderRadius: "4px",
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                {item.machineCode}
                              </span>
                            )}
                            {item.optionsCount > 0 ? (
                              <span className="rep-options-badge" style={{ margin: 0 }}>
                                <i className="bi bi-sliders"></i> {item.optionsCount} custom options
                              </span>
                            ) : (
                              <span style={{ fontSize: "11px", color: "#94a3b8" }}>Standard build</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Value / Budget */}
                      <td>
                        {item.calculatedTotal > 0 ? (
                          <span className="rep-price-badge">
                            ${item.calculatedTotal.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: "12px" }}>—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className="rep-status-pill-clean"
                          style={getStatusBadgeStyle(item.status)}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: "right" }}>
                        <Link
                          className="button button-dark"
                          to={`/representative/enquiry-details?id=${item.id || item.enquiryNumber}`}
                          style={{
                            minHeight: "34px",
                            padding: "0 12px",
                            fontSize: "12px",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>Review</span>
                          <i className="bi bi-arrow-right"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Card Footer */}
          {queue.length > 0 && (
            <div className="rep-table-card-footer">
              <span>
                Showing <strong>{Math.min(5, queue.length)}</strong> of <strong>{queue.length}</strong> assigned enquiries.
                {queue.length > 5 && ` (${queue.length - 5} more enquiries waiting in your full territory list)`}
              </span>
              <Link
                className="button button-outline"
                to="/representative/enquiries"
                style={{
                  minHeight: "34px",
                  padding: "0 14px",
                  fontSize: "12px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>Browse All ({queue.length}) Enquiries</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          )}
        </div>

        {/* WORKFLOWS & SLA GRID BELOW FULL-WIDTH TABLE */}
        <div className="rep-dashboard-secondary-grid">
          <section className="rep-lead-detail">
            <div className="rep-lead-top">
              <div>
                <span className="rep-kicker">COMMERCIAL WORKFLOWS</span>
                <h3>Representative Actions</h3>
              </div>
            </div>
            <div className="p-4" style={{ display: "grid", gap: "16px" }}>
              <p style={{ margin: 0, color: "#475569", fontSize: "13px", lineHeight: "1.6" }}>
                Collaborate with factory specialists, confirm tooling lead times, and issue formal technical proposals.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                <Link
                  className="button button-lime"
                  to="/representative/quotes"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  <i className="bi bi-receipt"></i> Prepare New Quotation
                </Link>
                <Link
                  className="button button-dark"
                  to="/representative/customers"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  <i className="bi bi-people"></i> Customer Directory
                </Link>
                <Link
                  className="button button-outline"
                  to="/machines"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", textDecoration: "none" }}
                >
                  <i className="bi bi-cpu"></i> Machine Specifications
                </Link>
              </div>
            </div>
          </section>

          {/* TERRITORY SLA & BEST PRACTICES */}
          <section className="rep-lead-detail">
            <div className="rep-lead-top">
              <div>
                <span className="rep-kicker">BEST PRACTICES</span>
                <h3>Territory Pipeline SLA</h3>
              </div>
            </div>
            <div className="p-4" style={{ display: "grid", gap: "14px", fontSize: "13px", color: "#475569" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#fef3c7",
                    color: "#d97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-lightning-charge-fill" style={{ fontSize: "16px" }}></i>
                </div>
                <div>
                  <strong style={{ color: "#1e293b", display: "block", fontSize: "14px" }}>First Contact Response (24h)</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Reaching out within 24 hours of customer submission increases custom build conversion by over 40%.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#f0fdfa",
                    color: "#0f766e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className="bi bi-sliders2" style={{ fontSize: "16px" }}></i>
                </div>
                <div>
                  <strong style={{ color: "#1e293b", display: "block", fontSize: "14px" }}>Verify Build Configuration</strong>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Carefully review customer spindle, tooling, and safety package options before issuing binding quotations.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default RepresentativeDashboard;
