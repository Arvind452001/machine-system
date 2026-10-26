import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleBanner = ({ role }) => {
  const { user } = useAuth();
  const isRep = role === "representative";
  const displayName = user?.name || (isRep ? "Representative Account" : "Customer Account");
  const displaySubtitle =
    user?.jobRole && user?.company
      ? `${user.jobRole} · ${user.company}`
      : user?.company || user?.jobRole || (isRep ? "Commercial Representative" : "Customer Workspace");

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
              <strong>{displayName}</strong>
              <small>{displaySubtitle}</small>
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
