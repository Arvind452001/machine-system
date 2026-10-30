import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/axiosInstance";
import { showConfirmAlert, showSuccessAlert } from "../utils/alert";

const Basket = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load basket item from query params or localStorage
  const [basketItem, setBasketItem] = useState(() => {
    const qMachine = searchParams.get("machine");
    const qPrice = searchParams.get("price");
    const qSku = searchParams.get("sku");
    const qImage = searchParams.get("image");

    if (qMachine) {
      return {
        name: qMachine,
        sku: qSku || "MD-CONFIG",
        price: Number(qPrice) || 0,
        image: qImage || "",
      };
    }

    try {
      const saved = localStorage.getItem("machine_basket");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const handleClearBasket = async () => {
    const result = await showConfirmAlert(
      "Remove Machine?",
      "Are you sure you want to remove this machine from your basket?",
      "Yes, remove"
    );

    if (result.isConfirmed) {
      localStorage.removeItem("machine_basket");
      setBasketItem(null);
      showSuccessAlert("Removed", "Machine removed from your enquiry basket.");
    }
  };

  const formattedPrice = basketItem
    ? `$${Number(basketItem.price).toLocaleString()}`
    : "$0";

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/machines">
            <i className="bi bi-arrow-left"></i> Continue browsing
          </Link>
          <span>/</span>
          <span>Your basket</span>
        </div>

        <section className="page-heading basket-page-heading">
          <div>
            <div className="eyebrow">
              <span></span> Your machine shortlist
            </div>
            <h1>
              Review your <em> selection.</em>
            </h1>
            <p>
              Check the platform and indicative price before sending your
              enquiry.
            </p>
          </div>
          <span className="page-index">01 / BASKET</span>
        </section>

        {!basketItem ? (
          <div
            style={{
              padding: "64px 20px",
              textAlign: "center",
              color: "#6b7c72",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e1e6e0",
              maxWidth: "800px",
              margin: "20px auto 60px",
            }}
          >
            <i
              className="bi bi-bag-x mb-3 d-block"
              style={{ fontSize: "3rem", color: "#c94f2d" }}
            ></i>
            <h2 style={{ color: "#173f35", marginBottom: "12px" }}>
              Your Basket is Empty
            </h2>
            <p
              style={{
                maxWidth: "460px",
                margin: "0 auto 24px",
                fontSize: "15px",
              }}
            >
              You have not added any machine platforms or custom configurations
              to your enquiry basket yet.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link className="button button-lime" to="/machines">
                Browse Machines <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <Link className="button button-dark" to="/configure">
                Configure a System <i className="bi bi-sliders ms-2"></i>
              </Link>
            </div>
          </div>
        ) : (
          <section className="basket-layout">
            <div className="basket-content">
              <div className="basket-list-heading">
                <span>
                  <i className="bi bi-bag-check"></i> CONFIGURATION SHORTLIST
                </span>
                <span>1 MACHINE</span>
              </div>
              <article className="basket-item basket-item-featured">
                <div className="basket-item-visual">
                  <img
                    src={
                      basketItem.image
                        ? basketItem.image.startsWith("http")
                          ? basketItem.image
                          : `${BASE_URL}${
                              basketItem.image.startsWith("/") ? "" : "/"
                            }${basketItem.image}`
                        : "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={basketItem.name}
                  />
                  <span>{basketItem.sku}</span>
                </div>
                <div className="basket-item-content">
                  <div className="basket-item-heading">
                    <div>
                      <span className="item-code">CONFIGURED PLATFORM</span>
                      <h2>{basketItem.name}</h2>
                      <p className="basket-subtitle">
                        SKU: {basketItem.sku}
                      </p>
                    </div>
                    <strong className="item-price">{formattedPrice}</strong>
                  </div>
                  <p className="basket-description">
                    Custom production system configured for your shop floor
                    requirements.
                  </p>
                  <div className="basket-item-footer">
                    <Link
                      className="text-link"
                      to={`/configure?machine=${encodeURIComponent(
                        basketItem.name
                      )}`}
                    >
                      <i className="bi bi-sliders"></i> Modify options
                    </Link>
                    <button
                      type="button"
                      onClick={handleClearBasket}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#991b1b",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </article>
              <div className="basket-help">
                <span className="basket-help-icon">
                  <i className="bi bi-person-workspace"></i>
                </span>
                <span>
                  <strong>Want to check a detail?</strong>
                  <small>
                    Our regional team can review your process and help refine
                    the specification.
                  </small>
                </span>
                <Link to="/contact" aria-label="Talk to the team">
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>
            <aside className="basket-summary">
              <div className="basket-summary-kicker">
                <i className="bi bi-receipt"></i> ENQUIRY SUMMARY
              </div>
              <h2>
                Your next conversation
                <br />
                starts here.
              </h2>
              <div className="summary-row">
                <span>Machine configurations</span>
                <strong>01</strong>
              </div>
              <div className="summary-row">
                <span>Indicative subtotal</span>
                <strong>{formattedPrice}</strong>
              </div>
              <div className="basket-total">
                <span>Indicative total</span>
                <strong>{formattedPrice}</strong>
                <small>USD before taxes, freight &amp; installation</small>
              </div>
              <p className="summary-note">
                A local representative confirms your options, delivery,
                installation, and final quotation.
              </p>
              <Link
                className="button button-dark"
                to={`/enquiry?machine=${encodeURIComponent(
                  basketItem.name
                )}&price=${basketItem.price}&sku=${encodeURIComponent(
                  basketItem.sku
                )}&machineId=${encodeURIComponent(basketItem.machineId || basketItem._id || "")}`}
                state={{
                  machineId: basketItem.machineId || basketItem._id || "",
                  machineName: basketItem.name,
                  machineCode: basketItem.sku,
                  calculatedTotal: basketItem.price,
                  selectedOptions: basketItem.selectedOptions || [],
                }}
                onClick={() => {
                  try {
                    localStorage.setItem(
                      "machine_configured_enquiry",
                      JSON.stringify({
                        machineId: basketItem.machineId || basketItem._id || "",
                        machineName: basketItem.name,
                        machineCode: basketItem.sku,
                        calculatedTotal: basketItem.price,
                        selectedOptions: basketItem.selectedOptions || [],
                      })
                    );
                  } catch (e) {
                    // ignore
                  }
                }}
              >
                Continue to enquiry <i className="bi bi-arrow-right"></i>
              </Link>
              <Link className="basket-continue" to="/machines">
                <i className="bi bi-arrow-left"></i> Continue browsing
              </Link>
              <div className="basket-summary-foot">
                <i className="bi bi-shield-check"></i> Indicative pricing · Final
                quote by your local team
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
};

export default Basket;
