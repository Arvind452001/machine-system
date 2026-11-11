import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";
import { optionsApi } from "../api/optionsApi";
import { BASE_URL } from "../api/axiosInstance";
import { useBasket } from "../context/BasketContext";
import { showSuccessAlert } from "../utils/alert";

// Helper to resolve backend image paths
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

// Helper to extract options grouped by category from either optionsByCategory or availableOptions
const extractOptionsByCategory = (m) => {
  if (!m) return {};

  // Case 1: Backend provides optionsByCategory object { spindle: [...], tooling: [...], ... }
  if (
    m.optionsByCategory &&
    typeof m.optionsByCategory === "object" &&
    Object.keys(m.optionsByCategory).length > 0
  ) {
    const groups = {};
    Object.entries(m.optionsByCategory).forEach(([category, optionsList]) => {
      if (Array.isArray(optionsList) && optionsList.length > 0) {
        groups[category.toLowerCase()] = optionsList.filter(
          (o) => o && o.isActive !== false
        );
      }
    });
    return groups;
  }

  // Case 2: Backend provides availableOptions array
  if (Array.isArray(m.availableOptions) && m.availableOptions.length > 0) {
    const groups = {};
    m.availableOptions.forEach((o) => {
      if (!o || o.isActive === false) return;
      const cat = (o.category || "options").toLowerCase();
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(o);
    });
    return groups;
  }

  return {};
};

