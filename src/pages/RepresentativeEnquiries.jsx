import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";

const RepresentativeEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    enquiriesApi
      .getAssignedEnquiries()
      .then((res) => {
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (mounted && items.length > 0) {
          const mapped = items.map((enq) => {
            const status = enq.status || "Needs first contact";
            let statusClass = "";
            if (status.toLowerCase().includes("review")) statusClass = "is-review";
            if (status.toLowerCase().includes("quote")) statusClass = "is-quote";
            const dateStr = enq.createdAt
              ? new Date(enq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            return {
              id: enq.enquiryNumber || enq._id,
              rawId: enq._id,
              type: enq.machineSummary?.type || enq.type || "MACHINERY",
              machine:
                enq.machineSummary?.name ||
                enq.machineTitle ||
                enq.machine ||
                "Custom Configured Machine",
              company:
                enq.customerDetails?.company ||
                enq.company ||
                "—",
              contact:
                enq.customerDetails?.name ||
                enq.name ||
                "—",
              received: dateStr,
              status,
              statusClass,
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


  const totalAssigned = enquiries.length;
  const needsFirstContact = enquiries.filter((e) =>
    e.status.toLowerCase().includes("contact")
  ).length;
  const requirementsReview = enquiries.filter((e) =>
    e.status.toLowerCase().includes("review")
  ).length;
  const quoteInProgress = enquiries.filter((e) =>
    e.status.toLowerCase().includes("quote")
  ).length;

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / ENQUIRY MANAGEMENT</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> YOUR TERRITORY
          </div>
          <h1>Assigned enquiries.</h1>
          <p>
            Review each request, contact the customer, and move it toward a
            final quote.{loading ? " (Updating...)" : ""}
          </p>
        </div>
        <Link className="button button-dark" to="/representative/new-enquiry">
          <i className="bi bi-plus-lg"></i> New customer enquiry
        </Link>
      </section>

      <section
        className="customer-metrics rep-metrics"
        aria-label="Enquiry summary"
      >
        <article className="customer-metric">
          <span>ASSIGNED TO YOU</span>
          <strong>{String(totalAssigned).padStart(2, "0")}</strong>
          <i className="bi bi-inbox"></i>
        </article>
        <article className="customer-metric">
          <span>NEEDS FIRST CONTACT</span>
          <strong>{String(needsFirstContact).padStart(2, "0")}</strong>
          <i className="bi bi-telephone"></i>
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

      <section className="rep-section rep-enquiry-list">
        <div className="rep-section-heading">
          <span>01</span>
          <div>
            <h3>Enquiry queue</h3>
            <p>
              Open a customer record to review configuration and continue the
              discussion.
            </p>
          </div>
        </div>

        <div className="rep-enquiry-table-head">
          <span>ENQUIRY / CUSTOMER</span>
          <span>RECEIVED</span>
          <span>STATUS</span>
          <span></span>
        </div>

        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted, #666)" }}>
            Loading assigned enquiries from live system...
          </div>
        ) : enquiries.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted, #666)" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No enquiries assigned to your account.</p>
            <small style={{ display: "block", marginTop: "6px" }}>
              New customer configuration enquiries and lead submissions will appear here once received.
            </small>
          </div>
        ) : (
          enquiries.map((enq) => (
            <article className="rep-enquiry-row" key={enq.id}>
              <div>
                <small>
                  {enq.id} · {enq.type}
                </small>
                <strong>{enq.machine}</strong>
                <span>
                  {enq.company} · {enq.contact}
                </span>
              </div>
              <span>{enq.received}</span>
              <span className={`rep-status-label ${enq.statusClass}`}>
                {enq.status}
              </span>
              <Link
                className="button button-dark"
                to={`/representative/enquiry-details?id=${enq.rawId || enq.id}`}
              >
                Review <i className="bi bi-arrow-right"></i>
              </Link>
            </article>
          ))
        )}
      </section>

      <p className="summary-note rep-disclaimer">
        Live database enquiries connected for your regional territory.
      </p>
    </main>
  );
};

export default RepresentativeEnquiries;
