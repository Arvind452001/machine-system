import { Link } from "react-router-dom";

const RoleBanner = ({ role }) => {
  const isRep = role === "representative";

  return (
    <div
      className={`role-context-bar ${
        isRep ? "rep-context" : "customer-context"
      }`}
    >
      <div className="role-context-content">
        <div className="role-context-left">
          <span className="role-pill">
            <i
              className={
                isRep ? "bi bi-shield-fill-check" : "bi bi-person-fill"
              }
            ></i>
            {isRep ? "REPRESENTATIVE PORTAL" : "CUSTOMER PORTAL"}
          </span>
          <div className="role-user-info">
            <span className="role-user-name">
              <strong>{isRep ? "Alex Morgan" : "Morgan Chen"}</strong>
              <small>
                {isRep
                  ? "Country Representative · Central Territory"
                  : "Operations Director · Northline Precision"}
              </small>
            </span>
          </div>
        </div>

        <div className="role-context-right">
          <span className="role-status-chip">
            <span className="status-dot"></span>
            {isRep ? "Representative Mode Active" : "Customer Mode Active"}
          </span>
          <Link
            to={isRep ? "/customer/dashboard" : "/representative/dashboard"}
            className="role-switch-link"
            title={`Switch to ${isRep ? "Customer" : "Representative"} portal`}
          >
            <i className="bi bi-arrow-left-right"></i>
            <span>
              Switch to {isRep ? "Customer View" : "Representative View"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleBanner;
