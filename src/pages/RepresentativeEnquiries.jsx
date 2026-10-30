import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_SIZE = 10;

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

const RepresentativeEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    enquiriesApi
      .getAssignedEnquiries()
      .then((res) => {
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (mounted && items.length > 0) {
          const mapped = items.map((enq) => {
            const status = enq.status || "Assigned";
            const dateStr = enq.createdAt
              ? new Date(enq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            const custName =
              enq.fullName ||
              (enq.firstName && enq.lastName ? `${enq.firstName} ${enq.lastName}` : "") ||
              enq.customer?.name ||
              enq.customerDetails?.name ||
              enq.name ||
              "Enterprise Customer";

            const initials =
              custName
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
              rawId: enq._id,
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

          setEnquiries(mapped);
        } else if (mounted) {
          setEnquiries([]);
        }
      })
      .catch((err) => {
        console.warn("Failed to load representative enquiries:", err.message);
        if (mounted) setEnquiries([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Filtered queries based on search query and status filter
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Status filter
      if (statusFilter !== "all") {
        const itemStatus = item.status.toLowerCase();
        if (statusFilter === "needs_contact" && !itemStatus.includes("contact") && itemStatus !== "assigned") {
          return false;
        }
        if (statusFilter === "quote" && !itemStatus.includes("quote")) {
          return false;
        }
        if (statusFilter === "review" && !itemStatus.includes("review")) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesRef = item.enquiryNumber?.toLowerCase().includes(q);
        const matchesCustomer = item.contact?.toLowerCase().includes(q);
        const matchesCompany = item.company?.toLowerCase().includes(q);
        const matchesMachine = item.machine?.toLowerCase().includes(q);
        const matchesCode = item.machineCode?.toLowerCase().includes(q);
        return matchesRef || matchesCustomer || matchesCompany || matchesMachine || matchesCode;
      }

      return true;
    });
  }, [enquiries, searchQuery, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalAssigned = enquiries.length;
  const needsFirstContact = enquiries.filter(
    (e) => e.status.toLowerCase().includes("contact") || e.status.toLowerCase() === "assigned"
  ).length;
  const requirementsReview = enquiries.filter((e) =>
    e.status.toLowerCase().includes("review")
  ).length;
  const quoteInProgress = enquiries.filter((e) =>
    e.status.toLowerCase().includes("quote")
  ).length;

  const paginatedItems = filteredEnquiries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ALL ENQUIRIES</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> TERRITORY PORTFOLIO
          </div>
          <h1>All Assigned Enquiries.</h1>
          <p>
            Complete directory of all regional machine requests, client build configurations, and live lead status.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link className="button button-lime" to="/representative/new-enquiry">
            <i className="bi bi-plus-lg"></i> New Customer Enquiry
          </Link>
          <Link className="button button-outline" to="/representative/dashboard">
            <i className="bi bi-speedometer2"></i> Dashboard
          </Link>
        </div>
      </section>

      {/* METRIC COUNTERS */}
      <section
        className="customer-metrics rep-metrics"
        aria-label="Enquiry summary"
      >
        <article className="customer-metric">
          <span>TOTAL ASSIGNED</span>
          <strong>{String(totalAssigned).padStart(2, "0")}</strong>
          <i className="bi bi-inbox-fill"></i>
        </article>
        <article className="customer-metric">
          <span>NEEDS FIRST CONTACT</span>
          <strong>{String(needsFirstContact).padStart(2, "0")}</strong>
          <i className="bi bi-telephone-fill"></i>
        </article>
        <article className="customer-metric">
          <span>REQUIREMENTS REVIEW</span>
          <strong>{String(requirementsReview).padStart(2, "0")}</strong>
          <i className="bi bi-list-check"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>QUOTE IN PROGRESS</span>
          <strong>{String(quoteInProgress).padStart(2, "0")}</strong>
          <i className="bi bi-receipt"></i>
        </article>
      </section>

      {/* FULL-WIDTH ENQUIRIES TABLE CARD */}
      <section className="rep-full-width-section" aria-label="All Territory Enquiries">
        <div className="rep-full-table-card">
          <div className="card-header-bar">
            <div className="rep-table-title-group">
              <span className="eyebrow" style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, letterSpacing: "0.08em" }}>
                DATABASE DIRECTORY
              </span>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <h2>All Territory Enquiries</h2>
                <span className="rep-badge-count">
                  {filteredEnquiries.length} {filteredEnquiries.length === 1 ? "Enquiry" : "Enquiries"}
                </span>
              </div>
            </div>

            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Viewing all enquiries assigned to your regional representative account
            </span>
          </div>

          {/* SEARCH & STATUS FILTER TOOLBAR */}
          <div className="rep-table-filter-toolbar">
            <div className="rep-search-input-wrap">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search by customer, machine, ref # or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>

            <div className="rep-status-filter-pills">
              <button
                type="button"
                className={`rep-filter-pill-btn ${statusFilter === "all" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All ({enquiries.length})
              </button>
              <button
                type="button"
                className={`rep-filter-pill-btn ${statusFilter === "needs_contact" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("needs_contact")}
              >
                <i className="bi bi-telephone"></i> Needs Contact ({needsFirstContact})
              </button>
              <button
                type="button"
                className={`rep-filter-pill-btn ${statusFilter === "review" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("review")}
              >
                <i className="bi bi-list-check"></i> Review ({requirementsReview})
              </button>
              <button
                type="button"
                className={`rep-filter-pill-btn ${statusFilter === "quote" ? "is-active" : ""}`}
                onClick={() => setStatusFilter("quote")}
              >
                <i className="bi bi-receipt"></i> Quotes ({quoteInProgress})
              </button>
            </div>
          </div>

          {/* TABLE VIEW */}
          <div className="rep-table-wrapper">
            {loading ? (
              <LoadingSpinner text="Loading territory enquiries from live database..." minHeight="240px" size="2.2rem" />
            ) : filteredEnquiries.length === 0 ? (
              <div style={{ padding: "64px 24px", textAlign: "center", color: "#64748b" }}>
                <i className="bi bi-search" style={{ fontSize: "2.6rem", color: "#cbd5e1", display: "block", marginBottom: "12px" }}></i>
                <strong style={{ fontSize: "16px", color: "#1e293b", display: "block" }}>No Matching Enquiries Found</strong>
                <p style={{ fontSize: "13px", marginTop: "4px", color: "#64748b" }}>
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search keywords or status filter options."
                    : "No enquiries have been assigned to your territory account yet."}
                </p>
                {(searchQuery || statusFilter !== "all") && (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    style={{ marginTop: "14px" }}
                  >
                    Reset Search & Filters
                  </button>
                )}
              </div>
            ) : (
              <table className="rep-data-table">
                <thead>
                  <tr>
                    <th style={{ width: "170px" }}>Enquiry Ref & Date</th>
                    <th style={{ minWidth: "220px" }}>Customer & Company</th>
                    <th style={{ minWidth: "260px" }}>Machine & Build Options</th>
                    <th style={{ width: "130px" }}>Indicative Value</th>
                    <th style={{ width: "160px" }}>Workflow Status</th>
                    <th style={{ width: "110px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item) => (
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
                          to={`/representative/enquiry-details?id=${item.rawId || item.id || item.enquiryNumber}`}
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

          {/* Table Card Footer with Pagination */}
          {filteredEnquiries.length > 0 && (
            <div className="rep-table-card-footer">
              <span>
                Showing <strong>{Math.min(filteredEnquiries.length, (currentPage - 1) * PAGE_SIZE + 1)}</strong> to{" "}
                <strong>{Math.min(currentPage * PAGE_SIZE, filteredEnquiries.length)}</strong> of{" "}
                <strong>{filteredEnquiries.length}</strong> enquiries
                {filteredEnquiries.length < enquiries.length && ` (filtered from ${enquiries.length} total)`}
              </span>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredEnquiries.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
                itemName="enquiries"
              />
            </div>
          )}
        </div>
      </section>

      <p className="summary-note rep-disclaimer">
        Live database enquiries connected for your regional territory.
      </p>
    </main>
  );
};

export default RepresentativeEnquiries;
