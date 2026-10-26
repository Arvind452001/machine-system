import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { enquiriesApi } from "../api/enquiriesApi";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

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
        const d = res?.data || res;
        if (d && (d._id || d.enquiryNumber || d.customerDetails || d.machineSummary)) {
          setRawId(d._id || enquiryId);
          setSelectedStatus(d.status || "Needs first contact");

          const customerName = d.customerDetails?.name || d.name || "Customer";
          const initials = customerName
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

          setEnq({
            id: d.enquiryNumber || d._id || enquiryId,
            dateReceived: dateStr,
            type: d.machineSummary?.type || d.type || "MACHINERY",
            machineTitle: d.machineSummary?.name || d.machineTitle || d.machine || "Configured Machine",
            machineFull: d.machineSummary?.title || d.machineTitle || d.machine || "Configured Machine Platform",
            machineCode: d.machineSummary?.machineCode || d.machineSummary?.sku || "MACHINE",
            company: d.customerDetails?.company || d.company || "Company not specified",
            contactName: customerName,
            contactAvatar: initials,
            contactRole: d.customerDetails?.jobRole || "Representative Contact",
            email: d.customerDetails?.email || d.email || "—",
            phone: d.customerDetails?.phone || d.phone || "—",
            location: d.customerDetails?.location || d.customerDetails?.country || d.location || "Location not provided",
            status: d.status || "Needs first contact",
            spindle: d.machineSummary?.spindle || d.specifications?.spindle || "Standard",
            tooling: d.machineSummary?.tooling || d.specifications?.tooling || "Standard tooling",
            coolant: d.machineSummary?.coolant || d.specifications?.coolant || "Standard coolant",
            price: d.machineSummary?.indicativePrice
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(d.machineSummary.indicativePrice)
              : d.price
              ? String(d.price)
              : "Price upon quotation",
            customerKey: d.customerDetails?.customerKey || d.customerDetails?._id || "",
            subject: d.projectDetails?.subject || d.subject || "Machine enquiry",
            message: d.projectDetails?.message || d.message || "No project message was submitted with this enquiry.",
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
        <div style={{ padding: "64px 24px", textAlign: "center", color: "var(--muted, #666)" }}>
          Loading live enquiry details...
        </div>
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
            <span className="status-pill">{enq.status}</span>
          </section>

          <div className="rep-detail-grid rep-customer-detail-grid">
            <section className="rep-section">
              <div className="rep-section-heading">
                <span>01</span>
                <div>
                  <h3>Customer</h3>
                  <p>Contact details for this machine request.</p>
                </div>
              </div>

              <div className="rep-customer-card">
                <span className="rep-customer-avatar">{enq.contactAvatar}</span>
                <div>
                  <strong>{enq.contactName}</strong>
                  <span>
                    {enq.contactRole} · {enq.company}
                  </span>
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

              <div className="rep-contact-lines">
                {enq.email !== "—" && (
                  <a href={`mailto:${enq.email}`}>
                    <i className="bi bi-envelope"></i> {enq.email}
                  </a>
                )}
                {enq.phone !== "—" && (
                  <a href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}>
                    <i className="bi bi-telephone"></i> {enq.phone}
                  </a>
                )}
                <span>
                  <i className="bi bi-geo-alt"></i> {enq.location}
                </span>
              </div>

              {enq.customerKey && (
                <Link
                  className="rep-text-link"
                  to={`/representative/customer-details?customer=${enq.customerKey}`}
                >
                  Open customer details <i className="bi bi-arrow-right"></i>
                </Link>
              )}
            </section>

            <section className="rep-section">
              <div className="rep-section-heading">
                <span>02</span>
                <div>
                  <h3>Requested machine</h3>
                  <p>Configuration submitted with the enquiry.</p>
                </div>
              </div>

              <div className="rep-config-summary">
                <div className="rep-machine-line">
                  <div>
                    <small>{enq.machineCode}</small>
                    <strong>{enq.machineFull}</strong>
                  </div>
                  <span>Qty 1</span>
                </div>

                <dl>
                  <dd>
                    <div>
                      <dl>
                        <dt>Spindle</dt>
                        <dd>{enq.spindle}</dd>
                      </dl>
                    </div>
                    <div>
                      <dl>
                        <dt>Tooling</dt>
                        <dd>{enq.tooling}</dd>
                      </dl>
                    </div>
                    <div>
                      <dl>
                        <dt>Coolant</dt>
                        <dd>{enq.coolant}</dd>
                      </dl>
                    </div>
                    <div>
                      <dl>
                        <dt>Indicative price</dt>
                        <dd>{enq.price}</dd>
                      </dl>
                    </div>
                  </dd>
                </dl>

                <p className="rep-inline-note">
                  Specifications captured from the digital configuration summary.
                </p>
              </div>
            </section>

            <section className="rep-section rep-customer-wide">
              <div className="rep-section-heading">
                <span>03</span>
                <div>
                  <h3>Customer message</h3>
                  <p>Project context submitted with this enquiry.</p>
                </div>
              </div>

              <div className="rep-conversation-placeholder">
                <i className="bi bi-chat-square-text"></i>
                <div>
                  <strong>{enq.subject}</strong>
                  <span>{enq.message}</span>
                </div>
              </div>

              <div className="rep-contact-actions">
                {enq.phone !== "—" && (
                  <a
                    className="button button-dark"
                    href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
                  >
                    <i className="bi bi-telephone"></i> Call customer
                  </a>
                )}
                {enq.email !== "—" && (
                  <a
                    className="button button-outline"
                    href={`mailto:${enq.email}?subject=${encodeURIComponent(
                      `${enq.machineTitle} enquiry - ${enq.id}`
                    )}`}
                  >
                    <i className="bi bi-envelope"></i> Email customer
                  </a>
                )}
                <Link
                  className="button button-lime"
                  to={`/representative/quotes?enquiry=${enq.id}`}
                >
                  <i className="bi bi-receipt"></i> Prepare quote
                </Link>
              </div>
            </section>

            <section className="rep-section rep-customer-wide">
              <div className="rep-section-heading">
                <span>04</span>
                <div>
                  <h3>Update Workflow Status</h3>
                  <p>Move this lead through the regional sales pipeline.</p>
                </div>
              </div>

              <form onSubmit={handleStatusUpdate} style={{ display: "grid", gap: "16px", maxWidth: "600px" }}>
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
