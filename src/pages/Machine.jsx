import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { machinesApi, categoriesApi } from "../api";
import { BASE_URL } from "../api/axiosInstance";

// Helper to resolve backend image paths (conditional full vs half URL)
const resolveImageUrl = (img) => {
  if (!img) {
    return "https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&fmt=webp";
  }
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }
  return `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};


// Generate pagination numbers with ellipsis support
const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Machine = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get("category") || "all";
  const pageParam = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1
  );
  const limitParam = Math.max(
    1,
    parseInt(searchParams.get("limit") || "6", 10) || 6
  );

  // Component state
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: pageParam,
    limit: limitParam,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  // 1. Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    setCategoriesLoading(true);
    categoriesApi
      .getCategories()
      .then((res) => {
        if (!mounted) return;
        if (res?.success && Array.isArray(res.data)) {
          const activeList = res.data.filter((c) => c.isActive !== false);
          setCategories(activeList);
        } else if (Array.isArray(res?.names)) {
          setCategories(res.names.map((name) => ({ name, _id: name })));
        }
      })
      .catch((err) => {
        console.warn("Could not load categories from API:", err);
      })
      .finally(() => {
        if (mounted) setCategoriesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Fetch machines whenever category, page, or limit in URL change
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const isAll = !categoryParam || categoryParam.toLowerCase() === "all";

    const params = {
      page: pageParam,
      limit: limitParam,
    };

    if (!isAll) {
      // Find exact category matching case or slug to avoid casing mismatches
      const matchedCategory = categories.find(
        (c) =>
          (c.name || c).toLowerCase() === categoryParam.toLowerCase() ||
          (c.slug && c.slug.toLowerCase() === categoryParam.toLowerCase())
      );
      params.category = matchedCategory
        ? matchedCategory.name || matchedCategory
        : categoryParam;
    }

    machinesApi
      .getMachines(params)
      .then((res) => {
        if (!mounted) return;
        if (res && Array.isArray(res.data)) {
          setMachines(res.data);
          const totalCount =
            typeof res.total === "number"
              ? res.total
              : res.pagination?.total ?? res.data.length;
          const totalPagesCount =
            typeof res.totalPages === "number"
              ? res.totalPages
              : res.pagination?.totalPages ?? 1;
          const currentPageCount =
            typeof res.currentPage === "number"
              ? res.currentPage
              : res.pagination?.page ?? pageParam;

          setPagination({
            page: currentPageCount,
            limit: res.pagination?.limit || limitParam,
            total: totalCount,
            totalPages: Math.max(1, totalPagesCount),
            hasNext:
              res.pagination?.hasNext ?? currentPageCount < totalPagesCount,
            hasPrev: res.pagination?.hasPrev ?? currentPageCount > 1,
          });
        } else {
          setMachines([]);
          setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
        }
      })
      .catch((err) => {
        console.warn("Could not load machines from API:", err.message);
        if (mounted) {
          setMachines([]);
          setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categoryParam, pageParam, limitParam, categories]);

  // Handlers for category, page, and limit changes
  const handleCategoryChange = (selectedCat) => {
    const newParams = new URLSearchParams(searchParams);
    if (!selectedCat || selectedCat.toLowerCase() === "all") {
      newParams.set("category", "all");
    } else {
      newParams.set("category", selectedCat);
    }
    newParams.set("page", "1");
    if (!newParams.get("limit")) {
      newParams.set("limit", String(limitParam));
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.totalPages ||
      newPage === pageParam
    ) {
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    if (!newParams.get("limit")) {
      newParams.set("limit", String(limitParam));
    }
    setSearchParams(newParams);

    const catalogMain = document.getElementById("all-machines");
    if (catalogMain) {
      catalogMain.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const handleLimitChange = (newLimit) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("limit", String(newLimit));
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    newParams.set("category", "all");
    newParams.set("page", "1");
    newParams.set("limit", String(limitParam));
    setSearchParams(newParams);
  };

  const displayedMachines = machines;

  const totalCount =
    pagination.total !== undefined ? pagination.total : machines.length;
  const countLabel = `${String(totalCount).padStart(2, "0")} SYSTEMS`;
  const isAllCategory =
    !categoryParam || categoryParam.toLowerCase() === "all";

  // Calculate range showing: e.g. 1–2 of 10
  const startItem = totalCount === 0 ? 0 : (pageParam - 1) * limitParam + 1;
  const endItem = Math.min(pageParam * limitParam, totalCount);

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
          <span className="page-index">{countLabel}</span>
        </section>

        <section
          className="catalog-layout"
          aria-label="Machine catalogue and filters"
        >
          {/* Left Sidebar Filter */}
          <aside
            className="catalog-sidebar"
            aria-label="Filter machine catalogue"
          >
            <div className="catalog-sidebar-heading">
              <h2>Filters</h2>
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  color: "var(--orange)",
                  fontSize: "9px",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Clear all
              </button>
            </div>

            {/* Dynamic Machine Category Filter */}
            <fieldset className="catalog-filter-group">
              <legend>Machine category</legend>

              {/* Default All Machines */}
              <label
                className="category-filter"
                htmlFor="cat-radio-all"
                onClick={() => handleCategoryChange("all")}
              >
                <input
                  type="radio"
                  name="machine-category"
                  id="cat-radio-all"
                  value="all"
                  checked={isAllCategory}
                  onChange={() => handleCategoryChange("all")}
                />
                <span>All machines</span>
              </label>

              {/* Dynamic categories fetched from API */}
              {categories.map((cat, idx) => {
                const catName = cat.name || cat;
                const catKey = cat._id || cat.slug || idx;
                const isSelected =
                  !isAllCategory &&
                  (categoryParam.toLowerCase() === catName.toLowerCase() ||
                    (cat.slug &&
                      categoryParam.toLowerCase() ===
                        cat.slug.toLowerCase()));
                const radioId = `cat-radio-${catKey}`;

                return (
                  <label
                    key={catKey}
                    className="category-filter"
                    htmlFor={radioId}
                    onClick={() => handleCategoryChange(catName)}
                  >
                    <input
                      type="radio"
                      name="machine-category"
                      id={radioId}
                      value={catName}
                      checked={isSelected}
                      onChange={() => handleCategoryChange(catName)}
                    />
                    <span>{catName}</span>
                  </label>
                );
              })}

              {categoriesLoading && (
                <div
                  style={{
                    padding: "8px 0",
                    color: "var(--muted)",
                    fontSize: "8px",
                  }}
                >
                  <i className="bi bi-hourglass-split"></i> Loading
                  categories...
                </div>
              )}
            </fieldset>

            {/* Starting Price Guide */}
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
                    name="machine-price-guide"
                    id="price-opt-all"
                    defaultChecked
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">Any</span>
                </label>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price-guide"
                    id="price-opt-under-75"
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">
                    Under
                    <br />
                    $75k
                  </span>
                </label>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price-guide"
                    id="price-opt-75-125"
                  />
                  <span className="price-dot"></span>
                  <span className="price-choice-label">
                    $75k–
                    <br />
                    $125k
                  </span>
                </label>
                <label className="price-choice">
                  <input
                    type="radio"
                    name="machine-price-guide"
                    id="price-opt-over-125"
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

          {/* Machine Results Section */}
          <div className="machine-results">
            <div className="catalog-tools">
              <span className="catalog-label">
                <i className="bi bi-grid"></i>{" "}
                {String(totalCount).padStart(2, "0")} MACHINE PLATFORMS
              </span>
              <span className="catalog-price-note">
                Indicative prices · USD
              </span>
            </div>

            <section className="catalog-main" id="all-machines">
              {/* Loading State */}
              {loading ? (
                <div className="catalog-loading">
                  <div className="catalog-spinner"></div>
                  <span>Loading machines...</span>
                </div>
              ) : displayedMachines.length > 0 ? (
                <div className="machine-grid">
                  {displayedMachines.map((m) => {
                    const img = resolveImageUrl(m.images?.[0]);
                    const tag = `${
                      m.sku || m.slug?.toUpperCase() || "MS"
                    } · ${(m.category || "CNC").toUpperCase()}`;
                    const price = m.basePrice
                      ? `$${Number(m.basePrice).toLocaleString()}`
                      : "Contact";
                    const detailUrl = `/machine-details?id=${m.slug || m._id}`;

                    return (
                      <article
                        key={m._id || m.slug}
                        className="machine-card machine-card-extended"
                        data-category={m.category}
                      >
                        <Link className="machine-image" to={detailUrl}>
                          <img
                            src={img}
                            alt={m.name || "Machine platform"}
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://assets.haascnc.com/is/image/haascnc/ST-20?wid=1200&fmt=webp";
                            }}
                          />
                          <span className="machine-category">{tag}</span>
                          <span className="image-arrow">
                            <i className="bi bi-arrow-up-right"></i>
                          </span>
                        </Link>
                        <div className="machine-card-body">
                          <div className="machine-meta">
                            <span>{m.sku || m.slug?.toUpperCase()}</span>
                            <span>
                              {(m.category || "INDUSTRIAL").toUpperCase()}
                            </span>
                          </div>
                          <h3>{m.name}</h3>
                          <p>
                            {m.summary ||
                              (m.description
                                ? `${m.description.slice(0, 80)}...`
                                : "Precision industrial production system.")}
                          </p>
                          <div className="machine-card-bottom">
                            <span>
                              STARTING FROM
                              <strong>{price}</strong>
                            </span>
                            <Link to={detailUrl} aria-label={`View ${m.name}`}>
                              <i className="bi bi-arrow-right"></i>
                            </Link>
                          </div>
                          <Link className="machine-open" to={detailUrl}>
                            View machine{" "}
                            <i className="bi bi-arrow-up-right"></i>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty state when no machines found */
                <div className="no-machines-found">
                  <i className="bi bi-cpu"></i>
                  <h3>No machines found</h3>
                  <p>
                    {isAllCategory
                      ? "There are currently no machines listed in the catalogue."
                      : `No machines match the selected category "${categoryParam}".`}
                  </p>
                  {!isAllCategory && (
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() => handleCategoryChange("all")}
                    >
                      View all machines
                    </button>
                  )}
                </div>
              )}

              {/* Pagination Bar */}
              {totalCount > 0 && (
                <div className="catalog-pagination-wrap">
                  <div className="pagination-info">
                    <span>
                      Showing {startItem}–{endItem} of {totalCount} machines
                    </span>
                    <div className="pagination-limit-selector">
                      <span>Per page:</span>
                      <select
                        value={limitParam}
                        onChange={(e) =>
                          handleLimitChange(Number(e.target.value))
                        }
                        aria-label="Machines per page"
                      >
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                      </select>
                    </div>
                  </div>

                  {pagination.totalPages > 1 && (
                    <nav className="pagination-nav" aria-label="Catalog pages">
                      {/* Prev Button */}
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => handlePageChange(pageParam - 1)}
                        disabled={pageParam <= 1}
                        aria-label="Previous page"
                      >
                        <i className="bi bi-chevron-left"></i>
                        <span>Prev</span>
                      </button>

                      {/* Numbered Page Buttons */}
                      {getPageNumbers(pageParam, pagination.totalPages).map(
                        (num, i) => {
                          if (num === "...") {
                            return (
                              <span
                                key={`ellipsis-${i}`}
                                className="pagination-ellipsis"
                              >
                                &hellip;
                              </span>
                            );
                          }
                          const isActive = num === pageParam;
                          return (
                            <button
                              key={`page-${num}`}
                              type="button"
                              className={`pagination-btn ${
                                isActive ? "active" : ""
                              }`}
                              onClick={() => handlePageChange(num)}
                              aria-current={isActive ? "page" : undefined}
                            >
                              {num}
                            </button>
                          );
                        }
                      )}

                      {/* Next Button */}
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => handlePageChange(pageParam + 1)}
                        disabled={pageParam >= pagination.totalPages}
                        aria-label="Next page"
                      >
                        <span>Next</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </nav>
                  )}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Machine;
