import { Link } from "react-router-dom";


const Machine = () => {
  return (
    <div>
      <main>
        <div className="page-crumb">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Home
          </Link>
          <span>/</span>
          <span>Machine catalogue</span>
        </div>
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span></span> The machine shop
            </div>
            <h1>
              Choose a<em> platform.</em>
            </h1>
            <p>Production-ready systems with room to make them your own.</p>
          </div>
          <span className="page-index">06 SYSTEMS</span>
        </section>
        <section
          className="catalog-layout"
          aria-label="Machine catalogue and filters"
        >
          <aside
            className="catalog-sidebar"
            aria-label="Filter machine catalogue"
          >
            <div className="catalog-sidebar-heading">
              <h2>Filters</h2>
              <Link to="/machines">Clear all</Link>
            </div>
            <fieldset className="catalog-filter-group">
              <legend>Machine category</legend>
              <label className="category-filter">
                <input
                  type="radio"
                  name="machine-category"
                  id="category-all"
                  checked
                />
                <span>All machines</span>
              </label>
              <label className="category-filter">
                <input type="radio" name="machine-category" id="category-cnc" />
                <span>CNC platforms</span>
              </label>
              <label className="category-filter">
                <input
                  type="radio"
                  name="machine-category"
                  id="category-turning"
                />
                <span>CNC turning</span>
              </label>
              <label className="category-filter">
                <input
                  type="radio"
                  name="machine-category"
                  id="category-milling"
                />
                <span>CNC milling</span>
              </label>
              <label className="category-filter">
                <input
                  type="radio"
                  name="machine-category"
                  id="category-laser"
                />
                <span>Laser cutting</span>
              </label>
            </fieldset>
            <fieldset className="catalog-filter-group price-filter-group">
              <legend>
                Starting price
                <small>USD</small>
              </legend>
              <div className="price-range-ends">
                <span>$0</span>
                <span>$150,000+</span>
              </div>
              <div className="price-range-control">
                <span className="price-range-track" aria-hidden="true"></span>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price"
                    id="price-all"
                    checked
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">Any</span>
                </label>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price"
                    id="price-under-75"
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">
                    Under
                    <br />
                    $75k
                  </span>
                </label>
                <label className="price-choice">
                  <input type="radio" name="machine-price" id="price-75-125" />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">
                    $75kâ€“
                    <br />
                    $125k
                  </span>
                </label>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price"
                    id="price-over-125"
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">$125k+</span>
                </label>
              </div>
            </fieldset>
            <p className="catalog-filter-note">
              <i className="bi bi-info-circle"></i> Prices are indicative
              starting points.
            </p>
          </aside>
          <div className="machine-results">
            <div className="catalog-tools">
              <span className="catalog-label">
                <i className="bi bi-grid"></i> 06 MACHINE PLATFORMS
              </span>
              <span className="catalog-price-note">
                Indicative prices · USD
              </span>
            </div>
            <section className="catalog-main" id="all-machines">
              <div className="machine-grid">
                <article
                  className="machine-card machine-card-extended"
                  id="cnc"
                  data-category="cnc turning"
                  data-price="under-75"
                >
                  <Link
                    className="machine-image"
                    to="/machine-details#axis-400"
                  >
                    <img
                      src="https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&amp;fmt=webp"
                      alt="Precision CNC turning machine"
                      loading="lazy"
                    />
                    <span className="machine-category">CNC · TURNING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AX-400</span>
                      <span>PRECISION CNC LATHE</span>
                    </div>
                    <h3>Axis 400</h3>
                    <p>
                      A compact turning platform for dependable, high-accuracy
                      production.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$48,500</strong>
                      </span>
                      <Link
                        to="/machine-details#axis-400"
                        aria-label="View Axis 400"
                      >
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link
                      className="machine-open"
                      to="/machine-details#axis-400"
                    >
                      View machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
                <article
                  className="machine-card machine-card-extended"
                  data-category="cnc milling"
                  data-price="under-75"
                >
                  <Link className="machine-image" to="/machine-details#arc-700">
                    <img
                      src="https://assets.haascnc.com/is/image/haascnc/VF-2SS?wid=1200&amp;fmt=webp"
                      alt="Vertical CNC machining centre"
                      loading="lazy"
                    />
                    <span className="machine-category">CNC · MILLING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AR-700</span>
                      <span>VERTICAL MACHINING CENTRE</span>
                    </div>
                    <h3>Arc 700</h3>
                    <p>
                      A rigid, versatile centre for complex parts and repeatable
                      results.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$72,400</strong>
                      </span>
                      <Link
                        to="/machine-details#arc-700"
                        aria-label="View Arc 700"
                      >
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link
                      className="machine-open"
                      to="/machine-details#arc-700"
                    >
                      View machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
                <article
                  className="machine-card machine-card-extended"
                  id="laser"
                  data-category="laser"
                  data-price="75-125"
                >
                  <Link className="machine-image" to="/machine-details#flare-6">
                    <img
                      src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=85"
                      alt="Fiber laser production equipment"
                      loading="lazy"
                    />
                    <span className="machine-category">LASER · CUTTING</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>FL-6000</span>
                      <span>FIBER LASER SYSTEM</span>
                    </div>
                    <h3>Flare 6</h3>
                    <p>
                      Fast, precise sheet cutting in a production-ready cell.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$96,300</strong>
                      </span>
                      <Link
                        to="/machine-details#flare-6"
                        aria-label="View Flare 6"
                      >
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link
                      className="machine-open"
                      to="/machine-details#flare-6"
                    >
                      View machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
                <article
                  className="machine-card machine-card-extended"
                  data-category="cnc turning"
                  data-price="under-75"
                >
                  <Link className="machine-image" to="#contact">
                    <img
                      src="https://assets.haascnc.com/is/image/haascnc/ST-30?wid=1200&amp;fmt=webp"
                      alt="Industrial turning equipment in a machine shop"
                      loading="lazy"
                    />
                    <span className="machine-category">
                      CNC · HEAVY TURNING
                    </span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AX-520</span>
                      <span>HIGH-CAPACITY CNC LATHE</span>
                    </div>
                    <h3>Axis 520</h3>
                    <p>
                      Extra turning capacity for larger, demanding workpieces.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$61,200</strong>
                      </span>
                      <Link to="#contact" aria-label="Ask about Axis 520">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link className="machine-open" to="#contact">
                      Ask about this machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
                <article
                  className="machine-card machine-card-extended"
                  data-category="cnc milling"
                  data-price="75-125"
                >
                  <Link className="machine-image" to="#contact">
                    <img
                      src="https://assets.haascnc.com/is/image/haascnc/VF-2TR?wid=1200&amp;fmt=webp"
                      alt="Advanced machining equipment on a factory floor"
                      loading="lazy"
                    />
                    <span className="machine-category">
                      CNC · 5-AXIS MILLING
                    </span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>AR-900</span>
                      <span>5-AXIS MACHINING CENTRE</span>
                    </div>
                    <h3>Arc 900</h3>
                    <p>
                      Five-axis flexibility for complex parts and fewer setups.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$118,900</strong>
                      </span>
                      <Link to="#contact" aria-label="Ask about Arc 900">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link className="machine-open" to="#contact">
                      Ask about this machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
                <article
                  className="machine-card machine-card-extended"
                  data-category="laser"
                  data-price="over-125"
                >
                  <Link className="machine-image" to="#contact">
                    <img
                      src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=85"
                      alt="High-power laser production machinery"
                      loading="lazy"
                    />
                    <span className="machine-category">LASER · HIGH POWER</span>
                    <span className="image-arrow">
                      <i className="bi bi-arrow-up-right"></i>
                    </span>
                  </Link>
                  <div className="machine-card-body">
                    <div className="machine-meta">
                      <span>FL-12000</span>
                      <span>12 KW FIBER LASER SYSTEM</span>
                    </div>
                    <h3>Flare 12</h3>
                    <p>
                      High-power sheet cutting for faster throughput at scale.
                    </p>
                    <div className="machine-card-bottom">
                      <span>
                        STARTING FROM
                        <strong>$149,800</strong>
                      </span>
                      <Link to="#contact" aria-label="Ask about Flare 12">
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                    <Link className="machine-open" to="#contact">
                      Ask about this machine
                      <i className="bi bi-arrow-up-right"></i>
                    </Link>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Machine;
