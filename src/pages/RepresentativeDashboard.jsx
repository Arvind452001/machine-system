import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuth } from "../context/AuthContext";

const RepresentativeDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    assignedCount: "00",
    needsFirstContactCount: "00",
    quotesInProgressCount: "00",
    quotesSentCount: "00",
    winRate: "0%",
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
          const data = res.data || res;
          const m = data.metrics || {};
          setMetrics({
            assignedCount: String(m.assignedEnquiries ?? 9).padStart(2, "0"),
            needsFirstContactCount: String(m.pendingQuotes ?? 1).padStart(2, "0"),
            quotesInProgressCount: String(m.pendingQuotes ?? 1).padStart(2, "0"),
            quotesSentCount: String(m.acceptedQuotes ?? 5).padStart(2, "0"),
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
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (items.length > 0) {
          const mapped = items.map((enq) => {
            const status = enq.status || "Assigned";
            let statusClass = "";
            if (status.toLowerCase().includes("review")) statusClass = "is-review";
            if (status.toLowerCase().includes("quote")) statusClass = "is-quote";
            const dateStr = enq.createdAt
              ? new Date(enq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                }).toUpperCase()
              : "TODAY";

            const custName =
              enq.fullName ||
              enq.customer?.name ||
              `${enq.firstName || ""} ${enq.lastName || ""}`.trim() ||
              "Customer";

            return {
              id: enq._id,
              enquiryNumber: enq.referenceNumber || enq.enquiryNumber || enq._id,
              date: dateStr,
              machine: enq.machineName || enq.machine?.name || "Machinery Unit",
              company: enq.company || enq.customer?.company || "Direct Account",
              contact: custName,
              status,
              statusClass,
            };
          });
          setQueue(mapped);
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
            <span></span> COUNTRY REPRESENTATIVE
          </div>
          <h1>Good day, {repName}.</h1>
          <p>
            Your assigned enquiries, customer conversations, and quotes in progress (GET /api/v1/stats/representative).
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link className="button button-lime" to="/representative/new-enquiry">
            <i className="bi bi-plus-lg"></i> New Customer Enquiry
          </Link>
          <Link className="button button-dark" to="/representative/quotes">
            <i className="bi bi-file-earmark-check"></i> Quotes Hub
          </Link>
        </div>
      </section>

      <section
        aria-label="Representative workload"
        className="customer-metrics rep-metrics"
      >
        <article className="customer-metric">
          <span>ASSIGNED LEADS</span>
          <strong>{metrics.assignedCount}</strong>
          <i className="bi bi-inbox"></i>
        </article>
        <article className="customer-metric">
          <span>PENDING ACTIONS</span>
          <strong>{metrics.needsFirstContactCount}</strong>
          <i className="bi bi-telephone"></i>
        </article>
        <article className="customer-metric">
          <span>ACCEPTED ORDERS</span>
          <strong>{metrics.quotesSentCount}</strong>
          <i className="bi bi-check2-circle"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>WIN RATE</span>
          <strong>{metrics.winRate}</strong>
          <i className="bi bi-graph-up-arrow"></i>
        </article>
      </section>

      <section className="rep-workspace rep-dashboard-workspace">
        <aside className="rep-queue">
          <div className="rep-queue-heading">
            <div>
              <span>YOUR TERRITORY</span>
              <h2>Assigned enquiries ({queue.length})</h2>
            </div>
            <Link className="rep-text-link" to="/representative/enquiries">
              View all <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="rep-queue-list">
            {loading ? (
              <div style={{ padding: "28px", textAlign: "center", color: "#6b7c72", fontSize: "14px" }}>
                Loading assigned queue...
              </div>
            ) : queue.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#6b7c72", fontSize: "14px" }}>
                <i className="bi bi-inbox mb-2 d-block" style={{ fontSize: "1.5rem" }}></i>
                No assigned enquiries in your queue.
              </div>
            ) : (
              queue.map((item) => (
                <Link
                  key={item.enquiryNumber || item.id}
                  className="rep-queue-item"
                  to={`/representative/enquiry-details?id=${item.id || item.enquiryNumber}`}
                >
                  <div className="rep-queue-top">
                    <span className="rep-queue-num">{item.enquiryNumber}</span>
                    <span className="rep-queue-date">{item.date}</span>
                  </div>
                  <strong className="rep-queue-machine">{item.machine}</strong>
                  <span className="rep-queue-company">{item.company}</span>
                  <div className="rep-queue-foot">
                    <span>{item.contact}</span>
                    <span className={`rep-status-tag ${item.statusClass}`}>
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>

        <section className="rep-lead-detail">
          <div className="rep-lead-top">
            <div>
              <span className="rep-kicker">COMMERCIAL ACTIONS</span>
              <h3>Active sales workflows</h3>
            </div>
          </div>
          <div className="p-4">
            <p>
              Directly collaborate with factory engineers, confirm lead times, and issue formal machine proposals for your accounts.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link className="button button-lime" to="/representative/quotes">
                <i className="bi bi-file-earmark-plus"></i> Prepare Quotation
              </Link>
              <Link className="button button-dark" to="/representative/customers">
                <i className="bi bi-people"></i> View Customers &amp; Team
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default RepresentativeDashboard;
