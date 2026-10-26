import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { quotesApi } from "../api/quotesApi";
import { enquiriesApi } from "../api/enquiriesApi";
import { showSuccessAlert, showErrorAlert } from "../utils/alert";

const RepresentativeQuotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const enquiryParam = searchParams.get("enquiry");

  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'builder'
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Form / Builder state - purely clean with no dummy defaults
  const [editingId, setEditingId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [machineTitle, setMachineTitle] = useState("");
  const [enquiryRef, setEnquiryRef] = useState(enquiryParam || "");
  const [machinePrice, setMachinePrice] = useState(0);
  const [optionsPrice, setOptionsPrice] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [validity, setValidity] = useState("30 days");
  const [leadTime, setLeadTime] = useState("12–16 weeks");
  const [quoteStatus, setQuoteStatus] = useState("Ready");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const total =
    (Number(machinePrice) || 0) +
    (Number(optionsPrice) || 0) +
    (Number(deliveryPrice) || 0);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(total);

  // Load quotes from GET /api/v1/quotes/representative
  const fetchQuotes = async () => {
    setLoadingQuotes(true);
    try {
      const res = await quotesApi.getRepresentativeQuotes();
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setQuotes(items);
    } catch (err) {
      console.warn("Could not load representative quotes:", err.message);
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // If enquiry parameter is provided in query, prefill builder and switch to builder tab
  useEffect(() => {
    if (enquiryParam) {
      setActiveTab("builder");
      setEnquiryRef(enquiryParam);
      enquiriesApi
        .getEnquiryById(enquiryParam)
        .then((res) => {
          const d = res?.data || res;
          if (d) {
            if (d.customerDetails?.name || d.name) {
              setCustomerName(d.customerDetails?.name || d.name);
            }
            if (d.customerDetails?.company || d.company) {
              setCustomerCompany(d.customerDetails?.company || d.company);
            }
            if (d.customerDetails?.email || d.email) {
              setCustomerEmail(d.customerDetails?.email || d.email);
            }
            if (d.machineSummary?.name || d.machineTitle || d.machine) {
              setMachineTitle(d.machineSummary?.name || d.machineTitle || d.machine);
            }
            if (d.machineSummary?.indicativePrice) {
              setMachinePrice(d.machineSummary.indicativePrice);
            }
          }
        })
        .catch(() => {});
    }
  }, [enquiryParam]);

  // Handle Export CSV (GET /api/v1/quotes/export-csv)
  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await quotesApi.exportCsv();
      showSuccessAlert("Export Complete", "Representative quotations have been exported to CSV.");
    } catch (err) {
      showErrorAlert("Export Failed", err.message || "Failed to export quotations CSV.");
    } finally {
      setExportingCsv(false);
    }
  };

  // Handle Download PDF (GET /api/v1/quotes/{id}/pdf)
  const handleDownloadPdf = async (id, num) => {
    try {
      await quotesApi.downloadPdf(id, num || `quote-${id}`);
      showSuccessAlert("Download Started", "Commercial quotation PDF has been downloaded.");
    } catch (err) {
      showErrorAlert("Download Failed", err.message || "Could not download quotation PDF.");
    }
  };

  // Handle Status Change (PATCH /api/v1/quotes/{id}/status)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await quotesApi.updateStatus(id, { status: newStatus });
      setQuotes((prev) =>
        prev.map((q) => (q._id === id || q.id === id ? { ...q, status: newStatus } : q))
      );
      showSuccessAlert("Status Updated", `Quotation status updated to "${newStatus}".`);
    } catch (err) {
      showErrorAlert("Status Update Failed", err.message || "Failed to update quotation status.");
    }
  };

  // Edit quote: Populate form
  const handleStartEdit = (quote) => {
    setEditingId(quote._id || quote.id);
    setCustomerName(quote.customerName || quote.customerDetails?.name || "");
    setCustomerCompany(quote.customerCompany || quote.customerDetails?.company || "");
    setCustomerEmail(quote.customerEmail || quote.customerDetails?.email || "");
    setMachineTitle(quote.machineTitle || quote.machineSummary?.name || "");
    setEnquiryRef(quote.enquiryNumber || quote.enquiryId || "");
    setMachinePrice(quote.machinePrice || quote.pricing?.machinePrice || 50000);
    setOptionsPrice(quote.optionsPrice || quote.pricing?.optionsPrice || 0);
    setDeliveryPrice(quote.deliveryPrice || quote.pricing?.deliveryPrice || 0);
    setValidity(quote.validity || "30 days");
    setLeadTime(quote.leadTime || "12–16 weeks");
    setQuoteStatus(quote.status || "Ready");
    setNotes(quote.notes || "");
    setActiveTab("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSaveMessage("");
    setSaveError("");
    setActiveTab("list");
  };

  // Submit Quote (POST or PUT /api/v1/quotes)
  const handleSaveQuotation = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    const payload = {
      enquiryNumber: enquiryRef,
      customerName,
      customerCompany,
      customerEmail,
      machineTitle,
      machinePrice: Number(machinePrice) || 0,
      optionsPrice: Number(optionsPrice) || 0,
      deliveryPrice: Number(deliveryPrice) || 0,
      validity,
      leadTime,
      notes,
      status: quoteStatus,
    };

    try {
      if (editingId) {
        // PUT /api/v1/quotes/{id}
        const res = await quotesApi.updateQuote(editingId, payload);
        const qNum = res?.data?.quoteNumber || res?.quoteNumber || "Quote";
        setSaveMessage(`Quotation ${qNum} successfully updated!`);
        showSuccessAlert("Quotation Updated", `Quotation ${qNum} has been updated in the database.`);
      } else {
        // POST /api/v1/quotes
        const res = await quotesApi.createQuote(payload);
        const qNum = res?.data?.quoteNumber || res?.quoteNumber || "New Quote";
        setSaveMessage(`Quotation ${qNum} successfully created and issued!`);
        showSuccessAlert("Quotation Issued", `Quotation ${qNum} has been created and issued.`);
      }
      fetchQuotes();
      setTimeout(() => {
        if (!editingId) {
          setActiveTab("list");
        }
      }, 1500);
    } catch (err) {
      setSaveError(err.message || "Failed to save quotation. Please try again.");
      showErrorAlert("Save Failed", err.message || "Failed to save quotation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const emailBody = `Hello ${customerName},\n\nPlease find the ${machineTitle} quotation for ${customerCompany}.\n\nIndicative total: ${formattedTotal} USD excluding tax.\nEstimated lead time: ${leadTime}\nValidity: ${validity}\n${
    notes ? `\nNotes: ${notes}\n` : ""
  }\nBest regards,\nRegional Sales Representative`;

  const emailLink = `mailto:${customerEmail}?subject=${encodeURIComponent(
    `${machineTitle} quotation`
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <main className="customer-content rep-content rep-quote-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / QUOTATIONS &amp; PRICING</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="button button-outline"
            style={{ fontSize: "11px", padding: "6px 12px" }}
            onClick={handleExportCsv}
            disabled={exportingCsv}
          >
            <i className="bi bi-file-earmark-spreadsheet"></i>{" "}
            {exportingCsv ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <section className="customer-welcome rep-welcome rep-quote-hero">
        <div>
          <div className="eyebrow">
            <span></span> COMMERCIAL QUOTATION HUB
          </div>
          <h1>
            Quotations <em>&amp; commercial terms.</em>
          </h1>
          <p>
            Create formal quotes, track status, generate client PDFs, and export records.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className={`button ${activeTab === "list" ? "button-dark" : "button-outline"}`}
            onClick={() => setActiveTab("list")}
          >
            <i className="bi bi-list-ul"></i> Issued Quotes ({quotes.length})
          </button>
          <button
            className={`button ${activeTab === "builder" ? "button-lime" : "button-outline"}`}
            onClick={() => {
              setEditingId(null);
              setActiveTab("builder");
            }}
          >
            <i className="bi bi-plus-lg"></i> Build New Quote
          </button>
        </div>
      </section>

      {/* TAB 1: ISSUED QUOTES LIST */}
      {activeTab === "list" && (
        <section className="rep-section" style={{ marginTop: "24px" }}>
          <div className="rep-section-heading">
            <span>01</span>
            <div>
              <h3>Prepared quotations</h3>
              <p>Commercial quotations assigned or generated by your representative account.</p>
            </div>
          </div>

          {loadingQuotes ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7c72" }}>
              Loading quotations...
            </div>
          ) : quotes.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                background: "#faf8f5",
                borderRadius: "4px",
                margin: "16px 0",
              }}
            >
              <i
                className="bi bi-receipt"
                style={{ fontSize: "32px", color: "#6b7c72", display: "block", marginBottom: "8px" }}
              ></i>
              <strong style={{ display: "block", fontSize: "14px", color: "#16281e", marginBottom: "6px" }}>
                No quotations issued yet
              </strong>
              <p style={{ fontSize: "13px", color: "#6b7c72", maxWidth: "420px", margin: "0 auto 16px" }}>
                You have not prepared any commercial quotations yet. Click below to draft your first quote.
              </p>
              <button
                className="button button-dark"
                onClick={() => {
                  setEditingId(null);
                  setActiveTab("builder");
                }}
              >
                <i className="bi bi-plus-lg"></i> Create Quote Now
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <div className="rep-enquiry-table-head" style={{ gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr 1fr 1.6fr" }}>
                <span>QUOTE NUMBER</span>
                <span>CUSTOMER / MACHINE</span>
                <span>TOTAL (USD)</span>
                <span>DATE</span>
                <span>STATUS</span>
                <span>ACTIONS</span>
              </div>

              {quotes.map((q) => {
                const quoteId = q._id || q.id;
                const quoteNum = q.quoteNumber || `Q-${quoteId.slice(-6).toUpperCase()}`;
                const client = q.customerName || q.customerDetails?.name || "Client";
                const company = q.customerCompany || q.customerDetails?.company || "";
                const machine = q.machineTitle || q.machineSummary?.name || "Machine";
                const amt = q.totalAmount || (q.machinePrice || 0) + (q.optionsPrice || 0) + (q.deliveryPrice || 0);
                const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "Recent";
                const st = q.status || "Ready";

                return (
                  <article
                    className="rep-enquiry-row"
                    key={quoteId}
                    style={{ gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr 1fr 1.6fr", alignItems: "center" }}
                  >
                    <div>
                      <strong>{quoteNum}</strong>
                      {q.enquiryNumber && <small style={{ color: "#6b7c72" }}>Ref: {q.enquiryNumber}</small>}
                    </div>
                    <div>
                      <strong>{machine}</strong>
                      <span style={{ fontSize: "12px", color: "#6b7c72" }}>
                        {client} {company ? `· ${company}` : ""}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#16281e" }}>
                      ${Number(amt).toLocaleString()}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6b7c72" }}>{dateStr}</span>
                    <div>
                      <select
                        style={{
                          fontSize: "11px",
                          padding: "4px 8px",
                          border: "1px solid #d4ddd7",
                          borderRadius: "4px",
                          background: "#fff",
                        }}
                        value={st}
                        onChange={(e) => handleStatusChange(quoteId, e.target.value)}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Ready">Ready</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Declined">Declined</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="button button-outline"
                        style={{ padding: "4px 10px", fontSize: "11px" }}
                        title="Download official PDF"
                        onClick={() => handleDownloadPdf(quoteId, quoteNum)}
                      >
                        <i className="bi bi-file-earmark-pdf"></i> PDF
                      </button>
                      <button
                        className="button button-dark"
                        style={{ padding: "4px 10px", fontSize: "11px" }}
                        title="Edit Quote"
                        onClick={() => handleStartEdit(q)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: QUOTE BUILDER / EDITOR */}
      {activeTab === "builder" && (
        <form onSubmit={handleSaveQuotation}>
          {editingId && (
            <div
              style={{
                background: "#f0f4f2",
                border: "1px solid #d4ddd7",
                padding: "12px 18px",
                borderRadius: "4px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong style={{ fontSize: "13px", color: "#16281e" }}>
                  Currently editing quotation ({editingId})
                </strong>
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7c72" }}>
                  Save changes to update the pricing, options, validity or terms in the database.
                </p>
              </div>
              <button
                type="button"
                className="button button-outline"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            </div>
          )}

          <div className="rep-detail-grid rep-quote-page-grid">
            {/* Section 01: Pricing & Machines */}
            <section className="rep-section rep-quote-pricing">
              <div className="rep-section-heading">
                <span>01</span>
                <div>
                  <h3>Commercial pricing &amp; customer</h3>
                  <p>Configure machine specs and pricing breakdown.</p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
                <label>
                  <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#6b7c72" }}>
                    Machine Model
                  </span>
                  <input
                    className="rep-input"
                    value={machineTitle}
                    onChange={(e) => setMachineTitle(e.target.value)}
                    required
                  />
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#6b7c72" }}>
                      Customer Name
                    </span>
                    <input
                      className="rep-input"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#6b7c72" }}>
                      Company
                    </span>
                    <input
                      className="rep-input"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#6b7c72" }}>
                      Customer Email
                    </span>
                    <input
                      className="rep-input"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#6b7c72" }}>
                      Enquiry Reference
                    </span>
                    <input
                      className="rep-input"
                      value={enquiryRef}
                      onChange={(e) => setEnquiryRef(e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="rep-price-fields">
                <label>
                  <span>Machine price (USD)</span>
                  <span className="rep-money-input">
                    <b>$</b>
                    <input
                      aria-label="Machine price in USD"
                      className="quote-price-input"
                      min="0"
                      step="100"
                      type="number"
                      value={machinePrice}
                      onChange={(e) => setMachinePrice(e.target.value)}
                      required
                    />
                  </span>
                </label>
                <label>
                  <span>Options &amp; custom work</span>
                  <span className="rep-money-input">
                    <b>$</b>
                    <input
                      aria-label="Options and custom work in USD"
                      className="quote-price-input"
                      min="0"
                      step="100"
                      type="number"
                      value={optionsPrice}
                      onChange={(e) => setOptionsPrice(e.target.value)}
                    />
                  </span>
                </label>
                <label>
                  <span>Delivery &amp; installation</span>
                  <span className="rep-money-input">
                    <b>$</b>
                    <input
                      aria-label="Delivery and installation in USD"
                      className="quote-price-input"
                      min="0"
                      step="100"
                      type="number"
                      value={deliveryPrice}
                      onChange={(e) => setDeliveryPrice(e.target.value)}
                    />
                  </span>
                </label>
              </div>

              <div className="rep-price-total">
                <span>
                  INDICATIVE QUOTE TOTAL<small>USD · EXCLUDING TAX</small>
                </span>
                <strong aria-live="polite" id="quote-total">
                  {formattedTotal}
                </strong>
              </div>
            </section>

            {/* Section 02: Terms & Conditions */}
            <section className="rep-section rep-quote-terms">
              <div className="rep-section-heading">
                <span>02</span>
                <div>
                  <h3>Quote terms</h3>
                  <p>Set delivery expectations, warranty, and validity.</p>
                </div>
              </div>

              <div className="rep-quote-meta">
                <label>
                  <span>Quote valid for</span>
                  <select
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                  >
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="45 days">45 days</option>
                    <option value="60 days">60 days</option>
                  </select>
                </label>
                <label>
                  <span>Estimated lead time</span>
                  <input
                    type="text"
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                  />
                </label>
                <label>
                  <span>Initial Status</span>
                  <select
                    value={quoteStatus}
                    onChange={(e) => setQuoteStatus(e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Ready">Ready</option>
                    <option value="Sent">Sent</option>
                  </select>
                </label>
              </div>

              <label
                className="rep-field-label rep-quote-notes-label"
                htmlFor="quote-notes"
                style={{ marginTop: "14px" }}
              >
                Customer-specific quote notes
              </label>
              <textarea
                className="rep-textarea"
                id="quote-notes"
                placeholder="Add confirmed options, inclusions, installation timeline, warranty, and payment milestones."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </section>

            {/* Section 03: Final Confirmation */}
            <section className="rep-section rep-customer-wide rep-quote-final">
              <div className="rep-section-heading">
                <span>03</span>
                <div>
                  <h3>Review &amp; Issue</h3>
                  <p>Verify commercial figures before saving to database.</p>
                </div>
              </div>

              <div className="rep-quote-preview">
                <div>
                  <i className="bi bi-file-earmark-text"></i>
                  <span>
                    <strong>{machineTitle} · Quotation Proposal</strong>
                    <small>
                      {customerName} · {customerCompany} {enquiryRef ? `· ${enquiryRef}` : ""}
                    </small>
                  </span>
                </div>
                <b className="quote-preview-total">{formattedTotal}</b>
              </div>

              {saveMessage && (
                <div
                  style={{
                    background: "#e8f4ed",
                    color: "#275b3f",
                    padding: "12px 16px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{saveMessage}</span>
                </div>
              )}
              {saveError && (
                <div
                  style={{
                    background: "#fde8e8",
                    color: "#b91c1c",
                    padding: "12px 16px",
                    borderRadius: "4px",
                    marginBottom: "16px",
                    fontSize: "13px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{saveError}</span>
                </div>
              )}

              <div className="rep-quote-actions">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setActiveTab("list")}
                >
                  <i className="bi bi-arrow-left"></i> View All Quotes
                </button>
                <button
                  className="button button-dark"
                  type="submit"
                  disabled={saving}
                >
                  <i className="bi bi-floppy"></i>{" "}
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Quotation"
                    : "Save to Database"}
                </button>
                <a
                  className="button button-lime"
                  href={emailLink}
                  id="quote-email-link"
                >
                  <i className="bi bi-send"></i> Email Quote Draft
                </a>
              </div>
            </section>
          </div>
        </form>
      )}

      <p className="summary-note rep-disclaimer">
        Commercial Quotation Engine connected to live backend database and PDF generator.
      </p>
    </main>
  );
};

export default RepresentativeQuotes;
