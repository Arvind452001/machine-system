import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import tiltRotatorData from "../data/tiltRotatorData.json";
import { useBasket } from "../context/BasketContext";
import { useAuth } from "../context/AuthContext";
import { showSuccessAlert } from "../utils/alert";

const FALLBACK_BUILD_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='360' viewBox='0 0 500 360'%3E%3Crect width='500' height='360' fill='%23f8faf9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='15'%3ELive build rendering preview%3C/text%3E%3C/svg%3E";

const FALLBACK_PART_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect width='400' height='260' fill='%23f1f5f2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='14'%3EPart visual preview%3C/text%3E%3C/svg%3E";

const TiltRotator = () => {
  const navigate = useNavigate();
  const { addToBasket } = useBasket();
  const { user } = useAuth();

  // Load configuration from JSON or localStorage
  const config = useMemo(() => {
    try {
      const stored = localStorage.getItem("tiltRotatorConfig_v2");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return tiltRotatorData;
  }, []);

  const [currentModelId, setCurrentModelId] = useState(null);
  const [selections, setSelections] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [viewedOptionId, setViewedOptionId] = useState(null);
  const [viewMode, setViewMode] = useState("select"); // "select" | "config" | "summary"
  const [orderRef, setOrderRef] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Prefill contact if logged in
  useEffect(() => {
    if (user) {
      setContactInfo((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        company: prev.company || user.company || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  const currentModel = useMemo(() => {
    if (!currentModelId || !config?.models) return null;
    return config.models.find((m) => m.id === currentModelId) || null;
  }, [currentModelId, config]);

  // Compatibility helper
  const isOptionAvailable = (opt, currentSelections) => {
    if (!opt.requires || opt.requires.length === 0) return true;
    const selectedVals = Object.values(currentSelections);
    return opt.requires.some((reqId) => selectedVals.includes(reqId));
  };

  const optionName = (model, optId) => {
    if (!model) return optId;
    for (const step of model.steps) {
      const found = step.options.find((o) => o.id === optId);
      if (found) return found.name;
    }
    return optId;
  };

  const requirementLabel = (opt) => {
    if (!opt.requires || opt.requires.length === 0) return "";
    const names = opt.requires.map((id) => optionName(currentModel, id));
    return names.join(" or ");
  };

  // Start configuring a chosen model
  const startConfig = (modelId) => {
    const model = config.models.find((m) => m.id === modelId);
    if (!model) return;

    setCurrentModelId(modelId);
    const initialSelections = {};
    for (const step of model.steps) {
      if (step.options && step.options.length > 0) {
        initialSelections[step.id] = step.options[0].id;
      }
    }
    setSelections(initialSelections);
    setCurrentStep(0);
    setViewedOptionId(null);
    setViewMode("config");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic live build image resolver
  const getBuildImage = (upToStepIdx) => {
    if (!currentModel || !config.combinationImages) return currentModel?.image || "";
    const stepsSlice = currentModel.steps.slice(0, upToStepIdx + 1);
    const parts = [currentModel.id];
    for (const step of stepsSlice) {
      if (selections[step.id]) {
        parts.push(selections[step.id]);
      }
    }

    // Try full key down to prefix keys
    for (let i = parts.length; i >= 1; i--) {
      const candidateKey = parts.slice(0, i).join("|");
      if (config.combinationImages[candidateKey]) {
        return config.combinationImages[candidateKey];
      }
    }
    return currentModel.image || "";
  };

  // Calculate price up to current step (or total)
  const calculateTotal = (upToStepIdx = null) => {
    if (!currentModel) return 0;
    const limit = upToStepIdx !== null ? upToStepIdx + 1 : currentModel.steps.length;
    let total = 0;
    currentModel.steps.slice(0, limit).forEach((step) => {
      const opt = step.options.find((o) => o.id === selections[step.id]);
      if (opt && opt.price) {
        total += Number(opt.price) || 0;
      }
    });
    return total;
  };

  const handleSelectOption = (stepId, opt) => {
    const available = isOptionAvailable(opt, selections);
    if (!available) {
      setViewedOptionId(opt.id);
      return;
    }

    setViewedOptionId(null);
    const updated = { ...selections, [stepId]: opt.id };

    // Validate later steps
    for (let i = currentStep + 1; i < currentModel.steps.length; i++) {
      const laterStep = currentModel.steps[i];
      const currentChoiceId = updated[laterStep.id];
      const currentChoiceOpt = laterStep.options.find((o) => o.id === currentChoiceId);
      if (currentChoiceOpt && !isOptionAvailable(currentChoiceOpt, updated)) {
        if (laterStep.options[0]) {
          updated[laterStep.id] = laterStep.options[0].id;
        }
      }
    }
    setSelections(updated);
  };

  const handleFinishAndSummary = () => {
    setOrderRef(String(Math.floor(100000 + Math.random() * 900000)));
    setViewMode("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToBasket = () => {
    const total = calculateTotal();
    const lastStep = currentModel.steps.length - 1;
    const buildImg = getBuildImage(lastStep);

    const configuredOptions = currentModel.steps.map((step) => {
      const opt = step.options.find((o) => o.id === selections[step.id]);
      return {
        name: opt ? opt.name : "Standard",
        category: step.name.replace(/^\d+\.\s*/, ""),
        price: opt ? opt.price : 0,
        image: opt?.partImage || "",
      };
    });

    const machinePayload = {
      _id: `tilt-${currentModel.id}-${Date.now()}`,
      name: `Tilt Rotator ${currentModel.name}`,
      slug: `tilt-${currentModel.id}`,
      sku: `TR-${currentModel.name.toUpperCase()}`,
      category: "TILTROTATORS & ATTACHMENTS",
      basePrice: 0,
      images: [buildImg || currentModel.image],
    };

    addToBasket(machinePayload, {
      price: total,
      selectedOptions: configuredOptions,
      rawSelectedOptions: selections,
    });

    showSuccessAlert(
      "Added to Basket!",
      `Tilt Rotator ${currentModel.name} has been added to your shopping basket with all chosen options.`
    );
    navigate("/basket");
  };

  return (
    <div style={{ background: "#f8faf9", minHeight: "90vh", paddingBottom: "60px" }}>
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .site-header, .site-footer, .topbar { display: none !important; }
          body { background: #ffffff !important; }
          .order-sheet { box-shadow: none !important; border: none !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="page-crumb no-print">
        <Link to="/">
          <i className="bi bi-arrow-left"></i> Home
        </Link>
        <span>/</span>
        <Link to="/machines">Machines</Link>
        <span>/</span>
        <span>Tilt Rotator Configurator</span>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: CHOOSE MODEL                                            */}
      {/* ============================================================== */}
      {viewMode === "select" && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 6%" }}>
          <div style={{ textAlign: "center", margin: "24px 0 40px" }}>
            <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "8px" }}>
              <span></span> PRECISION INDUSTRIAL ATTACHMENTS
            </div>
            <h1 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: "700", color: "#173f35", margin: 0 }}>
              Tilt Rotator <em>Configurator.</em>
            </h1>
            <p style={{ maxWidth: "600px", margin: "10px auto 0", color: "#526057", fontSize: "13px", lineHeight: 1.6 }}>
              Select your base excavator machine class below to customize hydraulic hose systems, top &amp; bottom quick hitches, main bodies, and grapples with live visual feedback.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "28px",
              maxWidth: "880px",
              margin: "0 auto",
            }}
          >
            {config.models.map((model) => (
              <div
                key={model.id}
                onClick={() => startConfig(model.id)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #dce1da",
                  borderRadius: "10px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 8px 24px rgba(23, 63, 53, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c94f2d";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 14px 30px rgba(201, 79, 45, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#dce1da";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(23, 63, 53, 0.06)";
                }}
              >
                <div
                  style={{
                    height: "200px",
                    background: "#fdfefe",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src={model.image || FALLBACK_BUILD_IMG}
                    alt={model.name}
                    style={{ maxHeight: "180px", maxWidth: "90%", objectFit: "contain" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#173f35" }}>
                    {model.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      background: "#e8fdf2",
                      color: "#173f35",
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {model.steps.length} Configuration Steps
                  </span>
                </div>

                <p style={{ color: "#64748b", fontSize: "12px", margin: "6px 0 20px" }}>
                  {model.description || "Heavy-duty tilt rotator attachment for industrial machinery."}
                </p>

                <button
                  type="button"
                  className="button button-dark"
                  style={{
                    marginTop: "auto",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Configure {model.name} <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: INTERACTIVE 3-COLUMN CONFIGURATOR                       */}
      {/* ============================================================== */}
      {viewMode === "config" && currentModel && (
        <div style={{ maxWidth: "1380px", margin: "0 auto", padding: "0 4%" }}>
          {/* Top Bar: Change Model & Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "14px 0 18px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("select")}
              className="button button-outline"
              style={{
                minHeight: "34px",
                padding: "0 14px",
                fontSize: "11px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <i className="bi bi-arrow-left"></i> Change Model
            </button>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Configuring Attachment
              </span>
              <strong style={{ display: "block", fontSize: "16px", color: "#173f35" }}>
                {currentModel.name} &middot; {currentModel.description}
              </strong>
            </div>
          </div>

          {/* Steps Progress Ribbon */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {currentModel.steps.map((step, idx) => {
              const isActive = idx === currentStep;
              const isDone = idx < currentStep;
              const cleanStepName = step.name.replace(/^\d+\.\s*/, "");

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setViewedOptionId(null);
                    setCurrentStep(idx);
                  }}
                  style={{
                    flex: "1 1 0",
                    minWidth: "140px",
                    padding: "10px 12px",
                    background: isActive ? "#173f35" : isDone ? "#e8fdf2" : "#ffffff",
                    color: isActive ? "#ffffff" : isDone ? "#173f35" : "#64748b",
                    border: `1px solid ${isActive ? "#173f35" : isDone ? "#a7f3d0" : "#dce1da"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", fontWeight: "700" }}>
                    <span>STEP {idx + 1}</span>
                    {isDone && <i className="bi bi-check-circle-fill" style={{ color: "#10b981", fontSize: "11px" }}></i>}
                  </div>
                  <strong style={{ display: "block", fontSize: "12px", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cleanStepName}
                  </strong>
                </button>
              );
            })}
          </div>

          {/* 3-Column Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {/* COLUMN 1: STEP OPTIONS */}
            {(() => {
              const activeStep = currentModel.steps[currentStep];
              const viewedOpt = activeStep.options.find((o) => o.id === viewedOptionId);

              return (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dce1da",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px", borderBottom: "1px solid #edf2ec", paddingBottom: "10px" }}>
                    <div>
                      <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                        SELECT OPTION
                      </span>
                      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#173f35", margin: 0 }}>
                        {activeStep.name}
                      </h2>
                    </div>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      {activeStep.options.length} Choices
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                    {activeStep.options.map((opt) => {
                      const isAvailable = isOptionAvailable(opt, selections);
                      const isSelected = selections[activeStep.id] === opt.id;
                      const isViewing = !isAvailable && viewedOpt && viewedOpt.id === opt.id;
                      const priceFormatted = opt.price ? `+€${Number(opt.price).toLocaleString()}` : "Included";

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(activeStep.id, opt)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "12px 14px",
                            borderRadius: "6px",
                            border: `1.5px solid ${
                              isSelected
                                ? "#c94f2d"
                                : isViewing
                                ? "#ea580c"
                                : !isAvailable
                                ? "#e2e8f0"
                                : "#dce1da"
                            }`,
                            background: isSelected
                              ? "#fff6f3"
                              : isViewing
                              ? "#fffaf0"
                              : !isAvailable
                              ? "#f8fafc"
                              : "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ fontSize: "13px", color: isSelected ? "#c94f2d" : "#1e293b" }}>
                              {opt.name}
                            </strong>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: isSelected ? "#c94f2d" : "#64748b",
                              }}
                            >
                              {priceFormatted}
                            </span>
                          </div>

                          {!isAvailable && opt.requires && opt.requires.length > 0 && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#b45309",
                                background: "#fef3c7",
                                padding: "2px 6px",
                                borderRadius: "3px",
                                marginTop: "6px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <i className="bi bi-lock-fill"></i> Requires: {requirementLabel(opt)}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons inside Column 1 */}
                  <div style={{ marginTop: "24px", paddingTop: "14px", borderTop: "1px solid #edf2ec", display: "flex", gap: "10px" }}>
                    {currentStep > 0 && (
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => {
                          setViewedOptionId(null);
                          setCurrentStep((prev) => prev - 1);
                        }}
                        style={{ minHeight: "36px", fontSize: "11px", padding: "0 14px" }}
                      >
                        <i className="bi bi-chevron-left"></i> Previous
                      </button>
                    )}

                    {currentStep < currentModel.steps.length - 1 ? (
                      <button
                        type="button"
                        className="button button-dark"
                        onClick={() => {
                          setViewedOptionId(null);
                          setCurrentStep((prev) => prev + 1);
                        }}
                        style={{ minHeight: "36px", fontSize: "11px", padding: "0 18px", marginLeft: "auto" }}
                      >
                        Next Step <i className="bi bi-chevron-right"></i>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="button button-lime"
                        onClick={handleFinishAndSummary}
                        style={{ minHeight: "36px", fontSize: "11px", padding: "0 18px", marginLeft: "auto" }}
                      >
                        Finish &amp; Summary <i className="bi bi-check2"></i>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* COLUMN 2: SELECTED PART DETAILS */}
            {(() => {
              const activeStep = currentModel.steps[currentStep];
              const viewedOpt = activeStep.options.find((o) => o.id === viewedOptionId);
              const selectedOpt = activeStep.options.find((o) => o.id === selections[activeStep.id]);
              const displayOpt = viewedOpt || selectedOpt;
              const isLocked = viewedOpt && !isOptionAvailable(viewedOpt, selections);

              return (
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dce1da",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ marginBottom: "14px", borderBottom: "1px solid #edf2ec", paddingBottom: "10px" }}>
                    <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                      COMPONENT INSPECTION
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#173f35", margin: 0 }}>
                      {displayOpt ? displayOpt.name : "Part Overview"}
                    </h3>
                  </div>

                  <div
                    style={{
                      height: "220px",
                      background: "#fafafa",
                      border: "1px solid #eef2ed",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "14px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={displayOpt?.partImage || FALLBACK_PART_IMG}
                      alt={displayOpt?.name || "Part"}
                      style={{ maxHeight: "200px", maxWidth: "90%", objectFit: "contain" }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                        {displayOpt?.name}
                      </strong>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#c94f2d" }}>
                        {displayOpt?.price ? `+€${Number(displayOpt.price).toLocaleString()}` : "Standard"}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>
                      {displayOpt?.description || "Engineered for maximum fatigue resistance, tight rotational tolerances, and severe excavator breakout forces."}
                    </p>

                    {displayOpt?.requires && displayOpt.requires.length > 0 && (
                      <div
                        style={{
                          background: isLocked ? "#fef3c7" : "#e8fdf2",
                          border: `1px solid ${isLocked ? "#fde68a" : "#a7f3d0"}`,
                          borderRadius: "6px",
                          padding: "10px 12px",
                          fontSize: "11px",
                          color: isLocked ? "#92400e" : "#065f46",
                        }}
                      >
                        <i className={`bi ${isLocked ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}`} style={{ marginRight: "6px" }}></i>
                        {isLocked
                          ? `Requires ${requirementLabel(displayOpt)}. This option cannot be engaged until the matching prerequisite is selected.`
                          : `Compatible with your current selection (${requirementLabel(displayOpt)}).`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* COLUMN 3: LIVE BUILD PREVIEW & RUNNING TOTAL */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #dce1da",
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px", borderBottom: "1px solid #edf2ec", paddingBottom: "10px" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                    LIVE ASSEMBLED RENDER
                  </span>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#173f35", margin: 0 }}>
                    Build Progress (Step 1 to {currentStep + 1})
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    background: "#e8fdf2",
                    color: "#173f35",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  LIVE SYNC
                </span>
              </div>

              {/* Dynamic Live Build Image */}
              <div
                style={{
                  height: "220px",
                  background: "#fdfefe",
                  border: "1px solid #eef2ed",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={getBuildImage(currentStep) || FALLBACK_BUILD_IMG}
                  alt="Live machine build"
                  style={{ maxHeight: "205px", maxWidth: "92%", objectFit: "contain", transition: "all 0.25s ease" }}
                />
              </div>

              {/* Running Price Total */}
              <div
                style={{
                  background: "#f9faf9",
                  border: "1px solid #dce1da",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#4f5c53", fontWeight: "600" }}>
                  Indicative Build Price:
                </span>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#c94f2d" }}>
                  €{calculateTotal(currentStep).toLocaleString()}
                </span>
              </div>

              {/* Build So Far Breakdown */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Configuration Summary So Far:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "11px", color: "#334155" }}>
                  {currentModel.steps.slice(0, currentStep + 1).map((step) => {
                    const opt = step.options.find((o) => o.id === selections[step.id]);
                    return (
                      <div key={step.id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>{step.name.replace(/^\d+\.\s*/, "")}:</span>
                        <strong>{opt ? opt.name : "—"}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: FINISH & ORDER SHEET (WITH BASKET & PDF EXPORT)         */}
      {/* ============================================================== */}
      {viewMode === "summary" && currentModel && (
        <div style={{ maxWidth: "920px", margin: "0 auto", padding: "0 4%" }}>
          {/* Action Toolbar */}
          <div
            className="no-print"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "18px 0",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <button
              type="button"
              className="button button-outline"
              onClick={() => setViewMode("config")}
              style={{ minHeight: "36px", fontSize: "11px", padding: "0 14px" }}
            >
              <i className="bi bi-arrow-left"></i> Back to Configuration
            </button>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="button button-outline"
                onClick={() => window.print()}
                style={{ minHeight: "36px", fontSize: "11px", padding: "0 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <i className="bi bi-printer"></i> Print / Save PDF
              </button>

              <button
                type="button"
                className="button button-lime"
                onClick={handleAddToBasket}
                style={{ minHeight: "36px", fontSize: "11px", padding: "0 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <i className="bi bi-bag-plus"></i> Add to Basket &amp; Request Quote
              </button>
            </div>
          </div>

          <div
            className="no-print"
            style={{
              background: "#e8fdf2",
              border: "1px solid #a7f3d0",
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "12px",
              color: "#065f46",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="bi bi-info-circle-fill"></i>
            <span>
              Your custom configuration is ready! You can <strong>Print/Save as PDF</strong> or <strong>Add to Basket</strong> to submit a formal quotation request with our engineering desk.
            </span>
          </div>

          {/* Printable Official Order Sheet */}
          <article
            className="order-sheet"
            style={{
              background: "#ffffff",
              border: "1px solid #dce1da",
              borderRadius: "12px",
              boxShadow: "0 12px 36px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Header Letterhead */}
            <header
              style={{
                background: "#000000",
                color: "#ffffff",
                padding: "24px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "24px", height: "24px", background: "#c94f2d", display: "grid", placeItems: "center", color: "#fff", fontSize: "14px" }}>
                    <i className="bi bi-asterisk"></i>
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.06em" }}>
                    MACHINE SYSTEMS
                  </span>
                </div>
                <small style={{ color: "#94a3b8", display: "block", marginTop: "4px", fontSize: "10px" }}>
                  Precision Industrial Tooling &middot; Tilt-Rotator Systems
                </small>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#c94f2d", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  CONFIGURATION REQUEST
                </div>
                <div style={{ fontSize: "16px", fontWeight: "700", marginTop: "2px" }}>
                  Order No. {orderRef}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </header>

            <div style={{ padding: "28px 32px" }}>
              {/* Model & Assembled Image Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr",
                  gap: "24px",
                  alignItems: "center",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #edf2ec",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", color: "#c94f2d", fontWeight: "700", textTransform: "uppercase" }}>
                    TILT ROTATOR ATTACHMENT
                  </span>
                  <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#173f35", margin: "4px 0 8px" }}>
                    {currentModel.name}
                  </h2>
                  <p style={{ color: "#64748b", fontSize: "12px", lineHeight: 1.6, margin: 0 }}>
                    {currentModel.description}
                  </p>
                </div>

                <div
                  style={{
                    height: "170px",
                    background: "#ffffff",
                    border: "1px solid #eef2ed",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getBuildImage(currentModel.steps.length - 1) || FALLBACK_BUILD_IMG}
                    alt="Finished Tilt Rotator"
                    style={{ maxHeight: "155px", maxWidth: "90%", objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Customer Contact Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  background: "#f9faf9",
                  padding: "18px 20px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  border: "1px solid #eef2ed",
                }}
              >
                <div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Requested By
                  </span>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Contact Name</label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                        style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Company Name</label>
                      <input
                        type="text"
                        value={contactInfo.company}
                        onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                        placeholder="e.g. Apex Civil Contractors"
                        style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                    Contact Details
                  </span>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Email Address</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        placeholder="marcus@apexcivil.com"
                        style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", color: "#64748b" }}>Phone Number</label>
                      <input
                        type="text"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        style={{ width: "100%", padding: "6px 8px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "3px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Parts Breakdown Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #dce1da", textAlign: "left" }}>
                    <th style={{ padding: "10px 8px", fontSize: "11px", color: "#64748b" }}>PREVIEW</th>
                    <th style={{ padding: "10px 8px", fontSize: "11px", color: "#64748b" }}>SELECTED COMPONENT</th>
                    <th style={{ padding: "10px 8px", fontSize: "11px", color: "#64748b", textAlign: "right" }}>PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {currentModel.steps.map((step) => {
                    const opt = step.options.find((o) => o.id === selections[step.id]);
                    if (!opt) return null;
                    const stepClean = step.name.replace(/^\d+\.\s*/, "");

                    return (
                      <tr key={step.id} style={{ borderBottom: "1px solid #edf2ec" }}>
                        <td style={{ padding: "10px 8px", width: "50px" }}>
                          {opt.partImage ? (
                            <img
                              src={opt.partImage}
                              alt={opt.name}
                              style={{ width: "44px", height: "36px", objectFit: "contain", borderRadius: "3px", border: "1px solid #eee" }}
                            />
                          ) : (
                            <div style={{ width: "44px", height: "36px", background: "#f1f5f2", borderRadius: "3px", display: "grid", placeItems: "center", fontSize: "10px", color: "#94a3b8" }}>
                              N/A
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", display: "block" }}>
                            {stepClean}
                          </span>
                          <strong style={{ fontSize: "13px", color: "#173f35" }}>
                            {opt.name}
                          </strong>
                          {opt.description && (
                            <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#64748b" }}>
                              {opt.description}
                            </p>
                          )}
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                          {opt.price ? `€${Number(opt.price).toLocaleString()}` : "Included"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid #173f35", background: "#f8faf9" }}>
                    <td colSpan="2" style={{ padding: "14px 12px", fontSize: "14px", fontWeight: "700", color: "#173f35" }}>
                      Estimated Configuration Total
                    </td>
                    <td style={{ padding: "14px 12px", textAlign: "right", fontSize: "18px", fontWeight: "700", color: "#c94f2d" }}>
                      €{calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Notes */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px" }}>
                  Engineering or Commissioning Notes:
                </label>
                <textarea
                  rows="3"
                  value={contactInfo.notes}
                  onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                  placeholder="Specify machine excavator model, flow rates, pin diameter, or required delivery window..."
                  style={{ width: "100%", padding: "8px 10px", fontSize: "12px", border: "1px solid #dce1da", borderRadius: "4px", fontFamily: "inherit" }}
                ></textarea>
              </div>

              {/* Footer */}
              <footer
                style={{
                  borderTop: "1px solid #edf2ec",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  fontSize: "10px",
                  color: "#94a3b8",
                }}
              >
                <span>MACHINE SYSTEMS &middot; European Attachment Engineering Division</span>
                <span>All prices indicative ex-works &middot; Subject to technical review</span>
              </footer>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

export default TiltRotator;
