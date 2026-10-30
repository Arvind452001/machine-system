import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";

const RepresentativeCustomerDetails = () => {
  const [searchParams] = useSearchParams();
  const customerKey = searchParams.get("customer");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!customerKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .getCustomerDetail(customerKey)
      .then((res) => {
        if (!mounted) return;
        const d = res?.data || res;
        if (d && (d._id || d.enquiryNumber || d.customerDetails || d.name)) {
          const cust = d.customerDetails || {};
          const customerName = cust.name || d.name || "Customer";
          const initials = customerName
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "CU";

          setCustomer({
            key: customerKey,
            enquiryCode: d.enquiryNumber
              ? `${d.enquiryNumber} · ${cust.company || d.company || ""}`.toUpperCase()
              : "ENQUIRY RECORD",
            name: customerName,
            role: cust.jobRole || "Customer Contact",
            company: cust.company || d.company || "Enterprise Customer",
            location: cust.location || cust.city || "Location not specified",
            country: cust.country || "United States",
            territory: "Central territory",
            status: d.status || "Needs first contact",
            avatar: initials,
            email: cust.email || d.email || "—",
            phone: cust.phone || d.phone || "—",
            machineCode: d.machineCode || d.machineSummary?.sku || d.machineSummary?.code || (typeof d.machine === "object" ? d.machine?.sku : "") || "MACHINE",
            machineTitle:
              d.machineName ||
              d.machineSummary?.name ||
              d.machineTitle ||
              (typeof d.machine === "object" ? (d.machine?.name || d.machine?.title) : (typeof d.machine === "string" ? d.machine : "")) ||
              "Configured Machine Platform",
            selectedOptions: (Array.isArray(d.selectedOptions) ? d.selectedOptions : []).filter(Boolean).map((opt) => ({
              name: typeof opt === "string" ? opt : (opt.name || opt.label || "Option"),
              priceDelta: typeof opt === "object" ? Number(opt.priceDelta || 0) : 0,
            })),
            spindle: d.machineSummary?.spindle || "Standard",
            tooling: d.machineSummary?.tooling || "Standard tooling",
            coolant: d.machineSummary?.coolant || "Standard coolant",
            price: d.calculatedTotal
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(d.calculatedTotal)
              : d.machineSummary?.indicativePrice
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(d.machineSummary.indicativePrice)
              : (typeof d.machine === "object" && d.machine?.basePrice)
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(d.machine.basePrice)
              : d.price
              ? String(d.price)
              : "Price upon quotation",
            enquiryId: d.referenceNumber || d.enquiryNumber || d._id || customerKey,
            note: d.customerNotes || d.whatShouldWeKnow || d.projectDetails?.message || d.message || "Customer has not specified special delivery or tooling notes.",
          });
        } else {
          setCustomer(null);
        }
      })
      .catch((err) => {
        console.warn("Failed to load customer details:", err.message);
        if (mounted) setCustomer(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [customerKey]);

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / CUSTOMER CONTACT</span>
      </div>

      <div className="page-crumb rep-crumb">
        <Link to="/representative/customers">
          <i className="bi bi-arrow-left"></i> Customers
        </Link>
        <span>/</span>
        <span>{customer ? customer.name : customerKey || "Not found"}</span>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading customer record from live database..." minHeight="240px" />
      ) : !customer ? (
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
          <h3 style={{ margin: "0 0 12px 0", color: "#111" }}>Customer Record Not Found</h3>
          <p style={{ margin: "0 0 20px 0", color: "#666" }}>
            No customer or enquiry record exists for reference identifier: <strong>{customerKey || "None"}</strong>.
          </p>
          <Link to="/representative/customers" className="button button-dark">
            <i className="bi bi-arrow-left"></i> Back to customer directory
          </Link>
        </section>
      ) : (
        <>
          <section className="rep-record-heading rep-customer-heading">
            <div>
              <div className="eyebrow">
                <span></span> {customer.enquiryCode}
              </div>
              <h2>
                {customer.name} <em>contact.</em>
              </h2>
              <p>
                {customer.role} <span>·</span> {customer.location} <span>·</span> {customer.territory}
              </p>
            </div>
            <span className="status-pill">{customer.status}</span>
          </section>

          <div className="rep-detail-grid rep-customer-detail-grid">
            <section className="rep-section">
              <div className="rep-section-heading">
                <span>01</span>
                <div>
                  <h3>Contact information</h3>
                  <p>
                    Reach the customer to discuss the application and schedule.
                  </p>
                </div>
              </div>

              <div className="rep-customer-card">
                <span className="rep-customer-avatar">{customer.avatar}</span>
                <div>
                  <strong>{customer.name}</strong>
                  <span>
                    {customer.role} · {customer.company}
                  </span>
                </div>
              </div>

              <div className="rep-contact-lines">
                {customer.email !== "—" && (
                  <a href={`mailto:${customer.email}`}>
                    <i className="bi bi-envelope"></i> {customer.email}
                  </a>
                )}
                {customer.phone !== "—" && (
                  <a href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}>
                    <i className="bi bi-telephone"></i> {customer.phone}
                  </a>
                )}
                <span>
                  <i className="bi bi-geo-alt"></i> {customer.location} · {customer.country}
                </span>
              </div>

              <div className="rep-contact-actions">
                {customer.phone !== "—" && (
                  <a
                    className="button button-dark"
                    href={`tel:${customer.phone.replace(/[^0-9+]/g, "")}`}
                  >
                    <i className="bi bi-telephone"></i> Call customer
                  </a>
                )}
                {customer.email !== "—" && (
                  <a className="button button-outline" href={`mailto:${customer.email}`}>
                    <i className="bi bi-envelope"></i> Email customer
                  </a>
                )}
              </div>
            </section>

            <section className="rep-section">
              <div className="rep-section-heading">
                <span>02</span>
                <div>
                  <h3>Requested configuration</h3>
                  <p>
                    Review machine requirements before confirming compatibility.
                  </p>
                </div>
              </div>

              <div className="rep-config-summary">
                <div className="rep-machine-line">
                  <div>
                    <small>{customer.machineCode}</small>
                    <strong>{customer.machineTitle}</strong>
                  </div>
                  <span>Qty 1</span>
                </div>

                {customer.selectedOptions && customer.selectedOptions.length > 0 ? (
                  <div style={{ margin: "10px 0" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#647168", textTransform: "uppercase", marginBottom: "8px" }}>
                      Selected Options ({customer.selectedOptions.length})
                    </div>
                    <div style={{ display: "grid", gap: "5px" }}>
                      {customer.selectedOptions.map((opt, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 8px",
                            background: idx % 2 === 0 ? "#f9faf8" : "#ffffff",
                            border: "1px solid #edf1eb",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <span style={{ fontWeight: 500, color: "#2d3731" }}>{opt.name}</span>
                          <span style={{ fontWeight: 600, color: opt.priceDelta > 0 ? "#1e6b45" : "#718096" }}>
                            {opt.priceDelta > 0 ? `+$${opt.priceDelta.toLocaleString()}` : "Included"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rep-price-total" style={{ marginTop: "12px", borderRadius: "4px" }}>
                      <span>Calculated Total</span>
                      <strong>{customer.price}</strong>
                    </div>
                  </div>
                ) : (
                  <dl>
                    <dd>
                      <div>
                        <dl>
                          <dt>Spindle</dt>
                          <dd>{customer.spindle}</dd>
                        </dl>
                      </div>
                      <div>
                        <dl>
                          <dt>Tooling</dt>
                          <dd>{customer.tooling}</dd>
                        </dl>
                      </div>
                      <div>
                        <dl>
                          <dt>Coolant</dt>
                          <dd>{customer.coolant}</dd>
                        </dl>
                      </div>
                      <div>
                        <dl>
                          <dt>Indicative price</dt>
                          <dd>{customer.price}</dd>
                        </dl>
                      </div>
                    </dd>
                  </dl>
                )}

                <p className="rep-inline-note">{customer.note}</p>
              </div>

              <Link
                className="rep-text-link"
                to={`/representative/quotes?enquiry=${customer.enquiryId}`}
              >
                Continue to quote preparation <i className="bi bi-arrow-right"></i>
              </Link>
            </section>

            <section className="rep-section rep-customer-wide">
              <div className="rep-section-heading">
                <span>03</span>
                <div>
                  <h3>Conversation &amp; custom requirements</h3>
                  <p>
                    Discuss how the machine will be used and capture any custom work.
                  </p>
                </div>
              </div>

              <div className="rep-conversation-placeholder">
                <i className="bi bi-chat-square-text"></i>
                <div>
                  <strong>Customer requirement notes</strong>
                  <span>{customer.note}</span>
                </div>
              </div>

              <div className="rep-requirement-tags">
                <span>Application</span>
                <span>Material &amp; tolerances</span>
                <span>Custom options</span>
                <span>Installation</span>
                <span>Delivery date</span>
              </div>
            </section>
          </div>
        </>
      )}

      <p className="summary-note rep-disclaimer">
        Live database customer details connected for your regional territory.
      </p>
    </main>
  );
};

export default RepresentativeCustomerDetails;
