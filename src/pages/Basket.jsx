import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../api/axiosInstance";
import { useBasket } from "../context/BasketContext";
import { useAuth } from "../context/AuthContext";
import { enquiriesApi } from "../api/enquiriesApi";
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "../utils/alert";

// Helper to resolve machine images
const resolveImageUrl = (img) => {
  if (!img || img === "string") {
    return "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
  }
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  const cleanBase = (BASE_URL || "https://node.aitechnotech.in/machine").replace(
    /\/+$/,
    ""
  );
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  return `${cleanBase}${cleanPath}`;
};

const Basket = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestSectionRef = useRef(null);

  const {
    basket,
    addToBasket,
    updateQuantity,
    removeFromBasket,
    clearBasket,
    getBasketCount,
    getBasketSubtotal,
  } = useBasket();

  const { user, isAuthenticated } = useAuth();

  // Backward compatibility: If URL has query params (e.g. ?machine=...&price=...), handle auto-adding
  useEffect(() => {
    const qMachine = searchParams.get("machine");
    const qPrice = searchParams.get("price");
    const qSku = searchParams.get("sku");
    const qImage = searchParams.get("image");
    const qId = searchParams.get("machineId") || searchParams.get("id");

    if (qMachine) {
      // Check if already in basket
      const alreadyPresent = basket.some(
        (b) => b.name === qMachine || (qId && b.machineId === qId)
      );

      if (!alreadyPresent) {
        addToBasket({
          _id: qId || `q_${Date.now()}`,
          name: qMachine,
          sku: qSku || "MD-SYS",
          basePrice: Number(qPrice) || 0,
          image: qImage || "",
        });
      }
    }
  }, [searchParams, basket, addToBasket]);

  // Customer submission form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || (user?.name ? user.name.split(" ")[0] : ""),
    lastName: user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : ""),
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || "",
    country: user?.region || user?.country || "United States",
    whenToInstall: "Within 1-3 months",
    whatShouldWeKnow: "",
    contactConsent: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Sync logged in user profile details
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || (user.name ? user.name.split(" ")[0] : ""),
        lastName: prev.lastName || user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""),
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        company: prev.company || user.company || "",
        country: prev.country || user.country || user.region || "United States",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleClearBasket = async () => {
    const result = await showConfirmAlert(
      "Clear Entire Basket?",
      "Are you sure you want to remove all machines from your enquiry basket?",
      "Yes, clear basket"
    );

    if (result.isConfirmed) {
      clearBasket();
      showSuccessAlert("Basket Cleared", "All machines have been removed from your basket.");
    }
  };

  const handleRemoveItem = async (itemId, itemName) => {
    const result = await showConfirmAlert(
      "Remove Machine?",
      `Remove ${itemName || "this machine"} from your basket?`,
      "Yes, remove"
    );

    if (result.isConfirmed) {
      removeFromBasket(itemId);
      showSuccessAlert("Removed", `${itemName || "Machine"} removed from your basket.`);
    }
  };

  const handleQuantityDelta = (item, delta) => {
    const currentQty = item.quantity || 1;
    const targetQty = currentQty + delta;

    if (targetQty <= 0) {
      handleRemoveItem(item.id, item.name);
    } else {
      updateQuantity(item.id, targetQty);
    }
  };

  const scrollToRequestForm = () => {
    setShowRequestForm(true);
    setTimeout(() => {
      if (requestSectionRef.current) {
        requestSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required.";
    if (!formData.company.trim()) errors.company = "Company name is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";
    if (!formData.contactConsent) {
      errors.contactConsent = "You must accept the contact terms to proceed.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Submit the final request from the basket
   */
  const handleSubmitRequest = async (e) => {
    if (e) e.preventDefault();

    if (basket.length === 0) {
      showErrorAlert("Basket is Empty", "Please add at least one machine before submitting your request.");
      return;
    }

    if (!isAuthenticated) {
      showErrorAlert(
        "Sign-In Required",
        "Please sign in or create an account to submit your request so your local representative can follow up and track it in your customer portal."
      );
      navigate("/login", { state: { from: "/basket" } });
      return;
    }

    if (!validateForm()) {
      showErrorAlert("Missing Information", "Please fill in all required customer fields before submitting.");
      scrollToRequestForm();
      return;
    }

    setIsSubmitting(true);

    try {
      // Build submission payloads for each machine item in the basket
      const submissionPromises = basket.map((item, idx) => {
        const itemQty = item.quantity || 1;
        const lineTotal = (item.price || 0) * itemQty;
        const configLabel = item.isConfigured ? "Custom Configuration" : "Default Configuration";

        const optionsText =
          Array.isArray(item.selectedOptions) && item.selectedOptions.length > 0
            ? item.selectedOptions.map((o) => `${o.name} (+$${o.priceDelta})`).join(", ")
            : "Factory standard options";

        const enquiryPayload = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          country: formData.country,
          whenToInstall: formData.whenToInstall || "Within 1-3 months",
          whatShouldWeKnow: `${formData.whatShouldWeKnow ? formData.whatShouldWeKnow + "\n\n" : ""}Basket Request (Item ${idx + 1} of ${basket.length}): ${item.name} · SKU: ${item.sku} · Qty: ${itemQty} · Config: ${configLabel} · Selected Modules: ${optionsText}`,
          machineCode: item.sku || "MD-SYS",
          machineName: item.name || "Machine Platform",
          machineId: item.machineId || "6ad9fc28e39daefd54e568ff",
          calculatedTotal: lineTotal,
          selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
          contactConsent: Boolean(formData.contactConsent),

          // Backward compatibility fields
          name: `${formData.firstName} ${formData.lastName}`.trim() || formData.email,
          timeline: formData.whenToInstall || "Within 1-3 months",
          message: `${formData.whatShouldWeKnow ? formData.whatShouldWeKnow + " | " : ""}${item.name} (${configLabel}) x${itemQty}`,
          machine: item.name,
          machineTitle: `${item.name} · ${item.sku}`,
          quantity: itemQty,
          indicativePrice: lineTotal,
        };

        return enquiriesApi.createEnquiry(enquiryPayload);
      });

      const responses = await Promise.all(submissionPromises);

      const refNumbers = responses
        .map((r) => r?.data?.enquiryNumber || r?.data?.referenceNumber)
        .filter(Boolean);

      const refText =
        refNumbers.length > 0
          ? `Reference: ${refNumbers.join(", ")}`
          : "Your request has been registered.";

      await showSuccessAlert(
        "Request Submitted Successfully!",
        `We have received your configuration request for ${basket.length} machine platform${basket.length > 1 ? "s" : ""}. ${refText} A machine specialist will review your build.`
      );

      // Clear basket after successful submission
      clearBasket();

      // Navigate to customer enquiries portal
      navigate("/customer/enquiries");
    } catch (err) {
      console.error("Submission failed:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit your request. Please check your network and try again.";
      showErrorAlert("Submission Failed", errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCount = getBasketCount();
  const subtotal = getBasketSubtotal();
  const formattedSubtotal = `$${subtotal.toLocaleString()}`;

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/machines">
            <i className="bi bi-arrow-left"></i> Continue browsing machines
          </Link>
          <span>/</span>
          <span>Your basket &amp; configuration</span>
        </div>

        <section className="page-heading basket-page-heading">
          <div>
            <div className="eyebrow">
              <span></span> Step 4 · Review your selection
            </div>
            <h1>
              Your machine <em> basket.</em>
            </h1>
            <p>
              Review added platforms, customize individual configurations, and submit your formal request for review.
            </p>
          </div>
          <span className="page-index">
            {totalCount < 10 ? `0${totalCount}` : totalCount} {totalCount === 1 ? "MACHINE" : "MACHINES"}
          </span>
        </section>

        {/* 5-Step Progress Bar */}
        <div className="stepper" style={{ marginBottom: "24px" }} aria-label="Order Process Progress">
          <Link to="/machines" style={{ textDecoration: "none" }}>
            <span>
              <b>01</b> Select
            </span>
          </Link>
          <i></i>
          <span className="active">
            <b>02</b> Basket
          </span>
          <i></i>
          <span>
            <b>03</b> Configure
          </span>
          <i></i>
          <span className={showRequestForm ? "active" : ""}>
            <b>04</b> Review &amp; Submit
          </span>
        </div>

        {basket.length === 0 ? (
          <div
            style={{
              padding: "70px 20px",
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
              style={{ fontSize: "3.5rem", color: "#c94f2d" }}
            ></i>
            <h2 style={{ color: "#173f35", marginBottom: "12px", fontSize: "24px" }}>
              Your Basket is Empty
            </h2>
            <p
              style={{
                maxWidth: "460px",
                margin: "0 auto 24px",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              You haven't added any machines to your shortlist yet. Choose a machine from the catalogue to add it with default configuration, then customize it right from here.
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
                Explore Machine Catalogue <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        ) : (
          <section className="basket-layout">
            <div className="basket-content">
              {/* Basket list header */}
              <div className="basket-list-heading">
                <span>
                  <i className="bi bi-bag-check"></i> CONFIGURATION SHORTLIST
                </span>
                <span>
                  {basket.length} {basket.length === 1 ? "PLATFORM" : "PLATFORMS"} · {totalCount} {totalCount === 1 ? "UNIT" : "UNITS"}
                </span>
              </div>

              {/* List of machines in basket */}
              <div style={{ display: "grid", gap: "20px", marginBottom: "30px" }}>
                {basket.map((item) => {
                  const itemImg = resolveImageUrl(item.image);
                  const itemTotal = (item.price || 0) * (item.quantity || 1);
                  const isConfigured = item.isConfigured;

                  return (
                    <article
                      key={item.id}
                      className="basket-item basket-item-featured"
                      style={{
                        position: "relative",
                        borderColor: isConfigured ? "#bcd6c6" : "#e0e6df",
                      }}
                    >
                      <div className="basket-item-visual">
                        <img
                          src={itemImg}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />
                        <span>{item.sku}</span>
                      </div>

                      <div className="basket-item-content">
                        <div className="basket-item-heading">
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span className="item-code">
                                {(item.category || "INDUSTRIAL").toUpperCase()} PLATFORM
                              </span>
                              {isConfigured ? (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "3px 8px",
                                    borderRadius: "12px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    background: "#def7ec",
                                    color: "#03543f",
                                    border: "1px solid #84e1bc",
                                  }}
                                >
                                  <i className="bi bi-gear-fill"></i> Custom Configured
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "3px 8px",
                                    borderRadius: "12px",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    background: "#f3f4f6",
                                    color: "#374151",
                                    border: "1px solid #d1d5db",
                                  }}
                                >
                                  <i className="bi bi-cpu"></i> Default Configuration
                                </span>
                              )}
                            </div>
                            <h2 style={{ marginTop: "6px" }}>{item.name}</h2>
                            <p className="basket-subtitle">
                              SKU: {item.sku} · Platform Base: ${Number(item.basePrice || 0).toLocaleString()}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <strong className="item-price" style={{ display: "block" }}>
                              ${itemTotal.toLocaleString()}
                            </strong>
                            {item.quantity > 1 && (
                              <small style={{ color: "#718076", fontSize: "11px" }}>
                                (${Number(item.price).toLocaleString()} each)
                              </small>
                            )}
                          </div>
                        </div>

                        {/* Selected configuration specifications preview */}
                        <div style={{ margin: "14px 0", padding: "10px 12px", background: "#f8faf8", border: "1px solid #e7ebe6", borderRadius: "6px" }}>
                          <div style={{ fontSize: "11px", fontWeight: 600, color: "#4b5950", marginBottom: "6px", display: "flex", justifyContent: "space-between" }}>
                            <span>Active Specifications:</span>
                            <span style={{ fontWeight: 400, color: "#6b7c72" }}>
                              {isConfigured ? `${item.selectedOptions?.length || 0} modular packages` : "Standard specifications"}
                            </span>
                          </div>

                          {isConfigured && item.selectedOptions && item.selectedOptions.length > 0 ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {item.selectedOptions.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    background: "#ffffff",
                                    padding: "3px 8px",
                                    borderRadius: "4px",
                                    border: "1px solid #dbe2dc",
                                    fontSize: "10px",
                                    color: "#27362c",
                                  }}
                                >
                                  <i className="bi bi-check2 text-success"></i>
                                  {opt.name}
                                  {Number(opt.priceDelta) > 0 && (
                                    <strong style={{ color: "#bd4c2e", marginLeft: "2px" }}>
                                      (+${Number(opt.priceDelta).toLocaleString()})
                                    </strong>
                                  )}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p style={{ margin: 0, fontSize: "11px", color: "#6e7a71" }}>
                              Equipped with factory default options. Click <strong>Configure Machine</strong> to customize spindle, tooling magazines, coolant, and automation.
                            </p>
                          )}
                        </div>

                        {/* Card footer: Quantity adjuster and Action buttons */}
                        <div className="basket-item-footer" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "12px" }}>
                          {/* Quantity control */}
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f3f5f2", padding: "4px 8px", borderRadius: "6px", border: "1px solid #d9e0d8" }}>
                            <span style={{ fontSize: "11px", color: "#5d6b60", fontWeight: 600, marginRight: "4px" }}>
                              Qty:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityDelta(item, -1)}
                              aria-label="Decrease quantity"
                              style={{
                                width: "24px",
                                height: "24px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#fff",
                                border: "1px solid #c8d1c7",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#222",
                              }}
                            >
                              -
                            </button>
                            <span style={{ minWidth: "22px", textAlign: "center", fontWeight: 600, fontSize: "12px", color: "#173f35" }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityDelta(item, 1)}
                              aria-label="Increase quantity"
                              style={{
                                width: "24px",
                                height: "24px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#fff",
                                border: "1px solid #c8d1c7",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#222",
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Action links */}
                          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <Link
                              className="text-link"
                              to={`/configure?machine=${item.machineSlug || item.machineId}&basketItemId=${item.id}`}
                              style={{
                                fontWeight: 600,
                                fontSize: "12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i className="bi bi-sliders"></i>
                              {isConfigured ? "Edit Configuration" : "Configure Machine"}
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#991b1b",
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "4px 6px",
                              }}
                            >
                              <i className="bi bi-trash"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Customer Request Details Submission Section */}
              <div
                ref={requestSectionRef}
                id="request-submission-section"
                style={{
                  background: "#ffffff",
                  border: "1px solid #dce2db",
                  borderRadius: "12px",
                  padding: "26px",
                  boxShadow: "0 8px 24px #1b26200a",
                  marginBottom: "30px",
                }}
              >
                <div style={{ borderBottom: "1px solid #e5ebe4", paddingBottom: "16px", marginBottom: "20px" }}>
                  <div className="eyebrow" style={{ marginBottom: "6px" }}>
                    <span></span> Step 5 · Request Submission
                  </div>
                  <h2 style={{ fontSize: "22px", margin: "0 0 6px", color: "#173f35" }}>
                    Submit Machine Configuration Request
                  </h2>
                  <p style={{ margin: 0, color: "#6b7c72", fontSize: "13px" }}>
                    Complete your customer details below. Your configured specifications will be delivered to your local regional specialist for review.
                  </p>
                </div>

                {!isAuthenticated && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                      color: "#92400e",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <i className="bi bi-person-lock" style={{ fontSize: "20px", color: "#d97706" }}></i>
                      <div style={{ fontSize: "13px" }}>
                        <strong>Sign-In Recommended:</strong> Please sign in to submit your enquiry so you can track it in your customer portal.
                      </div>
                    </div>
                    <Link
                      to="/login"
                      state={{ from: "/basket" }}
                      className="button button-dark"
                      style={{ padding: "6px 14px", fontSize: "11px" }}
                    >
                      Sign In Now
                    </Link>
                  </div>
                )}

                <form onSubmit={handleSubmitRequest} noValidate>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-first-name">
                        First Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="basket-first-name"
                        name="firstName"
                        className={`form-control ${formErrors.firstName ? "is-invalid" : ""}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Morgan"
                        required
                      />
                      {formErrors.firstName && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.firstName}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-last-name">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="basket-last-name"
                        name="lastName"
                        className={`form-control ${formErrors.lastName ? "is-invalid" : ""}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Vance"
                        required
                      />
                      {formErrors.lastName && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.lastName}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-email">
                        Work Email <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        id="basket-email"
                        name="email"
                        className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="morgan@enterprise.com"
                        required
                      />
                      {formErrors.email && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.email}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-phone">
                        Phone Number <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        id="basket-phone"
                        name="phone"
                        className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 019-2834"
                        required
                      />
                      {formErrors.phone && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.phone}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-company">
                        Company Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="basket-company"
                        name="company"
                        className={`form-control ${formErrors.company ? "is-invalid" : ""}`}
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Precision Machining Corp."
                        required
                      />
                      {formErrors.company && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.company}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="basket-country">
                        Country / Facility Location <span className="required">*</span>
                      </label>
                      <select
                        id="basket-country"
                        name="country"
                        className="form-select"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="basket-when-to-install">
                        Expected Deployment / Installation Timeline
                      </label>
                      <select
                        id="basket-when-to-install"
                        name="whenToInstall"
                        className="form-select"
                        value={formData.whenToInstall}
                        onChange={handleInputChange}
                      >
                        <option value="Immediate (within 30 days)">Immediate (within 30 days)</option>
                        <option value="Within 1-3 months">Within 1–3 months</option>
                        <option value="Within 3-6 months">Within 3–6 months</option>
                        <option value="6+ months (Planning phase)">6+ months (Planning phase)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="basket-project-notes">
                        Application Notes &amp; Specifications
                      </label>
                      <textarea
                        id="basket-project-notes"
                        name="whatShouldWeKnow"
                        className="form-control"
                        rows="3"
                        value={formData.whatShouldWeKnow}
                        onChange={handleInputChange}
                        placeholder="Tell us about your target materials, tolerances, volume requirements, or facility constraints."
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="consent-row" htmlFor="basket-consent" style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          id="basket-consent"
                          name="contactConsent"
                          checked={formData.contactConsent}
                          onChange={handleInputChange}
                        />
                        <span>
                          I agree to be contacted by an authorized MACHINE Systems regional specialist regarding this configuration request and formal quotation. <span className="required">*</span>
                        </span>
                      </label>
                      {formErrors.contactConsent && (
                        <div style={{ color: "#c94f2d", fontSize: "11px", marginTop: "4px" }}>
                          {formErrors.contactConsent}
                        </div>
                      )}
                    </div>

                    <div className="col-12" style={{ marginTop: "18px" }}>
                      <button
                        type="submit"
                        className="button button-lime"
                        disabled={isSubmitting}
                        style={{
                          width: "100%",
                          padding: "14px 20px",
                          fontSize: "14px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                          border: "none",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                            <span>Submitting Your Request...</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-check"></i>
                            <span>Submit Request for Quotation ({formattedSubtotal})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Help callout */}
              <div className="basket-help">
                <span className="basket-help-icon">
                  <i className="bi bi-person-workspace"></i>
                </span>
                <span>
                  <strong>Need technical guidance?</strong>
                  <small>
                    Our application engineers are available to review part drawings, cycle times, and recommend optimal platform packages.
                  </small>
                </span>
                <Link to="/contact" aria-label="Talk to the team">
                  <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>

            {/* Sticky Basket Summary Sidebar */}
            <aside className="basket-summary">
              <div className="basket-summary-kicker">
                <i className="bi bi-receipt"></i> REQUEST SUMMARY
              </div>
              <h2>
                Review &amp; Submit
                <br />
                Your Selection.
              </h2>

              <div className="summary-row">
                <span>Unique Platforms</span>
                <strong>{basket.length < 10 ? `0${basket.length}` : basket.length}</strong>
              </div>

              <div className="summary-row">
                <span>Total Machine Units</span>
                <strong>{totalCount < 10 ? `0${totalCount}` : totalCount}</strong>
              </div>

              {/* Breakdown of machines */}
              <div style={{ padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                {basket.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      padding: "4px 0",
                      color: "#d0ded4",
                    }}
                  >
                    <span style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.quantity}x {item.name}
                    </span>
                    <strong>${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-row">
                <span>Indicative Subtotal</span>
                <strong>{formattedSubtotal}</strong>
              </div>

              <div className="basket-total">
                <span>Total Indicative Estimate</span>
                <strong>{formattedSubtotal}</strong>
                <small>USD · Final quotation confirmed by local representative</small>
              </div>

              <p className="summary-note">
                An authorized regional specialist will evaluate spindle compatibility, installation prerequisites, and lead times.
              </p>

              <button
                type="button"
                className="button button-lime"
                onClick={scrollToRequestForm}
                style={{
                  width: "100%",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                <i className="bi bi-send-check"></i> Submit Request
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px" }}>
                <Link className="basket-continue" to="/machines" style={{ margin: 0 }}>
                  <i className="bi bi-plus-circle"></i> Add another machine
                </Link>

                <button
                  type="button"
                  onClick={handleClearBasket}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fca5a5",
                    fontSize: "11px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Clear basket
                </button>
              </div>

              <div className="basket-summary-foot">
                <i className="bi bi-shield-check"></i> Production-ready engineering · Dedicated regional support
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
};

export default Basket;
