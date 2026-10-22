import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute:
 * - Redirects unauthenticated users to /login
 * - Ensures customers can only access customer routes, and representatives can only access rep routes
 */
const ProtectedRoute = ({ allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check role access
  if (allowedRole && user?.role !== allowedRole) {
    // If a Customer visits a Representative route, take them to their Customer Dashboard
    // If a Representative visits a Customer route, take them to their Representative Dashboard
    const fallbackPath =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";

    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