const Configure = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { basket, updateBasketItemConfig, addToBasket, getBasketItem } = useBasket();

  // Machine slug or ID from query params or URL hash
  const machineParam =
    searchParams.get("machine") ||
    searchParams.get("id") ||
    searchParams.get("slug") ||
    location.hash.replace("#", "").replace("-config", "") ||
    "ms-m500";

  const basketItemId = searchParams.get("basketItemId");

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [ruleValidation, setRuleValidation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Retrieve matching basket item if present
  const matchingBasketItem =
    getBasketItem(basketItemId) ||
    getBasketItem(machineParam) ||
    basket.find(
      (b) =>
        b.id === basketItemId ||
        b.machineId === machineParam ||
        b.machineSlug === machineParam
    );

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    machinesApi
      .getMachine(machineParam)
      .then((res) => {
        if (!mounted || !res) return;
        const m = res.data || res;
        setMachine(m);

        // Group available options dynamically from API response
        const groups = extractOptionsByCategory(m);

        // Calculate defaults
        const defaults = {};
        Object.entries(groups).forEach(([catKey, catOpts]) => {
          const defaultOpt =
            catOpts.find((o) => o.isDefault) ||
            catOpts.find((o) => Number(o.priceDelta || 0) === 0);
          if (defaultOpt) {
            defaults[catKey] = defaultOpt._id || defaultOpt.code || defaultOpt.name;
          } else {
            defaults[catKey] = "none";
          }
        });

        // If the basket item already has previous configuration options, preserve them!
        if (
          matchingBasketItem &&
          matchingBasketItem.rawSelectedOptions &&
          Object.keys(matchingBasketItem.rawSelectedOptions).length > 0
        ) {
          setSelectedOptions({
            ...defaults,
            ...matchingBasketItem.rawSelectedOptions,
          });
        } else {
          setSelectedOptions(defaults);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch machine for configurator:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [machineParam, basketItemId, matchingBasketItem]);

  // Group options dynamically by category from machine data
  const groupedCategories = useMemo(() => extractOptionsByCategory(machine), [machine]);
  const categoryEntries = useMemo(() => Object.entries(groupedCategories), [groupedCategories]);
  const allAvailableOptions = useMemo(() => Object.values(groupedCategories).flat(), [groupedCategories]);

  // Real-time rule engine validation (POST /api/v1/options/validate)
  useEffect(() => {
    if (!machine && !machineParam) return;
    const targetId = machine?._id || machineParam;

    const selectedCodes = Object.values(selectedOptions)
      .filter((id) => id && id !== "none")
      .map(
        (id) =>
          allAvailableOptions.find((o) => (o._id || o.code || o.name) === id)?.code
      )
      .filter(Boolean);

    if (selectedCodes.length === 0) {
      setRuleValidation(null);
      return;
    }

    optionsApi
      .validateOptions({
        machineId: targetId,
        optionCodes: selectedCodes,
      })
      .then((res) => {
        setRuleValidation(res);
      })
      .catch((err) => {
        console.warn("Could not validate options rules:", err.message);
      });
  }, [machine, selectedOptions, machineParam, allAvailableOptions]);

  // Fallbacks if machine data is still loading or using default
  const machineName = machine?.name || matchingBasketItem?.name || "Machine Platform";
  const machineSku =
    machine?.sku || machine?.slug?.toUpperCase() || matchingBasketItem?.sku || "MD-SYS";
  const machineCategory = (machine?.category || matchingBasketItem?.category || "MILLING").toUpperCase();
  const machineSummary =
    machine?.summary ||
    machine?.description?.slice(0, 120) ||
    matchingBasketItem?.summary ||
    "Production-ready systems with room to make them your own.";
  const basePrice = Number(machine?.basePrice || matchingBasketItem?.basePrice) || 0;

  const imagesList =
    machine?.images &&
    machine.images.length > 0 &&
    machine.images[0] !== "string"
      ? machine.images
      : matchingBasketItem?.image
      ? [matchingBasketItem.image]
      : [
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        ];
  const machineImage = resolveImageUrl(imagesList[0]);

  // Calculate live total price from selected options
  const optionsPriceDelta = Object.entries(selectedOptions).reduce(
    (total, [catKey, selectedId]) => {
      if (!selectedId || selectedId === "none") return total;
      const opt = (groupedCategories[catKey] || []).find(
        (o) => (o._id || o.code || o.name) === selectedId
      );
      return total + (Number(opt?.priceDelta) || 0);
    },
    0
  );

  const totalPrice = basePrice + optionsPriceDelta;

  // Format selected options for enquiry payload and basket storage
  const formattedSelectedOptions = Object.entries(selectedOptions)
    .filter(([, optId]) => optId && optId !== "none")
    .map(([catKey, optId]) => {
      const opt = (groupedCategories[catKey] || []).find(
        (o) => (o._id || o.code || o.name) === optId
      );
      return {
        name: opt?.name || opt?.label || "Option",
        priceDelta: Number(opt?.priceDelta) || 0,
        category: catKey,
        optionId: optId,
      };
    });

  const handleCategorySelect = (category, optId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: optId,
    }));
  };

  /**
   * Save updated configuration and synchronize with basket
   */
  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      const targetBasketItemId = basketItemId || matchingBasketItem?.id;

      if (targetBasketItemId) {
        // Synchronize with existing basket item
        updateBasketItemConfig(targetBasketItemId, {
          selectedOptions: formattedSelectedOptions,
          rawSelectedOptions: selectedOptions,
          price: totalPrice,
        });
      } else {
        // If not in basket yet, add it with this custom configuration
        addToBasket(machine, {
          selectedOptions: formattedSelectedOptions,
          rawSelectedOptions: selectedOptions,
          price: totalPrice,
        });
      }

      // Keep legacy localStorage in sync for backward compatibility
      try {
        localStorage.setItem(
          "machine_configured_enquiry",
          JSON.stringify({
            machineId: machine?._id || machineParam || "",
            machineName,
            machineCode: machineSku,
            calculatedTotal: totalPrice,
            selectedOptions: formattedSelectedOptions,
          })
        );
      } catch {
        // ignore
      }

      await showSuccessAlert(
        "Configuration Updated",
        `Configuration for ${machineName} has been synchronized with your basket.`
      );

      navigate("/basket");
    } catch (err) {
      console.error("Error saving configuration:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const categoryLabels = {
    coupler_top: "Top Bracket / Carrier Hitch",
    coupler_bottom: "Bottom Quick Coupler / Quick Hitch",
    control: "Control Unit & Joysticks",
    gripper: "Integrated Grab / Gripper Cassette",
    lubrication: "Central Lubrication System",
    spindle: "Spindle package",
    tooling: "Tool changer & magazine",
    cooling: "Cooling",
    enclosure: "Enclosure & safety",
    automation: "Automation & robotics interface",
    service: "Service & warranty",
    options: "Additional options",
  };

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/basket">
            <i className="bi bi-arrow-left"></i> Back to basket
          </Link>
          <span>/</span>
          <span>Configure: {machineName}</span>
        </div>

        <section className="configure-heading">
          <div>
            <div className="eyebrow">
              <span></span> Step 3 · Build your specification
            </div>
            <h1>
              Configure <em>{machineName}.</em>
            </h1>
            <p>
              Select platform options, modular packages, and accessories to tailor this machine to your production setup.
            </p>
          </div>
          <div className="build-code">
            <span>BASKET ITEM</span>
            <strong>
              {machineName} · {machineSku}
            </strong>
          </div>
        </section>

        {/* 5-Step Process Stepper */}
        <div className="stepper" aria-label="Order Process Progress">
          <Link to="/machines" style={{ textDecoration: "none" }}>
            <span>
              <b>01</b> Select
            </span>
          </Link>
          <i></i>
          <Link to="/basket" style={{ textDecoration: "none" }}>
            <span>
              <b>02</b> Basket
            </span>
          </Link>
          <i></i>
          <span className="active">
            <b>03</b> Configure
          </span>
          <i></i>
          <span>
            <b>04</b> Review
          </span>
          <i></i>
          <span>
            <b>05</b> Submit
          </span>
        </div>

        {matchingBasketItem && (
          <div
            style={{
              padding: "10px 18px",
              margin: "0 6% 20px",
              background: "#edf7f1",
              border: "1px solid #c2e5d1",
              borderRadius: "6px",
              color: "#184f36",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <i className="bi bi-arrow-repeat text-success"></i>
              <span>
                <strong>Basket Synchronization:</strong> Updating configuration for item in your basket (Current Qty: {matchingBasketItem.quantity}).
              </span>
            </div>
            <Link to="/basket" style={{ color: "#184f36", fontWeight: 600, textDecoration: "underline" }}>
              Return to Basket
            </Link>
          </div>
        )}

        {loading ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7c72",
              margin: "0 auto 40px",
              maxWidth: "1200px",
            }}
          >
            <div
              className="spinner-border text-secondary mb-3"
              role="status"
              style={{ width: "2.5rem", height: "2.5rem" }}
            ></div>
            <div style={{ fontSize: "14px" }}>
              Loading configurator options...
            </div>
          </div>
        ) : !machine ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7c72",
              margin: "0 auto 40px",
              maxWidth: "800px",
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #e1e6e0",
            }}
          >
            <i
              className="bi bi-exclamation-circle text-warning mb-3 d-block"
              style={{ fontSize: "2.5rem" }}
            ></i>
            <h3 style={{ color: "#173f35" }}>Machine Not Found</h3>
            <p style={{ maxWidth: "480px", margin: "8px auto 24px" }}>
              The requested machine could not be retrieved from the catalog. Please select a machine from the catalog.
            </p>
            <Link className="button button-dark" to="/machines">
              Browse Machines <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <section
            className="configure-layout"
            id="configure-panel"
            style={{ display: "grid" }}
          >
            <div className="options-panel">
              <div className="panel-kicker">
                <span>
                  {machineSku} · {machineCategory}
                </span>
                <span>
                  {categoryEntries.length > 0
                    ? `${String(categoryEntries.length).padStart(2, "0")} CATEGORIES`
                    : "00 CATEGORIES"}
                </span>
              </div>
              <h2>{machineName}</h2>
              <p className="options-intro">{machineSummary}</p>

              {categoryEntries.length > 0 ? (
                categoryEntries.map(([categoryKey, opts], idx) => {
                  const number = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
                  const title =
                    categoryLabels[categoryKey] ||
                    categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

                  const currentSelectedId = selectedOptions[categoryKey] || "";
                  const selectedOpt = opts.find(
                    (o) => (o._id || o.code || o.name) === currentSelectedId
                  );

                  const hasFreeDefault = opts.some(
                    (o) => o.isDefault || Number(o.priceDelta || 0) === 0
                  );

                  const displayLabel = selectedOpt
                    ? selectedOpt.name
                    : currentSelectedId === "none"
                    ? "Standard (Included)"
                    : opts[0]?.name || "Select option";

                  return (
                    <div className="option-group" key={categoryKey}>
                      <label htmlFor={`select-${categoryKey}`}>
                        {number} &nbsp; {title}
                        <small>{displayLabel}</small>
                      </label>
                      <select
                        className="option-select"
                        id={`select-${categoryKey}`}
                        value={currentSelectedId}
                        onChange={(e) =>
                          handleCategorySelect(categoryKey, e.target.value)
                        }
                      >
                        {!hasFreeDefault && (
                          <option value="none">Standard / None (Included)</option>
                        )}
                        {opts.map((opt) => {
                          const optValue = opt._id || opt.code || opt.name;
                          const delta = Number(opt.priceDelta || 0);
                          const priceText =
                            delta === 0
                              ? " (Included)"
                              : ` · +$${delta.toLocaleString()}`;
                          return (
                            <option key={optValue} value={optValue}>
                              {opt.name}{priceText}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "36px 20px",
                    textAlign: "center",
                    background: "#fff",
                    border: "1px dashed #d0d7d2",
                    borderRadius: "8px",
                    color: "#6b7c72",
                    margin: "20px 0",
                  }}
                >
                  <i
                    className="bi bi-info-circle mb-2 d-block"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <strong>Standard complete platform specification.</strong>
                  <p className="mt-1 mb-0" style={{ fontSize: "13px" }}>
                    This machine platform operates with complete factory specifications.
                  </p>
                </div>
              )}

              {ruleValidation && !ruleValidation.isValid && (
                <div style={{ background: "#fde8e8", color: "#9b1c1c", border: "1px solid #f8b4b4", padding: "10px 14px", borderRadius: "6px", fontSize: "13px", marginTop: "14px" }}>
                  <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                  <strong>Configuration Rule Conflict:</strong>{" "}
                  {(ruleValidation.conflicts || ruleValidation.missingRequirements || []).join(", ") || "Selected options have dependencies or incompatibilities."}
                </div>
              )}
              {ruleValidation && ruleValidation.isValid && (
                <div style={{ background: "#def7ec", color: "#03543f", border: "1px solid #84e1bc", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", marginTop: "14px" }}>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  <strong>Verified:</strong> All selected modules and packages pass engineering compatibility checks.
                </div>
              )}
            </div>

            <div className="preview-column">
              <div className="preview-toolbar">
                <span>
                  <i className="bi bi-eye"></i> CONFIGURATION PREVIEW
                </span>
                <span>SYNCHRONIZED WITH BASKET</span>
              </div>
              <div className="preview-image">
                <img
                  src={machineImage}
                  alt={machineName}
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <span>
                  {machineSku} · {machineCategory}
                </span>
                <strong className="preview-caption">{machineName}</strong>
              </div>
              <div className="price-box">
                <div>
                  <span>INDICATIVE CONFIGURED PRICE · USD</span>
                  <p>
                    Base ${basePrice.toLocaleString()} + options $
                    {optionsPriceDelta.toLocaleString()}
                  </p>
                </div>
                <strong>${totalPrice.toLocaleString()}</strong>
              </div>
              <p className="price-note">
                Final price is confirmed by your regional sales representative.
              </p>

              <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
                <button
                  type="button"
                  className="button button-lime"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={handleSaveConfiguration}
                  disabled={isSaving}
                >
                  <i className="bi bi-check-circle"></i>
                  {isSaving ? "Saving Configuration..." : "Save Configuration to Basket"}
                </button>
                <Link
                  className="button button-dark"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                  to="/basket"
                >
                  <i className="bi bi-arrow-left"></i> Return to Basket
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="home-contact" id="contact" style={{ marginBottom: "110px" }}>
          <div className="contact-mark">
            <i className="bi bi-chat-square-text"></i>
          </div>
          <div>
            <span className="eyebrow eyebrow-light">
              Step 4 &amp; 5 · Review and Submit
            </span>
            <h2>Save and proceed to request.</h2>
          </div>
          <p>
            Save this configuration to your basket where you can review your complete order and submit your request.
          </p>
          <button
            type="button"
            className="contact-action"
            onClick={handleSaveConfiguration}
            style={{ cursor: "pointer", border: "none" }}
          >
            Save &amp; Proceed to Basket <i className="bi bi-arrow-up-right"></i>
          </button>
        </section>

        {/* Haas-Style Sticky Floating Configuration Bar */}
        {machine && (
          <aside
            className="haas-config-bar"
            aria-label="Configuration summary and build bar"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1040,
              background: "rgba(18, 38, 30, 0.96)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(175, 230, 195, 0.25)",
              boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.35)",
              color: "#ffffff",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
              transition: "all 0.3s ease",
            }}
          >
            {/* Left: Machine Thumbnail & Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "240px" }}>
              <img
                src={machineImage}
                alt={machineName}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "#0c1f17",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      background: "rgba(183, 235, 70, 0.2)",
                      color: "#b7eb46",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {machineSku}
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.65)" }}>
                    {formattedSelectedOptions.length} option{formattedSelectedOptions.length === 1 ? "" : "s"} selected
                  </span>
                </div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>
                  {machineName}
                </div>
              </div>
            </div>

            {/* Middle: Live Pricing Breakdown */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "0 16px",
                borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.7)" }}>
                <div>Base: ${basePrice.toLocaleString()}</div>
                <div>
                  Options:{" "}
                  <span style={{ color: optionsPriceDelta > 0 ? "#b7eb46" : "#ffffff" }}>
                    +${optionsPriceDelta.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    letterSpacing: "0.8px",
                    color: "rgba(255, 255, 255, 0.6)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Configured Price (USD)
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#b7eb46",
                    letterSpacing: "-0.5px",
                  }}
                >
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/basket"
                className="btn btn-outline-light btn-sm"
                style={{
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderColor: "rgba(255, 255, 255, 0.35)",
                }}
              >
                <i className="bi bi-cart3"></i> Basket
                {basket.length > 0 && (
                  <span
                    style={{
                      background: "#b7eb46",
                      color: "#12261e",
                      borderRadius: "10px",
                      padding: "1px 6px",
                      fontSize: "10px",
                      fontWeight: 800,
                      marginLeft: "2px",
                    }}
                  >
                    {basket.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="button button-lime"
                onClick={handleSaveConfiguration}
                disabled={isSaving}
                style={{
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 22px",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(183, 235, 70, 0.35)",
                  background: "#b7eb46",
                  color: "#12261e",
                }}
              >
                {isSaving ? (
                  <>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle" style={{ fontSize: "16px" }}></i>
                    <span>Save to Basket</span>
                  </>
                )}
              </button>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};

export default Configure;
