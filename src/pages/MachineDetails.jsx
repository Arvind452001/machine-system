import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";
import { BASE_URL } from "../api/axiosInstance";

// Helper to resolve full URL or half URL conditionally
export const resolveImageUrl = (img, fallback) => {
  const defaultFallback =
    fallback ||
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
  if (!img) return defaultFallback;
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

const MachineDetails = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedMachines, setRelatedMachines] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Extract ID or Slug from ?id= or ?slug= or #hash
  const targetIdOrSlug =
    searchParams.get("id") ||
    searchParams.get("slug") ||
    location.hash.replace("#", "") ||
    "ms-m500";

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    machinesApi
      .getMachine(targetIdOrSlug)
      .then((res) => {
        if (mounted && res) {
          const machineData = res.data || res;
          setMachine(machineData);
          setSelectedImageIndex(0);
        }
      })
      .catch((err) => {
        console.warn("Could not load machine details:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [targetIdOrSlug]);

  useEffect(() => {
    let mounted = true;
    setLoadingRelated(true);
    machinesApi
      .getMachines({ limit: 6 })
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        const filtered = list.filter(
          (m) => m && m._id !== targetIdOrSlug && m.slug !== targetIdOrSlug
        );
        setRelatedMachines(filtered.slice(0, 3));
      })
      .catch((err) => {
        console.warn("Could not fetch related machines:", err.message);
      })
      .finally(() => {
        if (mounted) setLoadingRelated(false);
      });

    return () => {
      mounted = false;
    };
  }, [targetIdOrSlug]);

  const machineName = machine?.name || targetIdOrSlug;
  const machineSku =
    machine?.sku || machine?.slug?.toUpperCase() || "MD-2020";
  const machineCategory = (machine?.category || "Industrial").toUpperCase();

  const basePrice =
    machine?.basePrice != null ? Number(machine.basePrice) : 0;
  const machinePrice =
    machine?.basePrice != null
      ? `$${basePrice.toLocaleString()}`
      : "Contact";

  const rawImages =
    machine?.images && machine.images.length > 0
      ? machine.images
      : [
          "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        ];
  const imagesList = rawImages.map((img) => resolveImageUrl(img));
  const activeImage = imagesList[selectedImageIndex] || imagesList[0];

  const machineTagline =
    machine?.summary ||
    machine?.description?.slice(0, 120) ||
    "Production-ready system with room to make them your own.";
  const machineDescription =
    machine?.description ||
    machine?.summary ||
    "Precision industrial production system engineered for dependable high-accuracy production.";

  const specsList =
    machine?.specifications && Object.keys(machine.specifications).length > 0
      ? Object.entries(machine.specifications)
      : [
          ["Model SKU", machineSku],
          ["Category", machineCategory],
          ["Base Currency", machine?.currency || "USD"],
          ["System Status", (machine?.status || machine?.publicationStatus || "Published").toUpperCase()],
        ];

  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/machines">
            <i className="bi bi-arrow-left"></i> All machines
          </Link>
          <span>/</span>
          <span>{machineName}</span>
        </div>
        <div className="container">
          <section className="machine-details-hero row align-items-end g-4">
            <div className="col-lg-8">
              <div className="eyebrow">
                <span></span> MACHINE SYSTEMS PLATFORM
              </div>
              <h1>
                Find your <em> production system.</em>
              </h1>
              <p>
                Compare machine specifications, starting prices, and application
                details. Choose a platform to configure it for your production
                needs.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link className="button button-dark" to="/machines">
                Browse all machines <i className="bi bi-arrow-up-right"></i>
              </Link>
            </div>
          </section>

          <section
            aria-labelledby="machine-title"
            className="machine-static-detail"
            id="machine-focus"
            style={{ display: "block" }}
          >
            {loading ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#6b7c72",
                  background: "#fff",
                  border: "1px solid #e1e6e0",
                  borderRadius: "15px",
                  marginBottom: "27px",
                }}
              >
                <div
                  className="spinner-border text-secondary mb-3"
                  role="status"
                  style={{ width: "2rem", height: "2rem" }}
                ></div>
                <div>Loading machine details...</div>
              </div>
            ) : !machine ? (
              <div
                style={{
                  padding: "60px 20px",
                  textAlign: "center",
                  color: "#6b7c72",
                  background: "#fff",
                  border: "1px solid #e1e6e0",
                  borderRadius: "15px",
                  marginBottom: "27px",
                }}
              >
                <i
                  className="bi bi-exclamation-circle text-warning mb-3 d-block"
                  style={{ fontSize: "2.5rem" }}
                ></i>
                <h3 style={{ color: "#173f35" }}>Machine Not Found</h3>
                <p style={{ maxWidth: "480px", margin: "8px auto 24px" }}>
                  The requested machine could not be retrieved from the catalog.
                </p>
                <Link className="button button-dark" to="/machines">
                  Browse All Machines <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            ) : (
              <article className="machine-profile row g-0">
                <div className="col-lg-6 machine-profile-visual">
                  <img
                    alt={machineName}
                    src={
                      activeImage.startsWith("http://") || activeImage.startsWith("https://")
                        ? activeImage
                        : `${BASE_URL}${activeImage.startsWith("/") ? "" : "/"}${activeImage}`
                    }
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <span className="machine-profile-label">
                    {machineSku} <i></i> {machineCategory}
                  </span>

                  {imagesList.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        zIndex: 2,
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      {imagesList.map((img, idx) => {
                        const imgSrc =
                          img.startsWith("http://") || img.startsWith("https://")
                            ? img
                            : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImageIndex(idx)}
                            style={{
                              width: "36px",
                              height: "36px",
                              padding: 0,
                              borderRadius: "4px",
                              overflow: "hidden",
                              border:
                                selectedImageIndex === idx
                                  ? "2px solid #bd4c2e"
                                  : "1px solid rgba(255,255,255,0.7)",
                              cursor: "pointer",
                              background: "#000",
                            }}
                          >
                            <img
                              src={imgSrc}
                              alt=""
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                position: "static",
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="col-lg-6 machine-profile-copy">
                  <div className="machine-profile-kicker">
                    {machineCategory} / {machineSku}
                  </div>
                  <h2 id="machine-title">{machineName}</h2>
                  <p className="machine-profile-tagline">{machineTagline}</p>
                  <p className="machine-profile-description">
                    {machineDescription}
                  </p>
                  <div className="machine-spec-grid row g-2">
                    {specsList.map(([key, val]) => (
                      <div className="col-6" key={key}>
                        <span>{key.toUpperCase()}</span>
                        <strong>{val}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="machine-commerce-price">
                    <span>INDICATIVE STARTING PRICE · USD</span>
                    <strong>{machinePrice}</strong>
                    <small>
                      Final price confirmed after options and application
                      review.
                    </small>
                  </div>

                  <div className="machine-commerce-actions">
                    <Link
                      className="button button-lime"
                      to={`/configure?machine=${
                        machine?.slug || targetIdOrSlug
                      }`}
                    >
                      <i className="bi bi-sliders"></i> Configure options
                    </Link>
                    <Link
                      className="button button-dark"
                      to={`/enquiry?machine=${encodeURIComponent(
                        machineName
                      )}&price=${basePrice}&sku=${encodeURIComponent(
                        machineSku
                      )}&machineId=${encodeURIComponent(machine?._id || "")}`}
                      state={{
                        machineId: machine?._id || "",
                        machineName,
                        machineCode: machineSku,
                        calculatedTotal: basePrice,
                        selectedOptions: [],
                      }}
                      onClick={() => {
                        try {
                          localStorage.setItem(
                            "machine_configured_enquiry",
                            JSON.stringify({
                              machineId: machine?._id || "",
                              machineName,
                              machineCode: machineSku,
                              calculatedTotal: basePrice,
                              selectedOptions: [],
                            })
                          );
                        } catch (e) {
                          // ignore
                        }
                      }}
                    >
                      Enquiry Now <i className="bi bi-chat-dots"></i>
                    </Link>
                  </div>

                  <div className="machine-commerce-note">
                    <span>
                      <i className="bi bi-check-circle"></i> Quote reviewed by a
                      machine specialist
                    </span>
                    <span>
                      <i className="bi bi-truck"></i> Delivery and installation
                      planned with your team
                    </span>
                  </div>
                </div>
              </article>
            )}

            <div className="machine-information row g-4">
              <div className="col-lg-5">
                <div className="machine-information-panel">
                  <div className="machine-profile-kicker">APPLICATION FIT</div>
                  <h3>Where {machineName} fits your work</h3>
                  <p>
                    {machineTagline} Ideal for facilities demanding high
                    repeatability, continuous duty cycles, and aerospace/medical
                    grade manufacturing.
                  </p>
                  <Link to="/contact">
                    Discuss your application{" "}
                    <i className="bi bi-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="machine-benefits-panel">
                  <div className="machine-profile-kicker">
                    PLATFORM HIGHLIGHTS
                  </div>
                  <div className="machine-benefit-list">
                    <div>
                      <span>01</span>
                      <strong>
                        Direct-drive rotary-tilt kinematic architecture
                      </strong>
                      <i className="bi bi-check2"></i>
                    </div>
                    <div>
                      <span>02</span>
                      <strong>
                        Real-time thermal compensation across all active axes
                      </strong>
                      <i className="bi bi-check2"></i>
                    </div>
                    <div>
                      <span>03</span>
                      <strong>
                        Compatible with automated robotic cells &amp; pallet
                        changers
                      </strong>
                      <i className="bi bi-check2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="related-heading"
          className="related-machines-section py-5"
          style={{ background: "#fffaf8" }}
        >
          <div className="container">
            <div className="related-machines-heading">
              <div>
                <div className="eyebrow">
                  <span></span> Complete your production setup
                </div>
                <h2 id="related-heading">
                  Related <em> machines &amp; solutions.</em>
                </h2>
                <p>
                  Explore complementary platforms and industrial tooling
                  packages.
                </p>
              </div>
            </div>
            <div
              aria-label="Related machines and solutions"
              className="related-machine-track"
            >
              {loadingRelated ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7c72", width: "100%" }}>
                  Loading related platforms...
                </div>
              ) : relatedMachines.length > 0 ? (
                relatedMachines.map((relM) => {
                  const relImg = resolveImageUrl(relM.images?.[0]);
                  const relPrice =
                    relM.basePrice != null
                      ? `$${Number(relM.basePrice).toLocaleString()}`
                      : "Price on request";
                  const relSku = relM.sku || relM.slug?.toUpperCase() || "MACH";
                  const relCat = (relM.category || "Platform").toUpperCase();
                  const targetId = relM.slug || relM._id;

                  return (
                    <Link
                      key={relM._id || relM.slug}
                      className="related-machine-card"
                      to={`/machine-details?id=${targetId}`}
                    >
                      <span className="related-machine-image">
                        <img
                          alt={relM.name}
                          src={relImg}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <span>{relSku}</span>
                      </span>
                      <span className="related-machine-copy">
                        <small>{relCat}</small>
                        <strong>{relM.name}</strong>
                        <span>
                          {relPrice} <i className="bi bi-arrow-up-right"></i>
                        </span>
                        <span className="related-machine-description">
                          {relM.summary || relM.description?.slice(0, 90) || "Precision platform."}
                        </span>
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b7c72", width: "100%" }}>
                  No related machines available.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MachineDetails;
