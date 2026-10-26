import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../api/client";
import { machinesApi } from "../api/machinesApi";
import { enquiriesApi } from "../api/enquiriesApi";
import { useAuth } from "../context/AuthContext";

const CustomerWorkspace = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState([]);
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [metrics, setMetrics] = useState({
    openEnquiries: 0,
    quotesReady: 0,
    basketItems: 0,
    machinePlatforms: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch real machines from GET /api/v1/machines
    machinesApi
      .getMachines()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        if (isMounted) {
          if (list.length > 0) {
            setMachines(list);
            setMetrics((prev) => ({
              ...prev,
              machinePlatforms: list.length,
            }));
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load machines from API:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingMachines(false);
      });

    // 2. Fetch dashboard data & recent enquiries from /api/v1/enquiries/my
    const fetchDashboardData = async () => {
      try {
        const res = await apiClient.getCustomerDashboard();
        const statData = res?.data || res;
        if (isMounted && statData) {
          setMetrics((prev) => ({
            ...prev,
            openEnquiries: statData.activeEnquiries ?? prev.openEnquiries,
            quotesReady: statData.totalQuotes ?? prev.quotesReady,
            acceptedOrders: statData.acceptedOrders ?? 5,
            machinePlatforms: prev.machinePlatforms,
          }));
        }
      } catch (err) {
        console.warn("Could not load customer dashboard data:", err.message);
      }

      // Also ensure recent enquiries are fetched from /api/v1/enquiries/my
      try {
        const myEnqRes = await enquiriesApi.getMyEnquiries({ limit: 5 });
        const items = Array.isArray(myEnqRes?.data)
          ? myEnqRes.data
          : Array.isArray(myEnqRes)
          ? myEnqRes
          : [];
        if (isMounted && items.length > 0) {
          setRecentEnquiries(items);
          setMetrics((prev) => ({
            ...prev,
            openEnquiries: items.length,
          }));
        }
      } catch (err) {
        console.warn("Could not fetch my enquiries for workspace:", err.message);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    return n < 10 ? `0${n}` : `${n}`;
  };

  return (
    <main className="customer-content">
      <section className="customer-welcome">
        <div>
          <div className="eyebrow">
            <span></span> Customer overview
          </div>
          <h1>
            Your {user?.company || "Northline"} <em> workspace.</em>
          </h1>
          <p>
            Welcome back, {user?.name || "Morgan"}. Pick up where you left off or explore a machine for your next run.
          </p>
        </div>
        <Link className="button button-lime" to="/machines">
          <i className="bi bi-search"></i> Explore machines
        </Link>
      </section>

      <section className="customer-metrics" aria-label="Account summary">
        <article className="customer-metric">
          <span>OPEN ENQUIRIES</span>
          <strong>{formatNumber(metrics.openEnquiries)}</strong>
          <i className="bi bi-chat-square-text"></i>
        </article>
        <article className="customer-metric">
          <span>QUOTES READY</span>
          <strong>{formatNumber(metrics.quotesReady)}</strong>
          <i className="bi bi-file-earmark-check"></i>
        </article>
        <article className="customer-metric">
          <span>BASKET ITEMS</span>
          <strong>{formatNumber(metrics.basketItems)}</strong>
          <i className="bi bi-bag-check"></i>
        </article>
        <article className="customer-metric customer-metric-dark">
          <span>MACHINE PLATFORMS</span>
          <strong>{formatNumber(metrics.machinePlatforms)}</strong>
          <i className="bi bi-gear-wide-connected"></i>
        </article>
      </section>

      <section className="customer-recent-machines">
        <div className="customer-section-heading">
          <div>
            <span className="customer-section-kicker">RECENTLY VIEWED</span>
            <h2>Back to the machines.</h2>
          </div>
          <Link to="/machines">
            View catalogue <i className="bi bi-arrow-up-right"></i>
          </Link>
        </div>
        <div className="customer-machine-grid">
          {machines.length > 0 ? (
            machines.slice(0, 3).map((m) => {
              const img =
                m.images?.[0] ||
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80";
              const tag = `${m.sku || m.slug?.toUpperCase()} · ${(
                m.category || "CNC"
              ).toUpperCase()}`;
              const priceStr = m.basePrice
                ? `From $${Number(m.basePrice).toLocaleString()}`
                : "Price on request";
              const detailTarget = `/machine-details?id=${m.slug || m._id}`;

              return (
                <Link
                  key={m._id || m.slug}
                  className="customer-machine-card"
                  to={detailTarget}
                >
                  <span className="customer-machine-image">
                    <img src={img} alt={m.name} loading="lazy" />
                    <span>{tag}</span>
                  </span>
                  <span className="customer-machine-info">
                    <small>
                      {m.summary || m.category?.toUpperCase() || "INDUSTRIAL PLATFORM"}
                    </small>
                    <strong>{m.name}</strong>
                    <span>
                      {priceStr} <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </span>
                </Link>
              );
            })
          ) : loadingMachines ? (
            <div
              style={{
                padding: "32px",
                textAlign: "center",
                gridColumn: "1 / -1",
                color: "#6b7c72",
              }}
            >
              Loading machine platforms...
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "36px 20px",
                color: "#6b7c72",
                gridColumn: "1 / -1",
                background: "#fff",
                borderRadius: "8px",
                border: "1px dashed #d0d7d2",
              }}
            >
              No machine platforms available in your workspace catalogue.
            </div>
          )}
        </div>
      </section>

      <div className="customer-overview">
        <section className="customer-panel customer-enquiries-panel">
          <div className="customer-panel-heading">
            <h2>Recent enquiries</h2>
            <Link to="/customer/enquiries">
              View all <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div
            className="customer-table-scroll"
            role="region"
            aria-label="Recent enquiries"
            tabIndex={0}
          >
            <table className="customer-enquiries-table">
              <thead>
                <tr>
                  <th scope="col">Machine / reference</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Indicative price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enq) => {
                    const refNum =
                      enq.referenceNumber ||
                      enq.enquiryNumber ||
                      enq._id;
                    const title =
                      enq.machineName ||
                      enq.machine?.name ||
                      enq.machineSummary?.machineTitle ||
                      "Machine Project";
                    const price =
                      enq.calculatedTotal ??
                      enq.targetBudget ??
                      enq.indicativePrice ??
                      0;

                    const isReady =
                      enq.status === "Quote ready" ||
                      enq.status === "quote_ready" ||
                      enq.status === "Ready · 30 days";
                    const detailLink = isReady && enq.quotationNumber
                      ? `/customer/quotation-details?id=${enq.quotationNumber}`
                      : `/customer/enquiry-details?id=${enq._id || refNum}`;

                    return (
                      <tr key={enq._id || refNum}>
                        <td>
                          <strong>{title}</strong>
                          <small>{refNum}</small>
                        </td>
                        <td>{formatDate(enq.createdAt)}</td>
                        <td>
                          <span
                            className={`status-pill ${isReady ? "ready" : ""}`}
                          >
                            {enq.status === "assigned"
                              ? "Under Review"
                              : enq.status}
                          </span>
                        </td>
                        <td>${Number(price).toLocaleString()}</td>
                        <td>
                          <Link className="customer-details-button" to={detailLink}>
                            Details <i className="bi bi-arrow-up-right"></i>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "32px",
                        color: "#6b7c72",
                      }}
                    >
                      No recent enquiries found in your account.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="customer-panel">
          <div className="customer-panel-heading">
            <h2>Quick links</h2>
          </div>
          <div className="customer-quicklinks">
            <Link to="/customer/quotations">
              <i className="bi bi-file-earmark-check"></i> Review latest quotation{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
            <Link to="/configure">
              <i className="bi bi-sliders"></i> Configure a machine{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
            <Link to="/enquiry">
              <i className="bi bi-chat-square-text"></i> Start a new enquiry{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
            <Link to="/contact">
              <i className="bi bi-headset"></i> Contact Northline{" "}
              <i className="bi bi-arrow-up-right"></i>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomerWorkspace;
