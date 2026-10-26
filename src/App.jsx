import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CarouselInitializer from "./components/CarouselInitializer";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Machine from "./pages/Machine";
import MachineDetails from "./pages/MachineDetails";
import Configure from "./pages/Configure";
import Basket from "./pages/Basket";
import Contact from "./pages/Contact";
import Enquiry from "./pages/Enquiry";
import EnquiryDetails from "./pages/EnquiryDetails";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

import CustomerLayout from "./layouts/CustomerLayout";
import RepresentativeLayout from "./layouts/RepresentativeLayout";

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
import SignUp from "./pages/SignUp";

import RepresentativeDashboard from "./pages/RepresentativeDashboard";
import RepresentativeEnquiries from "./pages/RepresentativeEnquiries";
import RepresentativeEnquiryDetails from "./pages/RepresentativeEnquiryDetails";
import RepresentativeNewEnquiry from "./pages/RepresentativeNewEnquiry";
import RepresentativeQuotes from "./pages/RepresentativeQuotes";
import RepresentativeCustomers from "./pages/RepresentativeCustomers";
import RepresentativeCustomerDetails from "./pages/RepresentativeCustomerDetails";
import RepresentativeProfile from "./pages/RepresentativeProfile";


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
    about: "/about",
    "how-it-works": "/how-it-works",
    login: "/login",
    signup: "/signup",
    "customer-dashboard": "/customer/dashboard",
    account: "/customer/dashboard",
    "my-enquiries": "/customer/enquiries",
    "enquiry-details": "/customer/enquiry-details",
    "my-quotations": "/customer/quotations",
    "quotation-details": "/customer/quotation-details",
    "quotation-example": "/customer/quotation-example",
    "my-machines": "/customer/machines",
    "profile-settings": "/customer/profile",
    privacy: "/privacy",
    terms: "/terms",
    "representative-dashboard": "/representative/dashboard",
    "representative-enquiries": "/representative/enquiries",
    "representative-enquiry-details": "/representative/enquiry-details",
    "representative-new-enquiry": "/representative/new-enquiry",
    "representative-quotes": "/representative/quotes",
    "representative-customers": "/representative/customers",
    "representative-customer": "/representative/customers",
    "customer-details": "/representative/customer-details",
    "representative-customer-details": "/representative/customer-details",
    "representative-customer-priya": "/representative/customer-details?customer=priya",
    "representative-customer-luis": "/representative/customer-details?customer=luis",
    "representative-profile": "/representative/profile",
  };

  const target = cleanMap[page] || "/";
  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

// GuestRoute: If user is already logged in, redirect them directly to their dashboard
const GuestRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    const targetDashboard =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }
  return children;
};

// SmartAuthRedirect: If already logged in, redirect directly to dashboard. If not, redirect to /login
const SmartAuthRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    const targetDashboard =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }
  return <Navigate to="/login" replace />;
};

// SmartSignupRedirect: If already logged in, redirect directly to dashboard. If not, redirect to /signup
const SmartSignupRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    const targetDashboard =
      user?.role === "representative"
        ? "/representative/dashboard"
        : "/customer/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }
  return <Navigate to="/signup" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <CarouselInitializer />
        <Header />
        <Routes>
          {/* Core Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/machines" element={<Machine />} />
          <Route path="/machine-details" element={<MachineDetails />} />
          <Route path="/configure" element={<Configure />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Auth Pages (Guest only: redirects logged in users to their dashboard) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LogIn />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUp />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <GuestRoute>
                <ResetPassword />
              </GuestRoute>
            }
          />

          {/* Explicit Customer & Representative Login / Signup Aliases */}
          <Route path="/customer/login" element={<SmartAuthRedirect />} />
          <Route path="/customer/signup" element={<SmartSignupRedirect />} />
          <Route path="/representative/login" element={<SmartAuthRedirect />} />
          <Route path="/representative/signup" element={<SmartSignupRedirect />} />

          {/* Customer Workspace Nested Routes (Protected for role: customer) */}
          <Route element={<ProtectedRoute allowedRole="customer" />}>
            <Route path="/customer" element={<CustomerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CustomerWorkspace />} />
              <Route path="login" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="signup" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="enquiries" element={<MyEnquiries />} />
              <Route path="enquiry-details" element={<EnquiryDetails />} />
              <Route path="quotations" element={<MyQuotations />} />
              <Route path="quotation-details" element={<QuotationDetails />} />
              <Route path="quotation-example" element={<Navigate to="/customer/quotations" replace />} />
              <Route path="machines" element={<MyMachines />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
          </Route>

          {/* Direct /dashboard fallback (Redirects to /customer/dashboard which is protected) */}
          <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />

          {/* Backward-compatible Customer Flat Route Redirects */}
          <Route path="/customer-dashboard" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/account" element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="/my-enquiries" element={<Navigate to="/customer/enquiries" replace />} />
          <Route path="/enquiry-details" element={<Navigate to="/customer/enquiry-details" replace />} />
          <Route path="/enquiries-details" element={<Navigate to="/customer/enquiry-details" replace />} />
          <Route path="/my-quotations" element={<Navigate to="/customer/quotations" replace />} />
          <Route path="/quotation-details" element={<Navigate to="/customer/quotation-details" replace />} />
          <Route path="/quotation-example" element={<Navigate to="/customer/quotations" replace />} />
          <Route path="/my-machines" element={<Navigate to="/customer/machines" replace />} />
          <Route path="/profile-settings" element={<Navigate to="/customer/profile" replace />} />

          {/* Representative Workspace Nested Routes (Protected for role: representative) */}
          <Route element={<ProtectedRoute allowedRole="representative" />}>
            <Route path="/representative" element={<RepresentativeLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<RepresentativeDashboard />} />
              <Route path="login" element={<Navigate to="/representative/dashboard" replace />} />
              <Route path="signup" element={<Navigate to="/representative/dashboard" replace />} />
              <Route path="enquiries" element={<RepresentativeEnquiries />} />
              <Route path="enquiry-details" element={<RepresentativeEnquiryDetails />} />
              <Route path="new-enquiry" element={<RepresentativeNewEnquiry />} />
              <Route path="quotes" element={<RepresentativeQuotes />} />
              <Route path="customers" element={<RepresentativeCustomers />} />
              <Route path="customer-details" element={<RepresentativeCustomerDetails />} />
              <Route path="profile" element={<RepresentativeProfile />} />
            </Route>
          </Route>

          {/* Backward-compatible Representative Flat Route Redirects */}
          <Route path="/representative-dashboard" element={<Navigate to="/representative/dashboard" replace />} />
          <Route path="/representative-enquiries" element={<Navigate to="/representative/enquiries" replace />} />
          <Route path="/representative-enquiry-details" element={<Navigate to="/representative/enquiry-details" replace />} />
          <Route path="/representative-new-enquiry" element={<Navigate to="/representative/new-enquiry" replace />} />
          <Route path="/representative-quotes" element={<Navigate to="/representative/quotes" replace />} />
          <Route path="/representative-customers" element={<Navigate to="/representative/customers" replace />} />
          <Route path="/representative-customer-details" element={<Navigate to="/representative/customer-details" replace />} />
          <Route path="/customer-details" element={<Navigate to="/representative/customer-details" replace />} />
          <Route path="/representative-customer-priya" element={<Navigate to="/representative/customer-details?customer=priya" replace />} />
          <Route path="/representative-customer-luis" element={<Navigate to="/representative/customer-details?customer=luis" replace />} />
          <Route path="/representative-profile" element={<Navigate to="/representative/profile" replace />} />

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
    </AuthProvider>
  );
}

export default App;




