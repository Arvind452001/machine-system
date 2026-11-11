import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";
import { savedMachinesApi } from "../api/savedMachinesApi";
import { useBasket } from "../context/BasketContext";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from "../utils/alert";

const PAGE_SIZE = 6;

const MyMachines = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToBasket } = useBasket();

  const [activeTab, setActiveTab] = useState("saved"); // "saved" | "catalogue"
  const [savedMachines, setSavedMachines] = useState([]);
  const [catalogueMachines, setCatalogueMachines] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Load customer's saved machines
  const loadSavedMachines = () => {
    setLoadingSaved(true);
    savedMachinesApi
      .getMySavedMachines()
      .then((res) => {
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setSavedMachines(list);
      })
      .catch((err) => {
        console.warn("Could not load saved machines:", err.message);
        setSavedMachines([]);
      })
      .finally(() => {
        setLoadingSaved(false);
      });
  };

  // Load catalogue machines
  const loadCatalogue = () => {
    setLoadingCatalogue(true);
    machinesApi
      .getMachines()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setCatalogueMachines(list);
      })
      .catch((err) => {
        console.warn("Could not load catalogue:", err.message);
        setCatalogueMachines([]);
      })
      .finally(() => {
        setLoadingCatalogue(false);
      });
  };

  useEffect(() => {
    loadSavedMachines();
    loadCatalogue();
  }, []);

  const handleDeleteSaved = async (e, id, configName) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = await showConfirmAlert(
      "Remove Saved Machine",
      `Are you sure you want to remove "${configName || "this configuration"}" from your saved machines?`
    );
    if (!confirmed) return;

    try {
      await savedMachinesApi.deleteSavedMachine(id);
      setSavedMachines((prev) => prev.filter((m) => m._id !== id));
      showSuccessAlert("Removed", "Configuration removed from your saved list.");
    } catch (err) {
      showErrorAlert("Error", "Could not remove configuration: " + err.message);
    }
  };

  const handleAddSavedToBasket = (e, saved) => {
    e.preventDefault();
    e.stopPropagation();

    const baseMachine = saved.machine || {};
    const formattedOptions = (saved.selectedOptions || []).map((o) => ({
      name: o.name || "Option",
      priceDelta: Number(o.priceDelta || 0),
      category: o.category || "options",
      optionId: o.option || o._id,
    }));

    addToBasket(baseMachine, {
      selectedOptions: formattedOptions,
      price: saved.totalPrice || baseMachine.basePrice || 0,
    });

    showSuccessAlert(
      "Added to Basket",
      `"${saved.configurationName || baseMachine.name}" added to your basket.`
    );
    navigate("/basket");
  };

  const currentList = activeTab === "saved" ? savedMachines : catalogueMachines;
  const isLoading = activeTab === "saved" ? loadingSaved : loadingCatalogue;
  const paginatedList = currentList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="customer-content account-hub my-machines-page">
      <div className="page-crumb">
        <Link to="/customer/dashboard">
          <i className="bi bi-arrow-left"></i> My workspace
        </Link>
        <span>/</span>
        <span>My machines</span>
      </div>

      <section className="page-heading">
        <div>
          <div className="eyebrow">
            <span></span> YOUR CONFIGURED PLATFORMS
          </div>
          <h1>
            Machines for <em> your work.</em>
          </h1>
          <p>
            Review custom configurations saved to your account or pick up a new system from the catalogue.
          </p>
        </div>
        <Link className="button button-dark" to="/machines">
          Full catalogue <i className="bi bi-arrow-right"></i>
        </Link>
      </section>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          margin: "0 0 24px",
          borderBottom: "1px solid #e1e6e0",
          paddingBottom: "12px",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("saved");
            setCurrentPage(1);
          }}
          style={{
            background: activeTab === "saved" ? "#173f35" : "#f0f4f1",
            color: activeTab === "saved" ? "#ffffff" : "#435249",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          <i className="bi bi-bookmark-check"></i>
          Saved Builds ({savedMachines.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("catalogue");
            setCurrentPage(1);
          }}
          style={{
            background: activeTab === "catalogue" ? "#173f35" : "#f0f4f1",
            color: activeTab === "catalogue" ? "#ffffff" : "#435249",
            border: "none",
            borderRadius: "6px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
        >
          <i className="bi bi-grid-3x3-gap"></i>
          Explore Catalogue ({catalogueMachines.length})
        </button>
      </div>

      <section className="my-machines-grid">
        {isLoading ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <LoadingSpinner
              text={
                activeTab === "saved"
                  ? "Loading your saved machine configurations..."
                  : "Loading catalogue platforms..."
              }
            />
          </div>
        ) : activeTab === "saved" ? (
          /* TAB 1: SAVED BUILDS */
          savedMachines.length > 0 ? (
            paginatedList.map((s) => {
              const baseMachine = s.machine || {};
              const img =
                baseMachine.images?.[0] ||
                "https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1000&fmt=webp";
              const tag = `${baseMachine.sku || "CUSTOM"} · ${(
                baseMachine.category || "MACHINE"
              ).toUpperCase()}`;
              const price = s.totalPrice
                ? `$${Number(s.totalPrice).toLocaleString()}`
                : baseMachine.basePrice
                ? `$${Number(baseMachine.basePrice).toLocaleString()}`
                : "Contact";

              const optionsCount = Array.isArray(s.selectedOptions)
                ? s.selectedOptions.length
                : 0;

              return (
                <div
                  key={s._id}
                  className="my-machine-card"
                  style={{ position: "relative" }}
                >
                  <div className="my-machine-image">
                    <img src={img} alt={baseMachine.name} loading="lazy" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleDeleteSaved(e, s._id, s.configurationName)
                      }
                      title="Delete saved configuration"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(220, 53, 69, 0.9)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    >
                      <i className="bi bi-trash" style={{ fontSize: "13px" }}></i>
                    </button>
                  </div>
                  <div className="my-machine-copy">
                    <small>
                      {optionsCount > 0
                        ? `${optionsCount} CUSTOM OPTION${
                            optionsCount > 1 ? "S" : ""
                          } ATTACHED`
                        : "STANDARD BUILD"}
                    </small>
                    <h2>{s.configurationName || baseMachine.name}</h2>
                    <p>
                      {s.notes ||
                        baseMachine.summary ||
                        "Custom build saved for rapid requisitioning and quoting."}
                    </p>
                    <div style={{ marginTop: "10px", marginBottom: "14px" }}>
                      <span>
                        Configured: <strong>{price}</strong>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        borderTop: "1px solid #f0f3f1",
                        paddingTop: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleAddSavedToBasket(e, s)}
                        className="button button-lime"
                        style={{
                          fontSize: "12px",
                          padding: "6px 14px",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <i className="bi bi-bag-plus"></i> Add to Basket
                      </button>

                      <Link
                        to={`/configure?machine=${baseMachine.slug || baseMachine._id}`}
                        className="button button-dark"
                        style={{
                          fontSize: "12px",
                          padding: "6px 14px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <i className="bi bi-sliders"></i> Reconfigure
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: "54px 24px",
                textAlign: "center",
                gridColumn: "1 / -1",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e1e6e0",
                color: "#6b7c72",
              }}
            >
              <i
                className="bi bi-bookmark-plus mb-3 d-block"
                style={{ fontSize: "2.8rem", color: "#173f35" }}
              ></i>
              <h3 style={{ color: "#173f35", margin: "0 0 8px" }}>
                No Saved Machine Builds Yet
              </h3>
              <p
                style={{
                  maxWidth: "460px",
                  margin: "0 auto 24px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                When you configure machines and save them to your account, they will appear here with your customized specifications and live pricing ready to requisition.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <Link className="button button-lime" to="/machines">
                  Explore Catalogue <i className="bi bi-arrow-right ms-1"></i>
                </Link>
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => setActiveTab("catalogue")}
                >
                  View Available Platforms
                </button>
              </div>
            </div>
          )
        ) : (
          /* TAB 2: EXPLORE CATALOGUE */
          catalogueMachines.length > 0 ? (
            paginatedList.map((m) => {
              const img =
                m.images?.[0] ||
                "https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1000&fmt=webp";
              const tag = `${m.sku || m.slug?.toUpperCase() || "MS"} · ${(
                m.category || "CNC"
              ).toUpperCase()}`;
              const price = m.basePrice
                ? `$${Number(m.basePrice).toLocaleString()}`
                : "Contact";

              return (
                <div key={m._id || m.slug} className="my-machine-card">
                  <div className="my-machine-image">
                    <img src={img} alt={m.name} loading="lazy" />
                    <span>{tag}</span>
                    <Link
                      to={`/machine-details?id=${m.slug || m._id}`}
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "#fff",
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                  <div className="my-machine-copy">
                    <small>
                      {m.summary || m.category?.toUpperCase() || "PLATFORM"}
                    </small>
                    <h2>{m.name}</h2>
                    <p>
                      {m.description
                        ? m.description.length > 90
                          ? `${m.description.slice(0, 90)}...`
                          : m.description
                        : "Compact, accurate machining platform for flexible production."}
                    </p>
                    <div style={{ marginTop: "8px", marginBottom: "12px" }}>
                      <span>
                        Starting From <strong>{price}</strong>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        borderTop: "1px solid #f0f3f1",
                        paddingTop: "12px",
                      }}
                    >
                      <Link
                        className="button button-lime"
                        to={`/configure?machine=${m.slug || m._id}`}
                        style={{
                          fontSize: "12px",
                          padding: "6px 14px",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <i className="bi bi-sliders"></i> Configure Build
                      </Link>

                      <Link
                        className="button button-dark"
                        to={`/machine-details?id=${m.slug || m._id}`}
                        style={{
                          fontSize: "12px",
                          padding: "6px 14px",
                          textDecoration: "none",
                        }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                gridColumn: "1 / -1",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e1e6e0",
                color: "#6b7c72",
              }}
            >
              <p>No catalogue platforms available at this time.</p>
            </div>
          )
        )}
      </section>

      {/* Pagination */}
      {currentList.length > PAGE_SIZE && (
        <Pagination
          currentPage={currentPage}
          totalItems={currentList.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </main>
  );
};

export default MyMachines;
