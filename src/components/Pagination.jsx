import React from "react";

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 5,
  onPageChange,
  itemName = "items",
  className = "",
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalItems === 0) {
    return null;
  }

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`table-pagination ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
        padding: "14px 18px",
        borderTop: "1px solid #e5e7eb",
        color: "#6b7280",
        fontSize: "12px",
        background: "#fafafa",
      }}
    >
      <span>
        Showing <strong>{startIdx}–{endIdx}</strong> of <strong>{totalItems}</strong> {itemName}
      </span>
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            style={{
              display: "grid",
              width: "30px",
              height: "30px",
              placeItems: "center",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: currentPage <= 1 ? "#f3f4f6" : "#fff",
              color: currentPage <= 1 ? "#9ca3af" : "#374151",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ width: "22px", textAlign: "center", color: "#9ca3af", fontSize: "12px" }}
                >
                  …
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                style={{
                  display: "grid",
                  width: "30px",
                  height: "30px",
                  placeItems: "center",
                  border: isCurrent ? "1px solid #0284c7" : "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: isCurrent ? "#0284c7" : "#fff",
                  color: isCurrent ? "#fff" : "#374151",
                  fontWeight: isCurrent ? "700" : "500",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            style={{
              display: "grid",
              width: "30px",
              height: "30px",
              placeItems: "center",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: currentPage >= totalPages ? "#f3f4f6" : "#fff",
              color: currentPage >= totalPages ? "#9ca3af" : "#374151",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
