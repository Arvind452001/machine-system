import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { enquiriesApi } from "../api/enquiriesApi";
import { BASE_URL } from "../api/axiosInstance";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";
import LoadingSpinner from "../components/LoadingSpinner";

const RepresentativeEnquiryDetails = () => {
  const [searchParams] = useSearchParams();
  const enquiryId = searchParams.get("id");
  const [enq, setEnq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rawId, setRawId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Needs first contact");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!enquiryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .getEnquiry(enquiryId)
      .then((res) => {
        if (!mounted) return;
        // Support both Axios { data: { success, data } } and direct { success, data } or { ... }
        const d = res?.data?.data || res?.data || res;
        if (d && (d._id || d.referenceNumber || d.enquiryNumber || d.customer || d.machine || d.machineName)) {
          setRawId(d._id || enquiryId);
          setSelectedStatus(d.status || "Needs first contact");

          // Deduplicate customer details: resolve once from best source without duplicate labels
          const customerName =
            d.fullName ||
            (d.firstName && d.lastName ? `${d.firstName} ${d.lastName}` : "") ||
            d.customer?.name ||
            d.customerDetails?.name ||
            d.name ||
            "Customer";

          const initials =
            customerName
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "CU";

          const dateStr = d.createdAt
            ? new Date(d.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).toUpperCase()
            : "RECENT";

          // Deduplicate selected options from response
          const rawOptions = Array.isArray(d.selectedOptions)
            ? d.selectedOptions
            : Array.isArray(d.options)
            ? d.options
            : [];

          const seenNames = new Set();
          const uniqueOptions = [];

          rawOptions.forEach((opt) => {
            if (!opt) return;
            const name =
              typeof opt === "string"
                ? opt
                : (opt.name || opt.label || opt.code || "").trim();
            const key = name.toLowerCase();
            if (name && !seenNames.has(key)) {
              seenNames.add(key);
              uniqueOptions.push({
                id: opt._id || opt.id || name,
                name: name,
                code: opt.code || "",
                priceDelta: typeof opt === "object" ? Number(opt.priceDelta || 0) : 0,
              });
            }
          });

          const optionsTotalDelta = uniqueOptions.reduce(
            (sum, opt) => sum + (Number(opt.priceDelta) || 0),
            0
          );

          const basePrice = Number(d.machine?.basePrice || 0);
          const calculatedTotal = Number(
            d.calculatedTotal ||
            d.targetBudget ||
            d.machineSummary?.indicativePrice ||
            d.indicativePrice ||
            (basePrice + optionsTotalDelta) ||
            0
          );

          // Resolve image safely
          const rawImg = d.machine?.images?.[0] || d.machineImage || "";
          let machineImgUrl = null;
          if (rawImg && rawImg !== "string") {
            if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
              machineImgUrl = rawImg;
            } else {
              const cleanBase = (BASE_URL || "https://node.aitechnotech.in/machine").replace(/\/+$/, "");
              const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
              machineImgUrl = `${cleanBase}${cleanPath}`;
            }
          }

          setEnq({
            id: d.referenceNumber || d.enquiryNumber || d._id || enquiryId,
            rawId: d._id || enquiryId,
            dateReceived: dateStr,
            type: d.machine?.category || d.machineSummary?.type || "MACHINERY",
            machineTitle:
              d.machineName ||
              d.machine?.name ||
              d.machineSummary?.name ||
              "Configured Machine",
            machineFull:
              d.machineName ||
              d.machine?.name ||
              d.machineSummary?.title ||
              d.machineTitle ||
              "Configured Machine Platform",
            machineCode:
              d.machineCode ||
              d.machine?.sku ||
              d.machineSummary?.machineCode ||
              "DF-123",
            machineCategory:
              d.machine?.category ||
              d.machineSummary?.type ||
              "Industrial Machine",
            machineImage: machineImgUrl,
            basePrice: basePrice,
            optionsTotalDelta: optionsTotalDelta,
            calculatedTotal: calculatedTotal,
            selectedOptions: uniqueOptions,
            company:
              d.company ||
              d.customer?.company ||
              d.customerDetails?.company ||
              "Company not specified",
            contactName: customerName,
            contactAvatar: initials,
            contactRole:
              d.customer?.title ||
              d.customer?.role ||
              d.customerDetails?.jobRole ||
              "Customer Contact",
            email:
              d.email ||
              d.customer?.email ||
              d.customerDetails?.email ||
              "—",
            phone:
              d.phone ||
              d.customer?.phone ||
              d.customerDetails?.phone ||
              "—",
            location:
              d.country ||
              d.region ||
              d.customer?.country ||
              d.customer?.region ||
              d.customerDetails?.location ||
              "Location not provided",
            timeline:
              d.installationTimeline ||
              d.deliveryTimeline ||
              d.whenToInstall ||
              (typeof d.timeline === "string" ? d.timeline : "") ||
              "Within 1-3 months",
            contactConsent: d.contactConsent !== false,
            status: d.status || "Needs first contact",
            customerKey:
              d.customer?._id ||
              d.customer?.id ||
              d.customerDetails?.customerKey ||
              "",
            subject: d.subject || `Territory Enquiry for ${d.machineName || d.machine?.name || "Machine"}`,
            message:
              d.customerNotes ||
              d.whatShouldWeKnow ||
              d.message ||
              d.projectDetails?.message ||
              "No project notes submitted with this enquiry.",
            timelineEvents: Array.isArray(d.timeline) ? d.timeline : [],
          });
        } else {
          setEnq(null);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch representative enquiry details:", err.message);
        if (mounted) setEnq(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [enquiryId]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    try {
      const targetId = rawId || enquiryId;
      await enquiriesApi.updateStatus(targetId, {
        status: selectedStatus,
        note: statusNote,
      });
      setEnq((prev) => (prev ? { ...prev, status: selectedStatus } : prev));
      showSuccessAlert(
        "Status Updated",
        `Workflow status has been updated to "${selectedStatus}".`
      );
    } catch (err) {
      showErrorAlert(
        "Update Failed",
        err.message || "Failed to update workflow status in the live system."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ENQUIRY DETAILS</span>
      </div>

      <div className="page-crumb rep-crumb">
        <Link to="/representative/enquiries">
          <i className="bi bi-arrow-left"></i> Assigned enquiries
        </Link>
        <span>/</span>
        <span>{enq ? enq.id : enquiryId || "Not found"}</span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading live enquiry details..." minHeight="240px" />
      ) : !enq ? (
        <section
          style={{
            padding: "48px 24px",
            textAlign: "center",
            background: "#f8f9fa",
            border: "1px solid #e9ecef",
            borderRadius: "8px",
            margin: "32px 0",
          }}
        >
          <h3 style={{ margin: "0 0 12px 0", color: "#111" }}>Enquiry Not Found</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            No enquiry record was found for reference ID: <strong>{enquiryId || "None"}</strong>.
          </p>
          <Link to="/representative/enquiries" className="button button-dark">
            <i className="bi bi-arrow-left"></i> Back to assigned enquiries
          </Link>
        </section>
      ) : (
        <>
          <section className="rep-record-heading rep-customer-heading">
            <div>
              <div className="eyebrow">
                <span></span> RECEIVED {enq.dateReceived} · {enq.type}
              </div>
              <h2>
                {enq.machineTitle} <em>enquiry.</em>
              </h2>
              <p>
                {enq.company} <span>·</span> {enq.contactName} <span>·</span> {enq.id}
              </p>
            </div>
            <span className="status-pill" style={{ textTransform: "uppercase" }}>
              {enq.status}
            </span>
          </section>

          <div className="rep-detail-grid rep-customer-detail-grid">
            {/* 01: CUSTOMER PROFILE & DIRECT CONNECT */}
            <section className="rep-section">
              <div className="rep-section-heading">
                <span>01</span>
                <div>
                  <h3>Customer Profile</h3>
                  <p>Contact information and communication options.</p>
                </div>
              </div>

              <div className="rep-customer-card">
                <span className="rep-customer-avatar">{enq.contactAvatar}</span>
                <div style={{ flex: 1 }}>
                  <strong>{enq.contactName}</strong>
                  <span>{enq.company}</span>
                </div>
                {enq.customerKey && (
                  <Link
                    aria-label="Open customer record"
                    to={`/representative/customer-details?customer=${enq.customerKey}`}
                  >
                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                )}
              </div>

              <div className="rep-contact-lines" style={{ marginTop: "14px", display: "grid", gap: "8px" }}>
                {enq.email && enq.email !== "—" && (
                  <a
                    href={`mailto:${enq.email}`}
                    style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", textDecoration: "none" }}
                  >
                    <i className="bi bi-envelope" style={{ fontSize: "14px", color: "#3d7056" }}></i>
                    <span>{enq.email}</span>
                  </a>
                )}
                {enq.phone && enq.phone !== "—" && (
                  <a
                    href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
                    style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", textDecoration: "none" }}
                  >
                    <i className="bi bi-telephone" style={{ fontSize: "14px", color: "#3d7056" }}></i>
                    <span>{enq.phone}</span>
                  </a>
                )}
                {enq.location && (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#59685e" }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: "14px", color: "#3d7056" }}></i>
                    <span>{enq.location}</span>
                  </span>
                )}
                {enq.timeline && (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#59685e" }}>
                    <i className="bi bi-calendar-event" style={{ fontSize: "14px", color: "#3d7056" }}></i>
                    <span>Installation Timeline: <strong>{enq.timeline}</strong></span>
                  </span>
                )}
                {enq.contactConsent && (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#226a45" }}>
                    <i className="bi bi-shield-check" style={{ fontSize: "14px", color: "#226a45" }}></i>
                    <span>Contact Consent: <strong>Granted by customer</strong></span>
                  </span>
                )}
              </div>

              {/* Instant Call / Email Action Bar */}
              <div className="rep-contact-actions" style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {enq.phone && enq.phone !== "—" && (
                  <a
                    className="button button-dark"
                    href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
                    style={{ fontSize: "11px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <i className="bi bi-telephone"></i> Call customer
                  </a>
                )}
                {enq.email && enq.email !== "—" && (
                  <a
                    className="button button-outline"
                    href={`mailto:${enq.email}?subject=${encodeURIComponent(
                      `${enq.machineTitle} enquiry - ${enq.id}`
                    )}`}
                    style={{ fontSize: "11px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <i className="bi bi-envelope"></i> Email customer
                  </a>
                )}
              </div>
            </section>

            {/* 02: REQUESTED MACHINE & CUSTOMER SELECTED OPTIONS */}
            <section className="rep-section">
              <div className="rep-section-heading">
                <span>02</span>
                <div>
                  <h3>Requested Machine &amp; Build</h3>
                  <p>Options chosen by customer in the configurator.</p>
                </div>
              </div>

              <div className="rep-config-summary">
                <div className="rep-machine-line" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {enq.machineImage && (
                    <img
                      src={enq.machineImage}
                      alt={enq.machineFull}
                      style={{
                        width: "56px",
                        height: "56px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <small>{enq.machineCode} · {enq.machineCategory}</small>
                    <strong>{enq.machineFull}</strong>
                  </div>
                  <span style={{ fontWeight: 600 }}>Qty 1</span>
                </div>

                {/* Selected Options List */}
                {enq.selectedOptions && enq.selectedOptions.length > 0 ? (
                  <div style={{ marginTop: "14px", borderTop: "1px solid #e8ece6", paddingTop: "12px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "#647168",
                        textTransform: "uppercase",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Selected Custom Options ({enq.selectedOptions.length})</span>
                      <span style={{ color: "#3d7056", fontWeight: 600 }}>
                        Add-ons: +${enq.optionsTotalDelta.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: "grid", gap: "6px" }}>
                      {enq.selectedOptions.map((opt, idx) => (
                        <div
                          key={opt.id || idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 10px",
                            background: idx % 2 === 0 ? "#f9faf8" : "#ffffff",
                            border: "1px solid #edf1eb",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <i className="bi bi-check2-circle" style={{ color: "#3d7056", fontSize: "14px" }}></i>
                            <strong style={{ color: "#2d3731", fontWeight: 600 }}>{opt.name}</strong>
                          </div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "12px",
                              color: opt.priceDelta > 0 ? "#1e6b45" : "#718096",
                              padding: "2px 8px",
                              background: opt.priceDelta > 0 ? "#eaf6ee" : "#f1f5f9",
                              borderRadius: "4px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {opt.priceDelta > 0
                              ? `+$${Number(opt.priceDelta).toLocaleString()}`
                              : "Included ($0)"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: "12px", padding: "10px", background: "#f9faf8", borderRadius: "4px", fontSize: "12px", color: "#647168" }}>
                    <i className="bi bi-info-circle me-1"></i> Standard factory configuration without custom option add-ons.
                  </div>
                )}

                {/* Price Total Summary */}
                <div className="rep-price-total" style={{ marginTop: "14px", borderRadius: "6px" }}>
                  <div>
                    <span>Calculated Total Budget</span>
                    <small>
                      Base Machine (${enq.basePrice.toLocaleString()}) + Options (+${enq.optionsTotalDelta.toLocaleString()})
                    </small>
                  </div>
                  <strong>${enq.calculatedTotal.toLocaleString()}</strong>
                </div>
              </div>
            </section>

            {/* 03: CUSTOMER PROJECT MESSAGE & QUOTATION LAUNCH */}
            <section className="rep-section rep-customer-wide">
              <div className="rep-section-heading">
                <span>03</span>
                <div>
                  <h3>Customer Requirements &amp; Notes</h3>
                  <p>Message submitted by customer with this configuration.</p>
                </div>
              </div>

              <div className="rep-conversation-placeholder" style={{ padding: "16px", borderRadius: "6px" }}>
                <i className="bi bi-chat-square-text" style={{ fontSize: "18px", color: "#3d7056" }}></i>
                <div>
                  <strong style={{ fontSize: "13px", marginBottom: "4px", color: "#2d3731" }}>
                    Customer Notes:
                  </strong>
                  <span style={{ fontSize: "13px", color: "#4a5568", lineHeight: "1.6" }}>
                    {enq.message}
                  </span>
                </div>
              </div>

              <div className="rep-contact-actions" style={{ marginTop: "14px" }}>
                <Link
                  className="button button-lime"
                  to={`/representative/quotes?enquiry=${enq.id}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 18px" }}
                >
                  <i className="bi bi-receipt"></i> Prepare quotation for this customer build
                </Link>
              </div>
            </section>

            {/* 04: WORKFLOW STATUS & HISTORY */}
            <section className="rep-section rep-customer-wide">
              <div className="rep-section-heading">
                <span>04</span>
                <div>
                  <h3>Workflow Status &amp; Timeline</h3>
                  <p>Update enquiry status and view progression history.</p>
                </div>
              </div>

              <form onSubmit={handleStatusUpdate} style={{ display: "grid", gap: "16px", maxWidth: "680px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <label style={{ display: "grid", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7c72" }}>
                      Current Status
                    </span>
                    <select
                      className="rep-input"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="assigned">Assigned</option>
                      <option value="Needs first contact">Needs first contact</option>
                      <option value="Requirements review">Requirements review</option>
                      <option value="Quote in progress">Quote in progress</option>
                      <option value="Quote Issued">Quote Issued</option>
                      <option value="Won">Won / Order Placed</option>
                      <option value="Lost">Lost</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </label>

                  <label style={{ display: "grid", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7c72" }}>
                      Note / Activity Log
                    </span>
                    <input
                      className="rep-input"
                      placeholder="e.g. Discussed technical options on call"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                    />
                  </label>
                </div>

                <button
                  className="button button-dark"
                  type="submit"
                  disabled={updatingStatus}
                  style={{ width: "fit-content" }}
                >
                  <i className="bi bi-check2-circle"></i> {updatingStatus ? "Saving status..." : "Save Workflow Status"}
                </button>
              </form>

              {/* Timeline events history */}
              {enq.timelineEvents && enq.timelineEvents.length > 0 && (
                <div style={{ marginTop: "20px", borderTop: "1px solid #e8ece6", paddingTop: "14px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#647168",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Activity Timeline History
                  </span>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {enq.timelineEvents.map((evt, idx) => (
                      <div
                        key={evt._id || idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          background: "#f9faf8",
                          border: "1px solid #edf1eb",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="status-pill" style={{ textTransform: "uppercase", fontSize: "10px", padding: "2px 8px" }}>
                            {evt.status}
                          </span>
                          <span style={{ color: "#374151" }}>{evt.note}</span>
                        </div>
                        <small style={{ color: "#9ca3af" }}>
                          {evt.timestamp
                            ? new Date(evt.timestamp).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : ""}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      )}

      <p className="summary-note rep-disclaimer">
        Live database enquiries connected for your regional territory.
      </p>
    </main>
  );
};

export default RepresentativeEnquiryDetails;
