import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { quotesApi } from "../api/quotesApi";
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from "../utils/alert";
import LoadingSpinner from "../components/LoadingSpinner";

const getStatusBadgeStyle = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("quote") || s.includes("prep")) {
    return { background: "#ede9fe", color: "#6d28d9", border: "1px solid #ddd6fe" };
  }
  if (s.includes("review")) {
    return { background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
  }
  if (s.includes("won") || s.includes("order") || s.includes("accept")) {
    return { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
  }
  if (s.includes("decline") || s.includes("reject")) {
    return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" };
  }
  // ready / sent / default
  return { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
};

const RepresentativeQuoteDetails = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("id");
  const navigate = useNavigate();

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!quoteId) {
      setLoading(false);
      return;
    }

    quotesApi
      .getQuoteById(quoteId)
      .then((res) => {
        const d = res?.data?.data || res?.data || res;
        setQuote(d);
      })
      .catch((err) => {
        console.warn("Failed to load quote details:", err.message);
        showErrorAlert("Not Found", "Could not load quote details from database.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [quoteId]);

  const handleDownloadPdf = async () => {
    if (!quote) return;
    setDownloadingPdf(true);
    try {
      const qNum = quote.quoteNumber || `QUO-${quote._id?.slice(-6)}`;
      await quotesApi.downloadPdf(quote._id || quoteId, qNum);
      showSuccessAlert("PDF Generated", `Quotation PDF ${qNum}.pdf downloaded successfully.`);
    } catch (err) {
      showErrorAlert("Download Failed", err.message || "Could not generate quotation PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quote) return;
    const confirmed = await showConfirmAlert(
      "Delete Quotation",
      "Are you sure you want to permanently delete this quotation from the database? This cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await quotesApi.deleteQuote(quote._id || quoteId);
      showSuccessAlert("Deleted", "Quotation has been successfully deleted from database.");
      navigate("/representative/quotes");
    } catch (err) {
      showErrorAlert("Delete Failed", err.message || "Failed to delete quotation.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="customer-content rep-content">
        <LoadingSpinner text="Loading commercial quotation document..." minHeight="300px" size="2.5rem" />
      </main>
    );
  }

  if (!quote) {
    return (
      <main className="customer-content rep-content">
        <div style={{ padding: "64px 24px", textAlign: "center" }}>
          <i className="bi bi-file-earmark-x" style={{ fontSize: "3rem", color: "#cbd5e1" }}></i>
          <h2 style={{ fontSize: "20px", marginTop: "12px", color: "#0f172a" }}>Quotation Not Found</h2>
          <p style={{ color: "#64748b", marginTop: "6px" }}>The requested quotation does not exist or was removed.</p>
          <Link className="button button-dark" to="/representative/quotes" style={{ marginTop: "16px", textDecoration: "none" }}>
            <i className="bi bi-arrow-left me-1"></i> Back to Quotes Hub
          </Link>
        </div>
      </main>
    );
  }

  const quoteRef = quote.quoteNumber || `QUO-${(quote._id || quoteId).slice(-6).toUpperCase()}`;
  const basePrice = Number(quote.basePrice || quote.pricingBreakdown?.basePrice || 0);
  const options = Array.isArray(quote.options) ? quote.options : [];
  const optionsTotal = options.reduce((sum, opt) => sum + (Number(opt.price || opt.priceDelta || 0)), 0);
  const shippingFee = Number(quote.shippingFee || quote.deliveryPrice || 0);
  const installationFee = Number(quote.installationFee || 0);
  const discount = Number(quote.discount || 0);
  const calculatedTotal =
    Number(quote.totalAmount || quote.pricingBreakdown?.finalTotal) ||
    (basePrice + optionsTotal + shippingFee + installationFee - discount);

  const formattedDate = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

  return (
    <main className="customer-content rep-content">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="rep-page-topline" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>
          <Link to="/representative/quotes" style={{ color: "#0f766e", textDecoration: "none" }}>
            QUOTATIONS
          </Link>{" "}
          / {quoteRef}
        </span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="button button-outline"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i>
            {downloadingPdf ? "Generating..." : "Download PDF"}
          </button>
          <button
            type="button"
            className="button button-outline"
            onClick={() => window.print()}
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            <i className="bi bi-printer me-1"></i> Print
          </button>
          <Link
            className="button button-lime"
            to={`/representative/quotes?edit=${quote._id || quoteId}`}
            style={{ fontSize: "12px", padding: "6px 14px", textDecoration: "none" }}
          >
            <i className="bi bi-pencil me-1"></i> Update Quote
          </Link>
          <button
            type="button"
            className="button button-outline"
            onClick={handleDeleteQuote}
            disabled={deleting}
            style={{ fontSize: "12px", padding: "6px 14px", color: "#dc2626", borderColor: "#fecaca" }}
          >
            <i className="bi bi-trash me-1"></i> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Main Quote Document Card */}
      <div className="rep-quote-doc-card">
        {/* Document Header Banner */}
        <div className="rep-quote-doc-header">
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>
              COMMERCIAL PROPOSAL & SPECIFICATION
            </span>
            <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "6px 0 0", color: "#ffffff" }}>
              {quote.machineName || "Industrial Machine"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
              <span className="rep-ref-pill" style={{ background: "#ffffff20", color: "#ffffff", borderColor: "#ffffff40" }}>
                {quoteRef}
              </span>
              {quote.machineCode && (
                <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                  SKU: <strong>{quote.machineCode}</strong>
                </span>
              )}
              {quote.enquiryId && (
                <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
                  Ref Enquiry: <strong>{quote.enquiryNumber || quote.enquiryId}</strong>
                </span>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              className="rep-status-pill-clean"
              style={{ ...getStatusBadgeStyle(quote.status), fontSize: "12px", padding: "5px 14px" }}
            >
              {quote.status || "in_preparation"}
            </span>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "8px" }}>
              Issued: <strong>{formattedDate}</strong>
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "2px" }}>
              Validity: <strong>{quote.validDays || 30} Days</strong>
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div className="rep-quote-doc-body">
          {/* Parties Grid (Issuer and Client) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid #e2e8f0" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                CUSTOMER / CLIENT
              </span>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "6px 0 2px" }}>
                {quote.customerName || "Customer Account"}
              </h3>
              <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                <div><strong>Company:</strong> {quote.customerCompany || "Direct Client"}</div>
                {quote.customerEmail && <div><strong>Email:</strong> {quote.customerEmail}</div>}
                {quote.customerCountry && <div><strong>Country:</strong> {quote.customerCountry}</div>}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                ISSUING REPRESENTATIVE
              </span>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: "6px 0 2px" }}>
                MACHINE Systems Regional Sales
              </h3>
              <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                <div><strong>Division:</strong> Commercial Precision Machinery</div>
                <div><strong>Portal:</strong> Authorized Representative Channel</div>
                <div><strong>Support:</strong> sales@machinesystems.com</div>
              </div>
            </div>
          </div>

          {/* Machine & Specifications Table */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>
              Configured Machine Platform & Components
            </h3>
            <table className="rep-data-table" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Item Description</th>
                  <th style={{ width: "20%" }}>Item Code / SKU</th>
                  <th style={{ width: "20%", textAlign: "right" }}>Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>{quote.machineName || "Machine Base Platform"}</strong>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Standard factory tooling, base chassis, and electronic controller</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#475569" }}>{quote.machineCode || "FW-BASE-01"}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#0f172a" }}>
                    ${basePrice.toLocaleString()}
                  </td>
                </tr>

                {options.map((opt, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ fontSize: "13px", color: "#334155" }}>{opt.name || `Custom Module ${idx + 1}`}</strong>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Configured factory option</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>
                        {opt.code || `OPT-${String(idx + 1).padStart(2, "0")}`}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#0f172a" }}>
                      +${Number(opt.price || opt.priceDelta || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown Table */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {/* Terms and Notes on Left */}
            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 700, color: "#0f172a", textTransform: "uppercase" }}>
                Commercial Terms & Conditions
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                {quote.termsAndConditions ||
                  "Payment terms: 30% advance with order, 60% before dispatch, 10% after commissioning. Warranty: 24 months parts & labor."}
              </p>
            </div>

            {/* Price Calculations on Right */}
            <div style={{ background: "#ffffff", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px dashed #e2e8f0" }}>
                <span style={{ color: "#64748b" }}>Base Platform Price</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>${basePrice.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px dashed #e2e8f0" }}>
                <span style={{ color: "#64748b" }}>Selected Options ({options.length})</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>+${optionsTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px dashed #e2e8f0" }}>
                <span style={{ color: "#64748b" }}>Freight & Logistics (Shipping)</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>+${shippingFee.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px dashed #e2e8f0" }}>
                <span style={{ color: "#64748b" }}>Site Commissioning & Installation</span>
                <span style={{ fontWeight: 600, color: "#0f172a" }}>+${installationFee.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "13px", borderBottom: "1px dashed #e2e8f0", color: "#16a34a" }}>
                  <span>Commercial Discount Applied</span>
                  <span style={{ fontWeight: 600 }}>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: "10px", borderTop: "2px solid #0f172a", fontSize: "18px" }}>
                <strong style={{ color: "#0f172a" }}>Net Quotation Total:</strong>
                <strong style={{ color: "#166534" }}>${calculatedTotal.toLocaleString()} USD</strong>
              </div>
            </div>
          </div>

          {/* Action Row at Bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid #e2e8f0", flexWrap: "wrap", gap: "12px" }}>
            <Link className="button button-outline" to="/representative/quotes" style={{ textDecoration: "none" }}>
              <i className="bi bi-arrow-left me-1"></i> Back to Quotes Hub
            </Link>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="button button-dark" onClick={handleDownloadPdf} disabled={downloadingPdf}>
                <i className="bi bi-file-earmark-pdf me-1"></i> Download PDF
              </button>
              <Link className="button button-lime" to={`/representative/quotes?edit=${quote._id || quoteId}`} style={{ textDecoration: "none" }}>
                <i className="bi bi-pencil me-1"></i> Edit This Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RepresentativeQuoteDetails;
