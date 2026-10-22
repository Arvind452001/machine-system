import { Outlet } from "react-router-dom";
import CustomerSidebar from "../components/CustomerSidebar";
// import RoleBanner from "../components/RoleBanner";

const CustomerLayout = () => {
  return (
    <div className="customer-dashboard-page customer-record-page customer-portal-layout">
      {/* <RoleBanner role="customer" /> */}
      <div className="customer-shell">
        <CustomerSidebar />
        <div className="customer-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
