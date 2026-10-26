import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiClient } from "../api/client";
import { BASE_URL } from "../api/axiosInstance";

const EnquiryDetails = () => {
  const [searchParams] = useSearchParams();
  const enquiryId = searchParams.get("id");

  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!enquiryId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient
      .getEnquiry(enquiryId)
      .then((res) => {
        if (isMounted && res?.data) {
          setEnquiry(res.data);
        } else {
          setEnquiry(null);
        }
      })
      .catch((err) => {
        console.warn("Could not load enquiry details:", err.message);
        if (isMounted) setEnquiry(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enquiryId]);

  if (loading) {
    return (
      <main className="customer-content account-hub">
        <div className="page-crumb">
          <Link to="/customer/enquiries">
            <i className="bi bi-arrow-left"></i> My enquiries
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
          <div>Loading enquiry details...</div>
        </div>
      </main>
    );
  }

  if (!enquiry) {
    return (
      <main className="customer-content account-hub">
        <div className="page-crumb">
          <Link to="/customer/enquiries">
            <i className="bi bi-arrow-left"></i> My enquiries
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
            className="bi bi-chat-square-dots mb-3 d-block"
            style={{ fontSize: "2.5rem", color: "#c94f2d" }}
          ></i>
          <h3 style={{ color: "#173f35" }}>Enquiry Not Found</h3>
          <p
            style={{
              color: "#6b7c72",
              margin: "10px auto 24px",
              maxWidth: "460px",
            }}
          >
            The requested machine enquiry could not be found or retrieved from the server.
          </p>
          <Link className="button button-dark" to="/customer/enquiries">
            Back to My Enquiries <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(enquiry.createdAt || Date.now()).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const rawImage =
    enquiry.machine?.images?.[0] ||
    enquiry.machineImage ||
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80";

  const machineImageSrc =
    rawImage.startsWith("http://") || rawImage.startsWith("https://")
      ? rawImage
      : `${BASE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  const machineTitle =
    enquiry.machineName ||
    enquiry.machine?.name ||
    enquiry.machineSummary?.machineTitle ||
    enquiry.machineTitle ||
    "Configured Machine Platform";

  const machineCode =
    enquiry.machineCode ||
    enquiry.machine?.sku ||
    enquiry.machineSummary?.machineCode ||
    "MD-SYS";

  const indicativePrice =
    enquiry.calculatedTotal ??
    enquiry.targetBudget ??
    enquiry.indicativePrice ??
    enquiry.machine?.basePrice ??
    0;

  return (
    <main className="customer-content account-hub">
      <div className="page-crumb">
        <Link to="/customer/enquiries">
          <i className="bi bi-arrow-left"></i> My enquiries
        </Link>
        <span>/</span>
        <span>Enquiry details</span>
      </div>
      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> ENQUIRY {enquiry.enquiryNumber || enquiry.referenceNumber || enquiry._id}
          </div>
          <h1>
            {machineTitle.split("·")[0]} <em> enquiry.</em>
          </h1>
          <p>
            Submitted {formattedDate} · {machineCode}
          </p>
        </div>
        <span className="status-pill">{enquiry.status || "Under Review"}</span>
      </section>

      <div className="account-detail-grid">
        <section className="account-detail-card">
          <div className="account-detail-title">
            <span>01</span>
            <div>
              <h2>Request summary</h2>
              <p>Your selected machine and starting specification.</p>
            </div>
          </div>
          <div className="account-machine-summary">
            <img
              src={machineImageSrc}
              alt={machineTitle}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80";
              }}
            />
            <div>
              <small>{machineCode}</small>
              <h3>{machineTitle.split("·")[0]}</h3>
              <p>{enquiry.message || "Industrial Production Machinery"}</p>
            </div>
          </div>
          <dl className="account-specs">
            <div>
              <dt>Platform</dt>
              <dd>{machineTitle}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{enquiry.company || "Enterprise Customer"}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{enquiry.name || `${enquiry.firstName || ""} ${enquiry.lastName || ""}`.trim() || enquiry.email}</dd>
            </div>
            <div>
              <dt>Reference</dt>
              <dd>{enquiry.enquiryNumber || enquiry.referenceNumber || enquiry._id}</dd>
            </div>
          </dl>
        </section>

        <aside className="account-detail-card account-status-card">
          <div className="account-detail-title">
            <span>02</span>
            <div>
              <h2>What happens next</h2>
              <p>Our regional team will review your requirements.</p>
            </div>
          </div>
          <ol className="account-timeline">
            <li className="done">
              <span>
                <i className="bi bi-check"></i>
              </span>
              <div>
                <strong>Enquiry received</strong>
                <small>{formattedDate}</small>
              </div>
            </li>
            <li className="current">
              <span>2</span>
              <div>
                <strong>Specialist review</strong>
                <small>We are checking your configuration</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Personal follow-up</strong>
                <small>Your local team will be in touch</small>
              </div>
            </li>
          </ol>
          <div className="account-total">
            <span>Indicative starting price</span>
            <strong>${Number(indicativePrice).toLocaleString()}</strong>
          </div>
          <Link className="button button-dark w-100" to="/contact">
            Contact our team <i className="bi bi-arrow-right"></i>
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default EnquiryDetails;
