import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { machinesApi } from "../api/machinesApi";

const MyMachines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    machinesApi
      .getMachines()
      .then((res) => {
        if (mounted && Array.isArray(res?.data) && res.data.length > 0) {
          setMachines(res.data);
        }
      })
      .catch((err) => {
        console.warn("Could not load machines:", err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
            <span></span> YOUR MACHINES
          </div>
          <h1>
            Machines for <em> your work.</em>
          </h1>
          <p>
            Explore production platforms and pick up a configuration when you
            are ready.
          </p>
        </div>
        <Link className="button button-dark" to="/machines">
          Full catalogue <i className="bi bi-arrow-right"></i>
        </Link>
      </section>
      <div className="account-notice">
        <i className="bi bi-info-circle"></i>
        <span>
          Showing live machine platforms from MACHINE Systems catalogue.
        </span>
      </div>

      <section className="my-machines-grid">
        {machines.length > 0 ? (
          machines.map((m) => {
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
              <Link
                key={m._id || m.slug}
                className="my-machine-card"
                to={`/machine-details?id=${m.slug || m._id}`}
              >
                <div className="my-machine-image">
                  <img src={img} alt={m.name} loading="lazy" />
                  <span>{tag}</span>
                  <i className="bi bi-arrow-up-right"></i>
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
                  <div>
                    <span>
                      From <strong>{price}</strong>
                    </span>
                    <span>
                      View machine <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : loading ? (
          <div
            style={{
              padding: "32px",
              textAlign: "center",
              gridColumn: "1 / -1",
              color: "#6b7c72",
            }}
          >
            Loading machine platforms...
          </div>
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
            <i
              className="bi bi-gear-wide-connected mb-3 d-block"
              style={{ fontSize: "2.5rem", color: "#c94f2d" }}
            ></i>
            <h3 style={{ color: "#173f35" }}>No machine platforms found</h3>
            <p style={{ maxWidth: "440px", margin: "8px auto 20px", fontSize: "14px" }}>
              There are currently no machines assigned to your profile. Explore our complete catalogue to view and configure systems.
            </p>
            <Link className="button button-lime" to="/machines">
              Explore Catalogue <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        )}
      </section>

      <div className="account-bottom">
        <span className="account-help">
          <i className="bi bi-sliders"></i> Have a machine in mind?{" "}
          <Link to="/configure">Build a configuration</Link>
        </span>
        <Link className="button button-lime" to="/machines">
          Browse all machines <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </main>
  );
};

export default MyMachines;
