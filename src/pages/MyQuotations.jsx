import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { quotesApi } from "../api/quotesApi";
import { showErrorAlert, showSuccessAlert } from "../utils/alert";

const MyQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // GET /api/v1/quotes/my
    quotesApi
      .getMyQuotes()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setQuotations(list);
      })
      .catch((err) => {
        console.warn("Could not load quotations:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr || "Recent";
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleDownloadPdf = async (e, id, quoteNumber) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // GET /api/v1/quotes/{id}/pdf
      await quotesApi.downloadPdf(id, quoteNumber);
      showSuccessAlert("PDF Generated", `Quotation ${quoteNumber}.pdf downloaded.`);
    } catch (err) {
      showErrorAlert("Download Failed", "Could not generate PDF: " + err.message);
    }
  };

  return (
    <main className="customer-content account-hub">
      <div className="page-crumb">
        <Link to="/customer/dashboard">
          <i className="bi bi-arrow-left"></i> My workspace
        </Link>
        <span>/</span>
        <span>My quotations</span>
      </div>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> YOUR PROJECTS
          </div>
          <h1>
            My <em> quotations.</em>
          </h1>
          <p>Review commercial proposals, specifications, and quote validity for your machine orders.</p>
        </div>
      </section>
      <div className="account-notice">
        <i className="bi bi-info-circle"></i>
        <span>
          {loading
            ? "Loading quotations..."
            : "Live quotation proposals from your assigned representative. PDF streaming and status updates enabled."}
        </span>
      </div>
      <section className="account-table">
        <div className="table-head">
          <span>QUOTE / MACHINE</span>
          <span>ISSUED</span>
          <span>STATUS</span>
          <span>COMMERCIAL TOTAL</span>
          <span>ACTIONS</span>
        </div>
        {loading ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#6c7a70" }}>
            Loading quotations...
          </div>
        ) : quotations.length === 0 ? (
          <div style={{ padding: "36px", textAlign: "center", color: "#6c7a70" }}>
            No quotations found in your account.
          </div>
        ) : (
          quotations.map((q) => {
            const qId = q._id || q.id;
            const qNum = q.quoteNumber || qId;
            const machineTitle =
              q.machineName ||
              q.machine?.name ||
              q.machineSummary?.title ||
              q.machineSummary?.name ||
              "Configured Machine Platform";
            const enqRef =
              q.enquiry?.referenceNumber || q.enquiryNumber
                ? ` · Enquiry ${q.enquiry?.referenceNumber || q.enquiryNumber}`
                : "";
            const statusText = q.status || "Ready";
            const totalVal =
              q.pricingBreakdown?.finalTotal ||
              q.pricingBreakdown?.total ||
              q.totalAmount ||
              0;

            return (
              <div className="enquiry-row" key={qNum}>
                <div className="enquiry-name">
                  <strong>{machineTitle}</strong>
                  <small>
                    {qNum}
                    {enqRef}
                  </small>
                </div>
                <span>{formatDate(q.createdAt || q.validUntil)}</span>
                <span
                  className={`status-pill ${
                    statusText.toLowerCase().includes("accept") ? "ready" : ""
                  }`}
                  style={{ textTransform: "capitalize" }}
                >
                  {statusText.replace("_", " ")}
                </span>
                <span>{formatPrice(totalVal)}</span>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={(e) => handleDownloadPdf(e, qId, qNum)}
                    title="Download PDF"
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                  >
                    <i className="bi bi-file-earmark-pdf"></i> PDF
                  </button>
                  <Link
                    className="row-action"
                    to={`/customer/quotation-details?id=${encodeURIComponent(
                      qId || qNum
                    )}`}
                    aria-label={`View ${machineTitle} quotation`}
                  >
                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </section>
      <div className="account-bottom">
        <span className="account-help">
          <i className="bi bi-headset"></i> Want to discuss an estimate?{" "}
          <Link to="/contact">Talk to our team</Link>
        </span>
        <Link className="button button-dark" to="/customer/enquiries">
          View enquiries <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </main>
  );
};

export default MyQuotations;
