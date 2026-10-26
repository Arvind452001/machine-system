import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";
import { optionsApi } from "../api/optionsApi";
import { BASE_URL } from "../api/axiosInstance";

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

  // Machine slug or ID from query params or URL hash
  const machineParam =
    searchParams.get("machine") ||
    searchParams.get("id") ||
    searchParams.get("slug") ||
    location.hash.replace("#", "").replace("-config", "") ||
    "ms-m500";

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [ruleValidation, setRuleValidation] = useState(null);

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

        const initial = {};
        Object.entries(groups).forEach(([catKey, catOpts]) => {
          const defaultOpt =
            catOpts.find((o) => o.isDefault) ||
            catOpts.find((o) => Number(o.priceDelta || 0) === 0);
          if (defaultOpt) {
            initial[catKey] = defaultOpt._id || defaultOpt.code;
          } else {
            initial[catKey] = "none";
          }
        });

        setSelectedOptions(initial);
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
  }, [machineParam]);

  // Group options dynamically by category from machine data
  const groupedCategories = extractOptionsByCategory(machine);
  const categoryEntries = Object.entries(groupedCategories);
  const allAvailableOptions = Object.values(groupedCategories).flat();

  // Real-time rule engine validation (POST /api/v1/options/validate)
  useEffect(() => {
    if (!machine && !machineParam) return;
    const targetId = machine?._id || machineParam;

    const selectedCodes = Object.values(selectedOptions)
      .filter((id) => id && id !== "none")
      .map(
        (id) =>
          allAvailableOptions.find((o) => (o._id || o.code) === id)?.code
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
  }, [machine, selectedOptions, machineParam]);

  // Fallbacks if machine data is still loading or using default
  const machineName = machine?.name ;
  const machineSku =
    machine?.sku || machine?.slug?.toUpperCase() ;
  const machineCategory = (machine?.category || "MILLING").toUpperCase();
  const machineSummary =
    machine?.summary ||
    machine?.description?.slice(0, 120) ||
    "Production-ready systems with room to make them your own.";
  const basePrice = Number(machine?.basePrice) || 0;

  const imagesList =
    machine?.images &&
    machine.images.length > 0 &&
    machine.images[0] !== "string"
      ? machine.images
      : [
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        ];
  const machineImage = resolveImageUrl(imagesList[0]);

  // Calculate live total price from selected options
  const optionsPriceDelta = Object.entries(selectedOptions).reduce(
    (total, [catKey, selectedId]) => {
      if (!selectedId || selectedId === "none") return total;
      const opt = (groupedCategories[catKey] || []).find(
        (o) => (o._id || o.code) === selectedId
      );
      return total + (Number(opt?.priceDelta) || 0);
    },
    0
  );

  const totalPrice = basePrice + optionsPriceDelta;

  const handleCategorySelect = (category, optId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: optId,
    }));
  };

  const categoryLabels = {
    spindle: "Spindle package",
    tooling: "Tool changer & magazine",
    cooling: "Cooling",
    enclosure: "Enclosure & safety",
    automation: "Automation & robotics interface",
    control: "Control unit & software",
    service: "Service & warranty",
    options: "Additional options",
  };

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to={`/machine-details?id=${machine?.slug || machineParam}`}>
            <i className="bi bi-arrow-left"></i> Machine overview
          </Link>
          <span>/</span>
          <span>Configure: {machineName}</span>
        </div>

        <section className="configure-heading">
          <div>
            <div className="eyebrow">
              <span></span> Build your specification
            </div>
            <h1>
              Make it <em> work harder.</em>
            </h1>
            <p>
              Compare platform options and find the right starting specification.
            </p>
          </div>
          <div className="build-code">
            <span>CONFIGURATION PREVIEW</span>
            <strong>
              {machineName} · {machineSku}
            </strong>
          </div>
        </section>

        <div className="stepper">
          <span className="active">
            <b>01</b> Configure
          </span>
          <i></i>
          <span>
            <b>02</b> Review basket
          </span>
          <i></i>
          <span>
            <b>03</b> Send enquiry
          </span>
        </div>

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
                    (o) => (o._id || o.code) === currentSelectedId
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
                          const optValue = opt._id || opt.code;
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
                  <strong>No configurable options available for this machine.</strong>
                  <p className="mt-1 mb-0" style={{ fontSize: "13px" }}>
                    This machine platform is configured as a standard complete platform.
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

              <div className="compatibility-note">
                <i className="bi bi-info-circle"></i>Final option compatibility
                is validated by the rule engine (POST /api/v1/options/validate).
              </div>
            </div>

            <div className="preview-column">
              <div className="preview-toolbar">
                <span>
                  <i className="bi bi-eye"></i> CONFIGURATION PREVIEW
                </span>
                <span>REAL-TIME QUOTE</span>
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
                <Link
                  className="button button-lime"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                  to={`/enquiry?machine=${encodeURIComponent(
                    machineName
                  )}&price=${totalPrice}&sku=${encodeURIComponent(
                    machineSku
                  )}&configured=true`}
                >
                  <i className="bi bi-chat-dots"></i> Request Quote for this
                  Build
                </Link>
                <Link
                  className="button button-dark"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                  }}
                  to={`/machine-details?id=${machine?.slug || machineParam}`}
                >
                  <i className="bi bi-arrow-left"></i> Back to Machine Details
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="home-contact" id="contact">
          <div className="contact-mark">
            <i className="bi bi-chat-square-text"></i>
          </div>
          <div>
            <span className="eyebrow eyebrow-light">
              Ready to discuss your build?
            </span>
            <h2>Take your specification further.</h2>
          </div>
          <p>
            Our team can confirm compatible options and prepare your final quote.
          </p>
          <Link
            className="contact-action"
            to={`/enquiry?machine=${encodeURIComponent(
              machineName
            )}&price=${totalPrice}&sku=${encodeURIComponent(machineSku)}`}
          >
            Continue to enquiry <i className="bi bi-arrow-up-right"></i>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Configure;
