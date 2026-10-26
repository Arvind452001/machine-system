import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";

const RepresentativeCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    enquiriesApi
      .getAssignedEnquiries()
      .then((res) => {
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        if (mounted) {
          if (items.length > 0) {
            const mapped = items.map((e, idx) => {
              const cust = e.customerDetails || {};
              return {
                key: e._id || e.enquiryNumber || `cust-${idx}`,
                enquiryId: e._id || e.enquiryNumber,
                role: (cust.jobRole || e.role || "CUSTOMER").toUpperCase(),
                name: cust.name || e.name || "Customer",
                company: cust.company || e.company || "Enterprise Customer",
                location: cust.location || cust.country || e.location || "Location not specified",
                enquiry: `${e.machineSummary?.name || e.machineTitle || e.machine || "Configured Machine"} · ${e.enquiryNumber || e._id || ""}`,
                phone: cust.phone || e.phone || "—",
              };
            });
            setCustomers(mapped);
          } else {
            setCustomers([]);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load representative customers:", err.message);
        if (mounted) setCustomers([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="customer-content rep-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / CUSTOMER DIRECTORY</span>
      </div>

      <section className="customer-welcome rep-welcome">
        <div>
          <div className="eyebrow">
            <span></span> YOUR TERRITORY
          </div>
          <h1>Customers.</h1>
          <p>
            Choose a customer to view their details and get in touch.
            {loading ? " (Syncing...)" : ""}
          </p>
        </div>
        <span className="rep-customer-total">
          <i className="bi bi-people"></i> {String(customers.length).padStart(2, "0")} customers
        </span>
      </section>

      <section className="rep-section rep-enquiry-list">
        <div className="rep-section-heading">
          <span>01</span>
          <div>
            <h3>Customer directory</h3>
            <p>
              Assigned customer contacts and their active machine enquiry.
            </p>
          </div>
        </div>

        <div className="rep-enquiry-table-head rep-customer-list-head">
          <span>CUSTOMER / COMPANY</span>
          <span>LOCATION</span>
          <span>ACTIVE ENQUIRY</span>
          <span></span>
        </div>

        {loading ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--muted, #666)" }}>
            Loading live customer directory...
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted, #666)" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No customers found in your territory.</p>
            <small style={{ display: "block", marginTop: "6px" }}>
              Customer records will appear here as new machine enquiries and quotation requests arrive.
            </small>
          </div>
        ) : (
          customers.map((c) => (
            <article
              className="rep-enquiry-row rep-customer-row"
              key={c.key}
            >
              <div>
                <small>{c.role}</small>
                <strong>{c.name}</strong>
                <span>{c.company}</span>
              </div>
              <span>{c.location}</span>
              <span>{c.enquiry}</span>
              <Link
                className="button button-dark"
                to={c.enquiryId ? `/representative/enquiry-details?id=${c.enquiryId}` : `/representative/customer-details?customer=${c.key}`}
              >
                <i className="bi bi-person-lines-fill"></i> View Details
              </Link>
            </article>
          ))
        )}
      </section>

      <p className="summary-note rep-disclaimer">
        Live territory customer directory connected to database records.
      </p>
    </main>
  );
};

export default RepresentativeCustomers;
