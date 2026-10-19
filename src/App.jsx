import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CarouselInitializer from "./components/CarouselInitializer";

import Home from "./pages/Home";
import Machine from "./pages/Machine";
import MachineDetails from "./pages/MachineDetails";
import Configure from "./pages/Configure";
import Basket from "./pages/Basket";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import EnquiryDetails from "./pages/EnquiryDetails";
import LogIn from "./pages/LogIn";

import CustomerWorkspace from "./pages/CustomerWorkspace";
import MyEnquiries from "./pages/MyEnquiries";
import MyQuotations from "./pages/MyQuotations";
import QuotationDetails from "./pages/QuotationDetails";
import QuotationExample from "./pages/QuotationExample";
import MyMachines from "./pages/MyMachines";
import ProfileSettings from "./pages/ProfileSettings";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUP";


 //* Cleanly redirects any legacy *.html URLs to their modern React Router paths*//
 
function LegacyHtmlRedirect() {
  const { page } = useParams();
  const location = useLocation();
  const cleanMap = {
    index: "/",
    machines: "/machines",
    "machine-details": "/machine-details",
    configure: "/configure",
    basket: "/basket",
    contact: "/contact",
    enquiry: "/enquiry",
    login: "/login",
    signup: "/signup",
    "customer-dashboard": "/customer-dashboard",
    account: "/customer-dashboard",
    "my-enquiries": "/my-enquiries",
    "enquiry-details": "/enquiry-details",
    "enquiries-details": "/enquiry-details",
    "my-quotations": "/my-quotations",
    "quotation-details": "/quotation-details",
    "quotation-example": "/quotation-example",
    "my-machines": "/my-machines",
    "profile-settings": "/profile-settings",
    privacy: "/privacy",
    terms: "/terms",
  };

  const target = cleanMap[page] || "/";
  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CarouselInitializer />
      <Header />
      <Routes>
        {/* Core Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/machines" element={<Machine />} />
        <Route path="/machine-details" element={<MachineDetails />} />
        <Route path="/configure" element={<Configure />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/enquiry" element={<Enquiry />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Customer Workspace / Dashboard Pages */}
        <Route path="/customer-dashboard" element={<CustomerWorkspace />} />
        <Route path="/account" element={<Navigate to="/customer-dashboard" replace />} />
        <Route path="/my-enquiries" element={<MyEnquiries />} />
        <Route path="/enquiry-details" element={<EnquiryDetails />} />
        <Route path="/enquiries-details" element={<Navigate to="/enquiry-details" replace />} />
        <Route path="/my-quotations" element={<MyQuotations />} />
        <Route path="/quotation-details" element={<QuotationDetails />} />
        <Route path="/quotation-example" element={<QuotationExample />} />
        <Route path="/my-machines" element={<MyMachines />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} /> 

        {/* Legacy *.html Redirects */}
        <Route path="/:page.html" element={<LegacyHtmlRedirect />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
