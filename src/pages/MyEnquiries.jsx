import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { enquiriesApi } from "../api/enquiriesApi";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_SIZE = 6;

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchEnquiries = async () => {
      try {
        const res = await enquiriesApi.getMyEnquiries();
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (isMounted) {
          const mapped = items.map((enq) => {
            // Reference number
            const refId =
              enq.referenceNumber ||
              enq.enquiryNumber ||
              enq._id ||
              "ENQ-2026";

            // Machine title & code
            const machineTitle =
              enq.machineName ||
              enq.machine?.name ||
              enq.machineSummary?.machineTitle ||
              enq.machineTitle ||
              "Machine Project";

            // Created Date
            const receivedDate = enq.createdAt
              ? new Date(enq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            // Status display text
            const rawStatus = enq.status || "Awaiting contact";
            const formattedStatus =
              rawStatus === "assigned"
                ? "Under Review"
                : rawStatus === "new"
                ? "Awaiting Contact"
                : rawStatus === "quote_ready"
                ? "Quote Ready"
                : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

            // Indicative Price / Total
            const priceVal =
              enq.calculatedTotal ??
              enq.targetBudget ??
              enq.indicativePrice ??
              enq.machine?.basePrice ??
              0;

            const priceFormatted = `$${Number(priceVal).toLocaleString()}`;

            return {
              id: refId,
              rawId: enq._id,
              machine: machineTitle,
              received: receivedDate,
              status: formattedStatus,
              price: priceFormatted,
            };
          });

          setEnquiries(mapped);
        }
      } catch (err) {
        console.warn("Could not load my enquiries from API:", err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEnquiries();
    return () => {
      isMounted = false;
    };
  }, []);



  return (
    <main className="customer-content account-hub">
      <div className="page-crumb">
        <Link to="/customer/dashboard">
          <i className="bi bi-arrow-left"></i> My workspace
        </Link>
        <span>/</span>
        <span>My enquiries</span>
      </div>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> YOUR PROJECTS
          </div>
          <h1>
            My <em> enquiries.</em>
          </h1>
          <p>
            Follow every machine request from first review to final quotation.
          </p>
        </div>
        <Link className="button button-dark" to="/machines">
          Explore machines <i className="bi bi-arrow-right"></i>
        </Link>
      </section>

      <section className="account-table">
        <div className="table-head">
          <span>REFERENCE / MACHINE</span>
          <span>DATE</span>
          <span>STATUS</span>
          <span>INDICATIVE PRICE</span>
          <span></span>
        </div>
        {loading ? (
          <LoadingSpinner text="Loading enquiries from live database..." />
        ) : enquiries.length === 0 ? (
          <div style={{ padding: "36px 20px", textAlign: "center", color: "#6c7a70" }}>
            No enquiries found in your account.
          </div>
        ) : (
          <>
            {enquiries
              .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
              .map((enq) => {
                const isReady =
                  enq.status === "Quote ready" || enq.status === "Ready · 30 days";

                return (
                  <div className="enquiry-row" key={enq.id}>
                    <div className="enquiry-name">
                      <strong>{enq.machine}</strong>
                      <small>{enq.id}</small>
                    </div>
                    <span>{enq.received}</span>
                    <span className={`status-pill ${isReady ? "ready" : ""}`}>
                      {enq.status}
                    </span>
                    <span>{enq.price}</span>
                    <Link
                      className="row-action"
                      to={`/customer/enquiry-details?id=${enq.rawId || enq.id}`}
                      aria-label={`View ${enq.machine} enquiry`}
                    >
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                );
              })}
            <Pagination
              currentPage={currentPage}
              totalItems={enquiries.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
              itemName="enquiries"
            />
          </>
        )}
      </section>


      <div className="account-bottom">
        <span className="account-help">
          <i className="bi bi-headset"></i> Questions about a request?{" "}
          <Link to="/contact">Contact our team</Link>
        </span>
        {/* <Link className="button button-lime" to="/enquiry">
          Start an enquiry <i className="bi bi-arrow-right"></i>
        </Link> */}
      </div>
    </main>
  );
};

export default MyEnquiries;
