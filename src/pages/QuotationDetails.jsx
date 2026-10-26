import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { quotesApi } from "../api/quotesApi";
import { BASE_URL } from "../api/axiosInstance";
import {
  showConfirmAlert,
  showErrorAlert,
  showPromptAlert,
  showSuccessAlert,
} from "../utils/alert";

const QuotationDetails = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("id");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadQuote = () => {
    if (!quoteId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    quotesApi
      .getQuoteById(quoteId)
      .then((res) => {
        const d = res?.data || res;
        if (d && (d._id || d.quoteNumber)) {
          const itemsList = [];
          const baseP =
            d.pricingBreakdown?.basePrice || d.machine?.basePrice || 0;
          const machTitle =
            d.machineName || d.machine?.name || "Machine Platform";

          itemsList.push({
            name: `${machTitle} (Base Configuration)`,
            specification: `Model: ${
              d.machineCode || d.machine?.sku || "MS-SYS"
            }`,
            quantity: 1,
            price: baseP,
          });

          if (Array.isArray(d.options)) {
            d.options.forEach((opt) => {
              itemsList.push({
                name: opt.name || "Configured Module",
                specification: `Code: ${opt.code || "OPT"}`,
                quantity: 1,
                price: opt.priceDelta || 0,
              });
            });
          }

          setQuote({
            _id: d._id || quoteId,
            quoteNumber: d.quoteNumber || quoteId,
            enquiryNumber: d.enquiry?.referenceNumber || d.enquiryNumber || "",
            status: d.status || "sent",
            validity: d.validUntil
              ? `until ${new Date(d.validUntil).toLocaleDateString()}`
              : "30 days",
            currency: d.currency || "USD",
            issuedDate: d.createdAt
              ? new Date(d.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Recent",
            customerDetails: {
              name: d.customerName || d.customer?.name || "Customer",
              company:
                d.customerCompany || d.customer?.company || "Direct Account",
              country: d.customerCountry || d.customer?.country || "Global",
            },
            representativeDetails: {
              name:
                d.representativeName ||
                d.representative?.name ||
                "Sales Engineer",
              team: "Regional Sales & Engineering Division",
            },
            machineSummary: {
              name: machTitle,
              title: machTitle,
              description:
                d.machine?.description ||
                "Precision engineered industrial machinery.",
              imageUrl:
                d.machine?.images?.[0] ||
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
            },
            items: itemsList,
            totalAmount:
              d.pricingBreakdown?.finalTotal || d.totalAmount || baseP,
            termsAndConditions: d.termsAndConditions || "",
          });
        } else {
          setQuote(null);
        }
      })
      .catch((err) => {
        console.warn("Could not load quotation:", err.message);
        setQuote(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuote();
  }, [quoteId]);

  const handleStatusUpdate = async (newStatus) => {
    if (!quote) return;

    let reason = "";
    if (newStatus === "declined") {
      const promptResult = await showPromptAlert(
        "Decline Quotation",
        "Reason for declining quotation (Optional):"
      );
      if (!promptResult.isConfirmed) return;
      reason = promptResult.value || "Customer requested revisions";
    } else {
      const confirmResult = await showConfirmAlert(
        "Accept Quotation?",
        "Are you sure you want to accept this quotation proposal?",
        "Yes, Accept Quotation"
      );
      if (!confirmResult.isConfirmed) return;
    }

    setIsUpdatingStatus(true);
    try {
      await quotesApi.updateStatus(quote._id, {
        status: newStatus,
        rejectionReason: reason,
      });

      setQuote((prev) => ({ ...prev, status: newStatus }));
      showSuccessAlert(
        newStatus === "accepted" ? "Quotation Accepted" : "Quotation Declined",
        newStatus === "accepted"
          ? "Our regional engineering team will contact you to finalize commissioning."
          : "Quotation has been declined."
      );
    } catch (err) {
      showErrorAlert(
        "Status Update Failed",
        err.message || "Failed to update quotation status."
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!quote) return;
    try {
      await quotesApi.downloadPdf(quote._id, quote.quoteNumber);
      showSuccessAlert(
        "PDF Downloaded",
        `Quotation ${quote.quoteNumber}.pdf generated.`
      );
    } catch (err) {
      showErrorAlert(
        "Download Failed",
        "Could not generate PDF: " + err.message
      );
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <main className="customer-content">
        <div className="page-crumb">
          <Link to="/customer/quotations">
            <i className="bi bi-arrow-left"></i> My quotations
          </Link>
          <span>/</span>
          <span>Loading...</span>
        </div>
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            color: "#6b7c72",
          }}
        >
          <div
            className="spinner-border text-secondary mb-3"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem" }}
          ></div>
          <div>Loading quotation details...</div>
        </div>
      </main>
    );
  }

  if (!quote) {
    return (
      <main className="customer-content">
        <div className="page-crumb">
          <Link to="/customer/quotations">
            <i className="bi bi-arrow-left"></i> My quotations
          </Link>
          <span>/</span>
          <span>Not Found</span>
        </div>
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "#fff",
            borderRadius: "12px",
            border: "1px solid #e1e6e0",
            maxWidth: "800px",
            margin: "40px auto",
          }}
        >
          <i
            className="bi bi-file-earmark-x mb-3 d-block"
            style={{ fontSize: "2.5rem", color: "#c94f2d" }}
          ></i>
          <h3 style={{ color: "#173f35" }}>Quotation Not Found</h3>
          <p
            style={{
              color: "#6b7c72",
              margin: "10px auto 24px",
              maxWidth: "460px",
            }}
          >
            The requested commercial quotation could not be retrieved from the
            system.
          </p>
          <Link className="button button-dark" to="/customer/quotations">
            Back to Quotations <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </main>
    );
  }

  const isAccepted = (quote.status || "").toLowerCase().includes("accept");
  const isDeclined = (quote.status || "").toLowerCase().includes("decline");

  return (
    <main className="customer-content">
      <div className="page-crumb">
        <Link to="/customer/quotations">
          <i className="bi bi-arrow-left"></i> My quotations
        </Link>
        <span>/</span>
        <span>{quote.quoteNumber}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className="badge bg-secondary me-2">COMMERCIAL QUOTATION</span>
          <span
            className={`badge ${
              isAccepted
                ? "bg-success"
                : isDeclined
                ? "bg-danger"
                : "bg-primary"
            }`}
            style={{ textTransform: "capitalize" }}
          >
            Status: {quote.status?.replace("_", " ")}
          </span>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleDownloadPdf}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i> Download PDF
          </button>
          {!isAccepted && !isDeclined && (
            <>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => handleStatusUpdate("accepted")}
                disabled={isUpdatingStatus}
              >
                <i className="bi bi-check-circle me-1"></i> Accept Quotation
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleStatusUpdate("declined")}
                disabled={isUpdatingStatus}
              >
                <i className="bi bi-x-circle me-1"></i> Decline
              </button>
            </>
          )}
        </div>
      </div>

      <article className="quote-sheet" id="quote-print-area">
        <div className="quote-sheet-header">
          <Link aria-label="Home" className="quote-brand" to="/">
            <span className="quote-brand-icon">
              <i className="bi bi-asterisk"></i>
            </span>
            <span className="quote-brand-type">
              MACHINE <small>SYSTEMS</small>
            </span>
          </Link>
          <div className="quote-meta">
            <span>OFFICIAL COMMERCIAL PROPOSAL</span>
            <strong>{quote.quoteNumber}</strong>
            <small>
              Validity: {quote.validity} · Currency: {quote.currency}
            </small>
          </div>
        </div>

        <div className="quote-rule"></div>

        <div className="quote-addresses">
          <div>
            <span>PREPARED FOR</span>
            <strong>{quote.customerDetails.name}</strong>
            <p>{quote.customerDetails.company}</p>
            <p className="text-muted">{quote.customerDetails.country}</p>
          </div>
          <div>
            <span>PREPARED BY</span>
            <strong>{quote.representativeDetails.name}</strong>
            <p>{quote.representativeDetails.team}</p>
            <p className="text-muted">MACHINE Systems International</p>
          </div>
          <div>
            <span>REFERENCE DETAILS</span>
            <strong>{quote.issuedDate}</strong>
            <p>
              {quote.enquiryNumber
                ? `Enquiry ref: ${quote.enquiryNumber}`
                : "Commercial direct build"}
            </p>
          </div>
        </div>

        <div className="quote-rule"></div>

        <div className="quote-table-wrap">
          <table className="quote-table">
            <thead>
              <tr>
                <th scope="col">ITEM / SPECIFICATION</th>
                <th scope="col" className="text-center">
                  QTY
                </th>
                <th scope="col" className="text-end">
                  UNIT PRICE
                </th>
                <th scope="col" className="text-end">
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.specification}</small>
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{formatPrice(item.price)}</td>
                  <td className="text-end">
                    {formatPrice(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="quote-summary">
          <div className="quote-notes">
            <span className="quote-notes-kicker">COMMERCIAL TERMS</span>
            <p>
              {quote.termsAndConditions ||
                "Standard terms apply. Payment schedules and delivery milestones confirmed upon quotation acceptance."}
            </p>
          </div>
          <div className="quote-totals">
            <div className="total-row grand-total">
              <span>TOTAL (EXCL. TAX)</span>
              <strong>{formatPrice(quote.totalAmount)}</strong>
            </div>
          </div>
        </div>

        <div className="quote-signature-block">
          <div>
            <span>AUTHORIZED SIGNATURE</span>
            <div className="signature-line">
              <span className="signature-name">
                {quote.representativeDetails.name}
              </span>
            </div>
            <small>Regional Engineering &amp; Commercial Operations</small>
          </div>
          <div>
            <span>CUSTOMER ACCEPTANCE</span>
            <div className="signature-line">
              {isAccepted ? (
                <span className="signature-name text-success">
                  DIGITALLY ACCEPTED
                </span>
              ) : (
                <span className="signature-placeholder text-muted">
                  Pending customer approval
                </span>
              )}
            </div>
            <small>Authorized Company Representative</small>
          </div>
        </div>
      </article>

      <div className="account-bottom mt-4">
        <span className="account-help">
          <i className="bi bi-question-circle"></i> Need changes to this
          proposal? <Link to="/contact">Request specification revision</Link>
        </span>
        <Link className="button button-lime" to="/customer/quotations">
          View all quotations <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </main>
  );
};

export default QuotationDetails;
