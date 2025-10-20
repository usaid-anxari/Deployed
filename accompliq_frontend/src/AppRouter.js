import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactForm from "./pages/ContactForm";
import PricingPage from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./Components/Layout/DashboardLayout";
import LoginPage from "./Components/auth/signin";
import SignupPage from "./Components/auth/signup";
import RequestResetPasswordPage from "./Components/auth/RequestResetPasswordPage";
import ChoosePlan from "./Components/ProfileSetting/ChoosePlan";
import ChangePassword from "./Components/ProfileSetting/ChangePassword";
import DeleteAccount from "./Components/ProfileSetting/DeleteAccount";
import NotificationSettings from "./Components/ProfileSetting/NotificationSettings";
import AccountSettings from "./Components/ProfileSetting/AccountSettings";
import ResetPasswordPage from "./Components/auth/ResetPasswordPage";
import Accompliq from "./pages/Accompliq/Accompliq";
import CreateAccompliq from "./pages/Accompliq/CreateAccompliq";
import PersonalForms from "./pages/PersonalPlaningForm/PersonalPlanningForm";
import HtmlFormViewer from "./Components/Form/HtmlFormViewer";
import BucketList from "./pages/BucketPage/BucketListPage";
import FamilyMembersTable from "./Components/FamilyPlanning/FamilyMemberDashboard";
import ComingSoon from "./pages/CommingSoon";
import ChoosePlanPage from "./Components/auth/ChoosePlanPage";
import CardDetailScreen from "./Components/auth/CardDetailScreen";
import SettingsPage from "./Components/ProfileSetting/Settings";
import Blog from "./pages/Blog";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PublicMemorial from "./pages/PublicMemorial";
import EmailSection from "./pages/EmailSection";
import Faqs from "./pages/Faqs";
import SampleBuckets from "./pages/SampleBuckets";
import PaymentPlans from "./pages/PaymentPlans";

const LoginSignupRedirector = ({ children }) => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    // ✅ Only redirect if signup is completely done
    if (userInfo?.profileCompleted === "completed") {
      if (userInfo?.role === "admin")
        return <Navigate to="/dashboard" replace />;
      if (userInfo?.role === "user")
        return <Navigate to="/accompliq" replace />;
    }
  }
  return children;
};

const AppRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Block any attempt to go back to auth pages after login
    if (["/login", "/signup"].includes(location.pathname)) {
      window.history.pushState(null, "", location.pathname);
      window.history.replaceState(null, "", location.pathname);
    }
  }, [location.pathname, navigate]);

  const ExternalRedirect = () => {
    useEffect(() => {
      window.location.href = "https://blog.accompliq.com/";
    }, []);
    return null;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <LoginSignupRedirector>
            <Layout>
              <LoginPage />
            </Layout>
          </LoginSignupRedirector>
        }
      />
      <Route
        path="/signup"
        element={
          <LoginSignupRedirector>
            <Layout>
              <SignupPage />
            </Layout>
          </LoginSignupRedirector>
        }
      />
      <Route
        path="/requestresetpasswordPage"
        element={
          <Layout>
            <RequestResetPasswordPage />
          </Layout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Layout>
            <ResetPasswordPage />
          </Layout>
        }
      />
      <Route
        path="/ChoosePlanPage"
        element={
          <Layout>
            <ChoosePlanPage />
          </Layout>
        }
      />
      <Route
        path="/cardDetail"
        element={
          <Layout>
            <CardDetailScreen />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <AboutUs />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactForm />
          </Layout>
        }
      />
      <Route
        path="/pricing"
        element={
          <Layout>
            <PricingPage />
          </Layout>
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <Layout>
            <TermsAndConditions/>
          </Layout>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <Layout>
            <PrivacyPolicy/>
          </Layout>
        }
      />
      <Route
        path="/newsletter"
        element={
          <Layout>
            <EmailSection/>
          </Layout>
        }
      />
       <Route
        path="/faqs"
        element={
          <Layout>
            <Faqs/>
          </Layout>
        }
      />
       <Route
        path="/sample-accompliqs"
        element={
          <Layout>
            <PublicMemorial/>
          </Layout>
        }
      />
      <Route
        path="/sample-buckets"
        element={
          <Layout>
            <SampleBuckets/>
          </Layout>
        }
      />
      <Route path="/blog" element={<ExternalRedirect />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accompliq" element={<Accompliq />} />
        <Route path="createAccompliq" element={<CreateAccompliq />} />
        <Route path="bucket-list" element={<BucketList />} />
        <Route path="family-planning" element={<FamilyMembersTable />} />
        <Route path="profile-setting" element={<SettingsPage />}>
          <Route index element={<AccountSettings />} />
          <Route path="choose-plan" element={<ChoosePlan />} />
          <Route path="notification" element={<NotificationSettings />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="delete-account" element={<DeleteAccount />} />
        </Route>
        <Route path="personal-planning/html" element={<HtmlFormViewer />} />
        <Route path="personal-planning" element={<PersonalForms />} />
        <Route
          path="personal-planning/view"
          element={<PersonalForms mode="view" />}
        />
        <Route path="public-memorial" element={<PublicMemorial />} />
        <Route path="payment-plans" element={<PaymentPlans />} />
      </Route>

      {/* 404 Not Found fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;