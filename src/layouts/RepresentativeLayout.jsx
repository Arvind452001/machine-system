import { Outlet } from "react-router-dom";
import RepresentativeSidebar from "../components/RepresentativeSidebar";
// import RoleBanner from "../components/RoleBanner";

const RepresentativeLayout = () => {
  return (
    <div className="customer-dashboard-page customer-record-page rep-page representative-portal-layout">
      {/* <RoleBanner role="representative" /> */}
      <div className="customer-shell rep-shell">
        <RepresentativeSidebar />
        <div className="customer-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RepresentativeLayout;
