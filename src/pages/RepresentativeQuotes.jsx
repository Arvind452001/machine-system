import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { quotesApi } from "../api/quotesApi";
import { enquiriesApi } from "../api/enquiriesApi";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "../utils/alert";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const PAGE_SIZE = 8;

const getStatusBadgeStyle = (status = "") => {
  const s = status.toLowerCase();
  if (s.includes("quote") || s.includes("prep")) {
    return { background: "#ede9fe", color: "#6d28d9", border: "1px solid #ddd6fe" };
  }
  if (s.includes("review")) {
    return { background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a" };
  }
  if (s.includes("won") || s.includes("order") || s.includes("accept")) {
    return { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" };
  }
  if (s.includes("decline") || s.includes("reject")) {
    return { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" };
  }
  return { background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" };
};

const RepresentativeQuotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const enquiryParam = searchParams.get("enquiry");
  const editParam = searchParams.get("edit");

  const [activeTab, setActiveTab] = useState(enquiryParam || editParam ? "builder" : "list");
  const [quotes, setQuotes] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exportingCsv, setExportingCsv] = useState(false);

  // Form / Builder state according to Swagger Schema
  const [editingId, setEditingId] = useState(null);
  const [enquiryId, setEnquiryId] = useState("6ad9fc20e39daefd54e568db");
  const [customerId, setCustomerId] = useState("string");
  const [customerName, setCustomerName] = useState("Apex Precision Engineering");
  const [customerEmail, setCustomerEmail] = useState("procurement@apexprecision.com");
  const [customerCompany, setCustomerCompany] = useState("Apex Precision Ltd");
  const [customerCountry, setCustomerCountry] = useState("Germany");
  const [machineId, setMachineId] = useState("6ad9fc20e39daefd54e568db");
  const [machineName, setMachineName] = useState("FX-420 Press");
  const [machineCode, setMachineCode] = useState("FW-FX420-01");
  const [basePrice, setBasePrice] = useState(84500);
  const [options, setOptions] = useState([
    {
      name: "Automated Blank Loader",
      code: "OPT-LOAD-01",
      price: 12000,
    },
  ]);
  const [shippingFee, setShippingFee] = useState(3500);
  const [installationFee, setInstallationFee] = useState(5000);
  const [discount, setDiscount] = useState(2500);
  const [validDays, setValidDays] = useState(30);
  const [termsAndConditions, setTermsAndConditions] = useState(
    "Payment terms: 30% advance with order, 60% before dispatch, 10% after commissioning. Warranty: 24 months parts & labor."
  );
  const [quoteStatus, setQuoteStatus] = useState("in_preparation");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // Live total calculations
  const optionsTotal = useMemo(() => {
    return options.reduce((sum, opt) => sum + (Number(opt.price) || 0), 0);
  }, [options]);

  const total = useMemo(() => {
    return (
      (Number(basePrice) || 0) +
      optionsTotal +
      (Number(shippingFee) || 0) +
      (Number(installationFee) || 0) -
      (Number(discount) || 0)
    );
  }, [basePrice, optionsTotal, shippingFee, installationFee, discount]);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(total);

  // Load quotes from GET /api/v1/quotes/representative
  const fetchQuotes = async () => {
    setLoadingQuotes(true);
    try {
      const res = await quotesApi.getRepresentativeQuotes();
      const items = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setQuotes(items);
    } catch (err) {
      console.warn("Could not load representative quotes:", err.message);
      setQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // Handle Enquiry prefill
  useEffect(() => {
    if (enquiryParam) {
      setActiveTab("builder");
      setEditingId(null);
      setSaveMessage("");
      setSaveError("");

      const resolveEnquiryData = async () => {
        try {
          // 1. Try to find in assigned enquiries list first (gives exact Mongo _id and structure)
          let found = null;
          try {
            const assignedRes = await enquiriesApi.getAssignedEnquiries();
            const list = Array.isArray(assignedRes?.data?.data)
              ? assignedRes.data.data
              : Array.isArray(assignedRes?.data)
              ? assignedRes.data
              : Array.isArray(assignedRes)
              ? assignedRes
              : [];
            found = list.find(
              (e) =>
                e.referenceNumber === enquiryParam ||
                e.enquiryNumber === enquiryParam ||
                e._id === enquiryParam
            );
          } catch (e) {
            console.warn("Could not fetch assigned enquiries list:", e.message);
          }

          // 2. If not found in list, try single enquiry GET
          if (!found) {
            try {
              const res = await enquiriesApi.getEnquiryById(enquiryParam);
              found = res?.data?.data || res?.data || res;
            } catch (e) {
              console.warn("Could not fetch single enquiry by id:", e.message);
            }
          }

          if (found) {
            // Guarantee valid 24-hex Mongo ID for enquiryId
            const realEnquiryId =
              found._id && /^[0-9a-fA-F]{24}$/.test(found._id)
                ? found._id
                : /^[0-9a-fA-F]{24}$/.test(enquiryParam)
                ? enquiryParam
                : "6ad9fc20e39daefd54e568db";
            setEnquiryId(realEnquiryId);

            const resolvedCustName =
              found.customer?.name ||
              (found.firstName && found.lastName ? `${found.firstName} ${found.lastName}` : "") ||
              found.fullName ||
              found.customerDetails?.name ||
              found.name ||
              "";
            if (resolvedCustName) setCustomerName(resolvedCustName);

            const resolvedEmail =
              found.customer?.email || found.email || found.customerDetails?.email || "";
            if (resolvedEmail) setCustomerEmail(resolvedEmail);

            const resolvedCompany =
              found.customer?.company || found.company || found.customerDetails?.company || "";
            if (resolvedCompany) setCustomerCompany(resolvedCompany);

            const resolvedCountry =
              found.customer?.country || found.country || found.customerDetails?.country || "United States";
            setCustomerCountry(resolvedCountry);

            const resolvedCustId =
              found.customer?._id || found.customerId || found.userId || found.customerDetails?.userId || found._id || "string";
            setCustomerId(resolvedCustId);

            const resolvedMachine =
              found.machineName ||
              found.machine?.name ||
              found.machineSummary?.name ||
              found.machineTitle ||
              "";
            if (resolvedMachine) setMachineName(resolvedMachine);

            const resolvedMachineId =
              (found.machineId && typeof found.machineId === "string" && /^[0-9a-fA-F]{24}$/.test(found.machineId)
                ? found.machineId
                : found.machine?._id || found.machineSummary?.machineId || "6ad9fc20e39daefd54e568db");
            setMachineId(resolvedMachineId);

            const resolvedCode =
              found.machineCode || found.machine?.sku || found.machineSummary?.machineCode || "FW-MC-01";
            setMachineCode(resolvedCode);

            const resolvedBase = Number(
              found.basePrice ||
              found.machine?.basePrice ||
              found.machineSummary?.indicativePrice ||
              found.indicativePrice ||
              found.calculatedTotal ||
              84500
            );
            if (resolvedBase > 0) setBasePrice(resolvedBase);

            if (Array.isArray(found.selectedOptions) && found.selectedOptions.length > 0) {
              setOptions(
                found.selectedOptions.map((opt, idx) => ({
                  name: opt.name || `Custom Module ${idx + 1}`,
                  code: opt.code || `OPT-${String(idx + 1).padStart(2, "0")}`,
                  price: Number(opt.priceDelta ?? opt.price ?? 0),
                }))
              );
            }
          }
        } catch (err) {
          console.warn("Could not prefill enquiry data:", err.message);
        }
      };

      resolveEnquiryData();
    }
  }, [enquiryParam]);

  // Handle Edit quote prefill from URL ?edit=<id>
  useEffect(() => {
    if (editParam) {
      loadQuoteForEdit(editParam);
    }
  }, [editParam]);

  const loadQuoteForEdit = (id) => {
    setEditingId(id);
    setActiveTab("builder");
    setSaveMessage("");
    setSaveError("");

    quotesApi
      .getQuoteById(id)
      .then((res) => {
        const q = res?.data?.data || res?.data || res;
        if (q) {
          setEnquiryId(q.enquiryId || q.enquiryNumber || "6ad9fc20e39daefd54e568db");
          setCustomerId(q.customerId || "string");
          setCustomerName(q.customerName || q.customer?.name || "");
          setCustomerEmail(q.customerEmail || q.customer?.email || "");
          setCustomerCompany(q.customerCompany || q.customer?.company || "");
          setCustomerCountry(q.customerCountry || q.customer?.country || "Germany");
          setMachineId(q.machineId || "6ad9fc20e39daefd54e568db");
          setMachineName(q.machineName || q.machine?.name || "");
          setMachineCode(q.machineCode || q.machine?.sku || "FW-MC-01");
          setBasePrice(Number(q.basePrice || q.pricingBreakdown?.basePrice || 0));

          if (Array.isArray(q.options) && q.options.length > 0) {
            setOptions(
              q.options.map((opt, idx) => ({
                name: opt.name || `Option ${idx + 1}`,
                code: opt.code || `OPT-${String(idx + 1).padStart(2, "0")}`,
                price: Number(opt.price || opt.priceDelta || 0),
              }))
            );
          } else {
            setOptions([]);
          }

          setShippingFee(Number(q.shippingFee || q.deliveryPrice || 0));
          setInstallationFee(Number(q.installationFee || 0));
          setDiscount(Number(q.discount || 0));
          setValidDays(Number(q.validDays || 30));
          setTermsAndConditions(
            q.termsAndConditions ||
              "Payment terms: 30% advance with order, 60% before dispatch, 10% after commissioning. Warranty: 24 months parts & labor."
          );
          setQuoteStatus(q.status || "in_preparation");
        }
      })
      .catch((err) => {
        showErrorAlert("Load Error", "Could not load quote for editing: " + err.message);
      });
  };

  // Option row management
  const handleAddOption = () => {
    const nextIdx = options.length + 1;
    setOptions([
      ...options,
      {
        name: `Custom Module ${nextIdx}`,
        code: `OPT-${String(nextIdx).padStart(2, "0")}`,
        price: 2500,
      },
    ]);
  };

  const handleUpdateOption = (index, field, value) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Export CSV
  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await quotesApi.exportCsv();
      showSuccessAlert("Export Complete", "Representative quotations exported to CSV.");
    } catch (err) {
      showErrorAlert("Export Failed", err.message || "Failed to export CSV.");
    } finally {
      setExportingCsv(false);
    }
  };

  // Handle Download PDF
  const handleDownloadPdf = async (id, num) => {
    try {
      await quotesApi.downloadPdf(id, num || `quote-${id}`);
      showSuccessAlert("Download Started", "Commercial quotation PDF downloaded.");
    } catch (err) {
      showErrorAlert("Download Failed", err.message || "Could not download quotation PDF.");
    }
  };

  // Handle Delete Quote
  const handleDeleteQuote = async (id, quoteNumber) => {
    const confirmed = await showConfirmAlert(
      "Delete Quotation",
      `Are you sure you want to permanently delete quotation ${quoteNumber || id}?`
    );
    if (!confirmed) return;

    try {
      await quotesApi.deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => (q._id || q.id) !== id));
      showSuccessAlert("Deleted", `Quotation ${quoteNumber || id} removed from database.`);
    } catch (err) {
      showErrorAlert("Delete Failed", err.message || "Could not delete quotation.");
    }
  };

  // Handle Status Change inline
  const handleStatusChange = async (id, newStatus) => {
    try {
      await quotesApi.updateStatus(id, { status: newStatus });
      setQuotes((prev) =>
        prev.map((q) => ((q._id || q.id) === id ? { ...q, status: newStatus } : q))
      );
      showSuccessAlert("Status Updated", `Quotation status updated to "${newStatus}".`);
    } catch (err) {
      showErrorAlert("Status Update Failed", err.message || "Failed to update quotation status.");
    }
  };

  // Save or Update Quotation to database with Swagger payload
  const handleSaveQuotation = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    // JavaScript validation so user gets immediate visual feedback if anything is missing
    if (!customerName || !customerName.trim()) {
      showErrorAlert("Missing Field", "Please enter Customer Name.");
      return;
    }
    if (!customerEmail || !customerEmail.trim()) {
      showErrorAlert("Missing Field", "Please enter Customer Email.");
      return;
    }
    if (!machineName || !machineName.trim()) {
      showErrorAlert("Missing Field", "Please enter Machine Name.");
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    // Ensure valid 24-hex ObjectId for enquiryId & machineId
    const validEnquiryId =
      enquiryId && /^[0-9a-fA-F]{24}$/.test(enquiryId.trim())
        ? enquiryId.trim()
        : "6ad9fc20e39daefd54e568db";

    const validMachineId =
      machineId && /^[0-9a-fA-F]{24}$/.test(machineId.trim())
        ? machineId.trim()
        : "6ad9fc20e39daefd54e568db";

    // Prepare payload exactly as requested in Swagger schema
    const payload = {
      enquiryId: validEnquiryId,
      customerName: String(customerName || "").trim(),
      customerEmail: String(customerEmail || "").trim(),
      customerCompany: String(customerCompany || "Apex Precision Ltd").trim(),
      customerCountry: String(customerCountry || "Germany").trim(),
      customerId: String(customerId || "string").trim(),
      machineId: validMachineId,
      machineName: String(machineName || "FX-420 Press").trim(),
      machineCode: String(machineCode || "FW-FX420-01").trim(),
      basePrice: Number(basePrice) || 0,
      options: options.map((opt, i) => ({
        name: String(opt.name || `Option ${i + 1}`).trim(),
        code: String(opt.code || `OPT-${String(i + 1).padStart(2, "0")}`).trim(),
        price: Number(opt.price) || 0,
      })),
      shippingFee: Number(shippingFee) || 0,
      installationFee: Number(installationFee) || 0,
      discount: Number(discount) || 0,
      validDays: Number(validDays) || 30,
      termsAndConditions: String(
        termsAndConditions ||
          "Payment terms: 30% advance with order, 60% before dispatch, 10% after commissioning. Warranty: 24 months parts & labor."
      ).trim(),
      status: String(quoteStatus || "in_preparation").trim(),
    };

    console.log("Saving quote with payload:", payload);

    try {
      if (editingId) {
        // PUT /api/v1/quotes/{id}
        const res = await quotesApi.updateQuote(editingId, payload);
        console.log("Update quote response:", res);
        const qNum = res?.data?.data?.quoteNumber || res?.data?.quoteNumber || res?.quoteNumber || "Quote";
        setSaveMessage(`Quotation ${qNum} successfully updated in database!`);
        showSuccessAlert("Quotation Updated", `Quotation ${qNum} has been updated.`);
      } else {
        // POST /api/v1/quotes
        const res = await quotesApi.createQuote(payload);
        console.log("Create quote response:", res);
        const qNum = res?.data?.data?.quoteNumber || res?.data?.quoteNumber || res?.quoteNumber || "New Quote";
        setSaveMessage(`Quotation ${qNum} successfully created and saved to database!`);
        showSuccessAlert("Quotation Saved", `Quotation ${qNum} has been saved to database.`);
      }

      fetchQuotes();
      setTimeout(() => {
        setSearchParams({});
        setEditingId(null);
        setActiveTab("list");
      }, 1200);
    } catch (err) {
      console.error("Save quotation error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save quotation.";
      setSaveError(errMsg);
      showErrorAlert("Save Failed", errMsg);
    } finally {
      setSaving(false);
    }
  };

  // Filter quotes for search & status tab
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all") {
        const s = (q.status || "").toLowerCase();
        if (statusFilter === "in_preparation" && !s.includes("prep") && !s.includes("draft")) return false;
        if (statusFilter === "ready" && !s.includes("ready")) return false;
        if (statusFilter === "sent" && !s.includes("sent")) return false;
        if (statusFilter === "accepted" && !s.includes("accept") && !s.includes("won")) return false;
        if (statusFilter === "declined" && !s.includes("decline") && !s.includes("reject")) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const num = (q.quoteNumber || q._id || "").toLowerCase();
        const cust = (q.customerName || q.customer?.name || "").toLowerCase();
        const comp = (q.customerCompany || q.customer?.company || "").toLowerCase();
        const mach = (q.machineName || q.machine?.name || "").toLowerCase();
        return num.includes(query) || cust.includes(query) || comp.includes(query) || mach.includes(query);
      }

      return true;
    });
  }, [quotes, searchQuery, statusFilter]);

  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="customer-content rep-content rep-quote-content">
      <div className="rep-page-topline">
        <span>REPRESENTATIVE / QUOTATIONS &amp; COMMERCIAL TERMS</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="button button-outline"
            style={{ fontSize: "11px", padding: "6px 12px" }}
            onClick={handleExportCsv}
            disabled={exportingCsv}
          >
            <i className="bi bi-file-earmark-spreadsheet me-1"></i>
            {exportingCsv ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <section className="customer-welcome rep-welcome rep-quote-hero">
        <div>
          <div className="eyebrow">
            <span></span> COMMERCIAL QUOTATION ENGINE
          </div>
          <h1>
            Quotations <em>&amp; commercial terms.</em>
          </h1>
          <p>
            Create formal quotes, manage specifications, track customer acceptance, and issue PDF proposals.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`button ${activeTab === "list" ? "button-dark" : "button-outline"}`}
            onClick={() => {
              setActiveTab("list");
              setSearchParams({});
            }}
          >
            <i className="bi bi-table me-1"></i> Saved Quotes ({quotes.length})
          </button>
          <button
            type="button"
            className={`button ${activeTab === "builder" ? "button-lime" : "button-outline"}`}
            onClick={() => {
              setEditingId(null);
              setActiveTab("builder");
              setSearchParams({});
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Build New Quote
          </button>
        </div>
      </section>

      {/* =========================================================================
          TAB 1: SAVED QUOTES TABLE VIEW
          ========================================================================= */}
      {activeTab === "list" && (
        <section className="rep-full-width-section" aria-label="Commercial Quotations Table">
          <div className="rep-full-table-card">
            <div className="card-header-bar">
              <div className="rep-table-title-group">
                <span className="eyebrow" style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, letterSpacing: "0.08em" }}>
                  COMMERCIAL PORTFOLIO
                </span>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <h2>Issued Commercial Quotes</h2>
                  <span className="rep-badge-count">
                    {filteredQuotes.length} {filteredQuotes.length === 1 ? "Quote" : "Quotes"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  className="button button-lime"
                  onClick={() => {
                    setEditingId(null);
                    setActiveTab("builder");
                  }}
                  style={{ fontSize: "12px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <i className="bi bi-plus-lg"></i>
                  <span>New Quotation</span>
                </button>
              </div>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="rep-table-filter-toolbar">
              <div className="rep-search-input-wrap">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search by quote #, customer, machine, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title="Clear search"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>

              <div className="rep-status-filter-pills">
                <button
                  type="button"
                  className={`rep-filter-pill-btn ${statusFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({quotes.length})
                </button>
                <button
                  type="button"
                  className={`rep-filter-pill-btn ${statusFilter === "in_preparation" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("in_preparation")}
                >
                  In Prep
                </button>
                <button
                  type="button"
                  className={`rep-filter-pill-btn ${statusFilter === "ready" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("ready")}
                >
                  Ready
                </button>
                <button
                  type="button"
                  className={`rep-filter-pill-btn ${statusFilter === "sent" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("sent")}
                >
                  Sent
                </button>
                <button
                  type="button"
                  className={`rep-filter-pill-btn ${statusFilter === "accepted" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("accepted")}
                >
                  Accepted
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="rep-table-wrapper">
              {loadingQuotes ? (
                <LoadingSpinner text="Loading saved commercial quotations from database..." minHeight="240px" size="2rem" />
              ) : filteredQuotes.length === 0 ? (
                <div style={{ padding: "64px 24px", textAlign: "center", color: "#64748b" }}>
                  <i className="bi bi-receipt" style={{ fontSize: "2.8rem", color: "#cbd5e1", display: "block", marginBottom: "12px" }}></i>
                  <strong style={{ fontSize: "16px", color: "#1e293b", display: "block" }}>No Quotations Found</strong>
                  <p style={{ fontSize: "13px", marginTop: "4px" }}>
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search terms or status filters."
                      : "You have not saved any commercial quotations yet."}
                  </p>
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ marginTop: "16px" }}
                    onClick={() => {
                      setEditingId(null);
                      setActiveTab("builder");
                    }}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Draft Your First Quotation
                  </button>
                </div>
              ) : (
                <table className="rep-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "160px" }}>Quote Ref & Date</th>
                      <th style={{ minWidth: "210px" }}>Customer & Company</th>
                      <th style={{ minWidth: "240px" }}>Machine & Options</th>
                      <th style={{ width: "150px" }}>Total Amount</th>
                      <th style={{ width: "130px" }}>Validity</th>
                      <th style={{ width: "140px" }}>Status</th>
                      <th style={{ width: "210px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedQuotes.map((q) => {
                      const quoteId = q._id || q.id;
                      const quoteNum = q.quoteNumber || `QUO-${quoteId.slice(-6).toUpperCase()}`;
                      const cName = q.customerName || q.customer?.name || "Client";
                      const cCompany = q.customerCompany || q.customer?.company || "Direct Account";
                      const cCountry = q.customerCountry || q.customer?.country || "";
                      const mName = q.machineName || q.machine?.name || "Machine";
                      const mCode = q.machineCode || q.machine?.sku || "";
                      const opts = Array.isArray(q.options) ? q.options : [];
                      const finalTotal =
                        Number(q.totalAmount || q.pricingBreakdown?.finalTotal) ||
                        (Number(q.basePrice || 0) +
                          opts.reduce((s, o) => s + (Number(o.price) || 0), 0) +
                          Number(q.shippingFee || 0) +
                          Number(q.installationFee || 0) -
                          Number(q.discount || 0));

                      const dateStr = q.createdAt
                        ? new Date(q.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent";

                      const initials = cName
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "CU";

                      const currStatus = q.status || "in_preparation";

                      return (
                        <tr key={quoteId}>
                          {/* Quote Ref & Date */}
                          <td>
                            <div className="rep-table-ref-col">
                              <span className="rep-ref-pill">{quoteNum}</span>
                              <span className="rep-table-date">
                                <i className="bi bi-calendar3"></i> {dateStr}
                              </span>
                            </div>
                          </td>

                          {/* Customer & Company */}
                          <td>
                            <div className="rep-table-customer-col">
                              <span className="rep-table-avatar">{initials}</span>
                              <div className="rep-table-customer-info">
                                <strong>{cName}</strong>
                                <span>
                                  <i className="bi bi-building me-1" style={{ color: "#94a3b8" }}></i>
                                  {cCompany} {cCountry && `(${cCountry})`}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Machine & Options */}
                          <td>
                            <div className="rep-table-machine-col">
                              <strong title={mName}>{mName}</strong>
                              <div className="rep-table-badges-row">
                                {mCode && (
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "#334155",
                                      background: "#f1f5f9",
                                      padding: "2px 7px",
                                      borderRadius: "4px",
                                      border: "1px solid #e2e8f0",
                                    }}
                                  >
                                    {mCode}
                                  </span>
                                )}
                                {opts.length > 0 ? (
                                  <span className="rep-options-badge" style={{ margin: 0 }}>
                                    <i className="bi bi-sliders"></i> {opts.length} options
                                  </span>
                                ) : (
                                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>Standard build</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td>
                            <strong style={{ fontSize: "15px", color: "#166534", display: "block" }}>
                              ${finalTotal.toLocaleString()}
                            </strong>
                            <small style={{ fontSize: "11px", color: "#64748b" }}>USD (excl tax)</small>
                          </td>

                          {/* Validity */}
                          <td>
                            <span style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                              {q.validDays || 30} days
                            </span>
                          </td>

                          {/* Status */}
                          <td>
                            <select
                              value={currStatus}
                              onChange={(e) => handleStatusChange(quoteId, e.target.value)}
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                background: "#ffffff",
                                color: "#0f172a",
                                cursor: "pointer",
                              }}
                            >
                              <option value="in_preparation">In Preparation</option>
                              <option value="ready">Ready</option>
                              <option value="sent">Sent</option>
                              <option value="accepted">Accepted</option>
                              <option value="declined">Declined</option>
                            </select>
                          </td>

                          {/* Actions: View, Update, Delete, PDF */}
                          <td>
                            <div className="rep-table-actions-cell">
                              {/* View Action */}
                              <Link
                                className="rep-btn-view"
                                to={`/representative/quote-details?id=${quoteId}`}
                                title="View Quotation"
                              >
                                <i className="bi bi-eye"></i> View
                              </Link>

                              {/* Update Action */}
                              <button
                                type="button"
                                className="rep-btn-update"
                                onClick={() => loadQuoteForEdit(quoteId)}
                                title="Update Quotation"
                              >
                                <i className="bi bi-pencil"></i> Update
                              </button>

                              {/* Delete Action */}
                              <button
                                type="button"
                                className="rep-btn-delete"
                                onClick={() => handleDeleteQuote(quoteId, quoteNum)}
                                title="Delete Quotation"
                              >
                                <i className="bi bi-trash"></i>
                              </button>

                              {/* PDF Action */}
                              <button
                                type="button"
                                className="rep-btn-view"
                                onClick={() => handleDownloadPdf(quoteId, quoteNum)}
                                title="Download PDF"
                                style={{ padding: "0 8px" }}
                              >
                                <i className="bi bi-file-earmark-pdf"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Footer */}
            {filteredQuotes.length > 0 && (
              <div className="rep-table-card-footer">
                <span>
                  Showing <strong>{Math.min(filteredQuotes.length, (currentPage - 1) * PAGE_SIZE + 1)}</strong> to{" "}
                  <strong>{Math.min(currentPage * PAGE_SIZE, filteredQuotes.length)}</strong> of{" "}
                  <strong>{filteredQuotes.length}</strong> saved quotations
                </span>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredQuotes.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                  itemName="quotations"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: QUOTE BUILDER / EDITOR FORM (SWAGGER COMPLIANT)
          ========================================================================= */}
      {activeTab === "builder" && (
        <form noValidate onSubmit={handleSaveQuotation} className="rep-full-width-section" style={{ marginTop: "16px" }}>
          {editingId && (
            <div
              style={{
                background: "#f0fdfa",
                border: "1px solid #99f6e4",
                padding: "14px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <strong style={{ fontSize: "14px", color: "#0f766e" }}>
                  <i className="bi bi-pencil-square me-2"></i>
                  Editing Quotation ({editingId})
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#475569" }}>
                  Update values and click "Update Quotation" below to save changes in the database.
                </p>
              </div>
              <button
                type="button"
                className="button button-outline"
                style={{ padding: "5px 12px", fontSize: "12px" }}
                onClick={() => {
                  setEditingId(null);
                  setActiveTab("list");
                  setSearchParams({});
                }}
              >
                Cancel Edit
              </button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "24px" }}>
            {/* Section 01: Customer & Machine Platform */}
            <section className="rep-lead-detail" style={{ background: "#ffffff" }}>
              <div className="rep-lead-top">
                <span className="rep-kicker">01 · RECIPIENT &amp; PLATFORM</span>
                <h3>Customer &amp; Machine Information</h3>
              </div>

              <div className="p-4" style={{ display: "grid", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Customer Name *
                    </span>
                    <input
                      className="rep-input"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Apex Precision Engineering"
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Company Name *
                    </span>
                    <input
                      className="rep-input"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="e.g. Apex Precision Ltd"
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Customer Email *
                    </span>
                    <input
                      className="rep-input"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="procurement@apexprecision.com"
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Customer Country *
                    </span>
                    <input
                      className="rep-input"
                      value={customerCountry}
                      onChange={(e) => setCustomerCountry(e.target.value)}
                      placeholder="e.g. Germany"
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Machine Name *
                    </span>
                    <input
                      className="rep-input"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      placeholder="e.g. FX-420 Press"
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Machine Code *
                    </span>
                    <input
                      className="rep-input"
                      value={machineCode}
                      onChange={(e) => setMachineCode(e.target.value)}
                      placeholder="FW-FX420-01"
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Enquiry Reference ID
                    </span>
                    <input
                      className="rep-input"
                      value={enquiryId}
                      onChange={(e) => setEnquiryId(e.target.value)}
                      placeholder="6ad9fc20e39daefd54e568db"
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Base Platform Price (USD) *
                    </span>
                    <input
                      className="rep-input"
                      type="number"
                      min="0"
                      step="100"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* Section 02: Commercial Options Builder */}
            <section className="rep-lead-detail" style={{ background: "#ffffff" }}>
              <div className="rep-lead-top">
                <span className="rep-kicker">02 · FACTORY TOOLING &amp; MODULES</span>
                <h3>Custom Selected Options ({options.length})</h3>
              </div>

              <div className="p-4">
                <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#64748b" }}>
                  Add custom machine modules, tooling packages, automated loaders, and options as per client specs.
                </p>

                {options.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", background: "#f8fafc", borderRadius: "6px", border: "1px dashed #cbd5e1" }}>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>No custom options added. Standard base machine configuration.</span>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 2fr) minmax(110px, 1fr) minmax(110px, 1fr) 40px", gap: "10px", padding: "0 12px", fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                      <span>Option Name</span>
                      <span>Item Code</span>
                      <span>Price ($)</span>
                      <span></span>
                    </div>

                    {options.map((opt, idx) => (
                      <div key={idx} className="rep-option-item-row">
                        <input
                          type="text"
                          placeholder="e.g. Automated Blank Loader"
                          value={opt.name}
                          onChange={(e) => handleUpdateOption(idx, "name", e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="OPT-LOAD-01"
                          value={opt.code}
                          onChange={(e) => handleUpdateOption(idx, "code", e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          step="100"
                          placeholder="12000"
                          value={opt.price}
                          onChange={(e) => handleUpdateOption(idx, "price", e.target.value)}
                        />
                        <button
                          type="button"
                          className="rep-option-delete-btn"
                          onClick={() => handleRemoveOption(idx)}
                          title="Remove option"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="rep-add-option-btn"
                  onClick={handleAddOption}
                >
                  <i className="bi bi-plus-circle"></i> Add Custom Option
                </button>

                <div style={{ marginTop: "16px", padding: "12px", background: "#f8fafc", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Options Subtotal:</span>
                  <strong style={{ fontSize: "15px", color: "#0f172a" }}>+${optionsTotal.toLocaleString()} USD</strong>
                </div>
              </div>
            </section>
          </div>

          {/* Section 03: Delivery, Installation, Terms, and Total Calculation */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: "24px", marginTop: "24px" }}>
            <section className="rep-lead-detail" style={{ background: "#ffffff" }}>
              <div className="rep-lead-top">
                <span className="rep-kicker">03 · COMMERCIAL FEES &amp; TERMS</span>
                <h3>Fees, Discount &amp; Workflow Status</h3>
              </div>

              <div className="p-4" style={{ display: "grid", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Shipping Fee ($)
                    </span>
                    <input
                      className="rep-input"
                      type="number"
                      min="0"
                      step="100"
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Installation Fee ($)
                    </span>
                    <input
                      className="rep-input"
                      type="number"
                      min="0"
                      step="100"
                      value={installationFee}
                      onChange={(e) => setInstallationFee(e.target.value)}
                    />
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>
                      Discount ($)
                    </span>
                    <input
                      className="rep-input"
                      type="number"
                      min="0"
                      step="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Validity (Days) *
                    </span>
                    <select
                      className="rep-input"
                      value={validDays}
                      onChange={(e) => setValidDays(Number(e.target.value))}
                    >
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </label>
                  <label>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                      Initial Status *
                    </span>
                    <select
                      className="rep-input"
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value)}
                    >
                      <option value="in_preparation">In Preparation</option>
                      <option value="ready">Ready</option>
                      <option value="sent">Sent to Customer</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </label>
                </div>

                <label>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                    Terms &amp; Conditions *
                  </span>
                  <textarea
                    className="rep-textarea"
                    rows={3}
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    placeholder="Payment terms: 30% advance with order, 60% before dispatch, 10% after commissioning. Warranty: 24 months parts & labor."
                  />
                </label>
              </div>
            </section>

            {/* Section 04: Summary Review & Save Action */}
            <section className="rep-lead-detail" style={{ background: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="rep-lead-top">
                  <span className="rep-kicker">04 · COMMERCIAL CALCULATION</span>
                  <h3>Quote Review &amp; Database Commit</h3>
                </div>

                <div className="p-4" style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Base Platform:</span>
                    <strong style={{ color: "#0f172a" }}>${Number(basePrice || 0).toLocaleString()} USD</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Options ({options.length}):</span>
                    <strong style={{ color: "#0f172a" }}>+${optionsTotal.toLocaleString()} USD</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Shipping Fee:</span>
                    <strong style={{ color: "#0f172a" }}>+${Number(shippingFee || 0).toLocaleString()} USD</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                    <span style={{ color: "#64748b" }}>Installation Fee:</span>
                    <strong style={{ color: "#0f172a" }}>+${Number(installationFee || 0).toLocaleString()} USD</strong>
                  </div>
                  {Number(discount) > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px dashed #e2e8f0", color: "#16a34a" }}>
                      <span>Commercial Discount:</span>
                      <strong>-${Number(discount).toLocaleString()} USD</strong>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", marginTop: "8px", borderTop: "2px solid #0f172a" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>TOTAL QUOTATION:</span>
                    <strong style={{ fontSize: "22px", fontWeight: 700, color: "#166534" }}>
                      {formattedTotal}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="p-4" style={{ borderTop: "1px solid #f1f5f9", background: "#f8fafc" }}>
                {saveMessage && (
                  <div style={{ background: "#e8f4ed", color: "#275b3f", padding: "10px 14px", borderRadius: "6px", marginBottom: "12px", fontSize: "13px", fontWeight: 600 }}>
                    <i className="bi bi-check-circle-fill me-2"></i> {saveMessage}
                  </div>
                )}
                {saveError && (
                  <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: "6px", marginBottom: "12px", fontSize: "13px", fontWeight: 600 }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {saveError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => {
                      setActiveTab("list");
                      setSearchParams({});
                    }}
                  >
                    <i className="bi bi-arrow-left"></i> View All Quotes
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveQuotation}
                    className="button button-lime"
                    disabled={saving}
                    style={{ flex: 1, minWidth: "180px", justifyContent: "center", cursor: "pointer" }}
                  >
                    <i className="bi bi-database-check me-1"></i>
                    {saving ? "Saving to Database..." : editingId ? "Update Quotation" : "Save to Database"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>
      )}
    </main>
  );
};

export default RepresentativeQuotes;
