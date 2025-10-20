/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/feature/auth/authThunk";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authImage1 from "../../Assets/authImage1.png";
import accompliqLogo from "../../Assets/logo_black_text.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, userInfo } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Onboarding step routing logic
  const routeForProfileStep = useCallback(
    (step, userRole) => {
      if (userRole === "admin") return "/dashboard";

      const isInviteUser = Boolean(
        localStorage.getItem("inviteUserId") ||
          userInfo?.familyPlanSubscriptionId
      );

      if (isInviteUser) {
        localStorage.removeItem("inviteUserId");
        return "/accompliq";
      }

      switch (step) {
        case "email":
        case "verify-email":
          return "/signup?step=2";
        case "password":
        case "set-password":
          return "/signup?step=3";
        case "profile":
        case "complete-profile":
          return "/signup?step=4";
        case "subscription":
        case "expired":
        case "inactive":
        case "no-subscription":
          return "/ChoosePlanPage";
        case "card":
          return "/cardDetail";
        case "completed":
        case "dashboard":
        default:
          return "/accompliq";
      }
    },
    [userInfo]
  );

  // On login, check onboarding state and go to correct step/page
  useEffect(() => {
    if (isAuthenticated && userInfo) {
      const step = userInfo.profileCompleted || "dashboard";
      const userRole = userInfo.role;

      if (userRole === "admin") {
        navigate("/dashboard", { replace: true });
        return;
      }

      // handle subscription/incomplete onboarding for normal users
      if (
        ["subscription", "expired", "inactive", "no-subscription"].includes(
          step
        ) ||
        (userInfo.subscriptionStatus &&
          userInfo.subscriptionStatus !== "active")
      ) {
        navigate("/ChoosePlanPage", { replace: true });
        return;
      }

      if (
        [
          "email",
          "verify-email",
          "password",
          "set-password",
          "profile",
          "complete-profile",
        ].includes(step)
      ) {
        navigate(routeForProfileStep(step, userRole), { replace: true });
        return;
      }

      navigate(routeForProfileStep(step, userRole), { replace: true });
    }
  }, [isAuthenticated, userInfo, navigate, routeForProfileStep]);

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
          loginMethod: "email",
        })
      );

      if (loginUser.fulfilled.match(result)) {
        // Success handled by useEffect above
        return;
      } else {
        const errorMessage =
          result?.payload?.message || result?.error?.message || "";

        // If subscription-related error, redirect to ChoosePlanPage
        if (
          errorMessage.toLowerCase().includes("subscription") ||
          errorMessage.toLowerCase().includes("purchase a subscription")
        ) {
          navigate("/ChoosePlanPage", { replace: true });
          return;
        }

        // If "complete your profile" error, go to onboarding
        const nextStep =
          result?.payload?.nextStep ||
          result?.payload?.profileCompleted ||
          result?.payload?.profile_status ||
          result?.error?.nextStep ||
          result?.error?.profileCompleted ||
          result?.error?.profile_status ||
          "";

        if (
          (errorMessage.toLowerCase().includes("complete your profile") ||
            errorMessage.toLowerCase().includes("profile details")) &&
          nextStep
        ) {
          const userRole =
            result?.payload?.user?.role || result?.error?.user?.role;
          navigate(routeForProfileStep(nextStep, userRole), { replace: true });
          return;
        }
      }
    } catch (err) {
      console.error("[Login Exception]:", err);
      alert(`[Login Exception]: ${err.message || err}`);
    }
  };

  // Only show error if it's NOT a subscription block
  const isSubscriptionError =
    error &&
    (error.toLowerCase().includes("subscription") ||
      error.toLowerCase().includes("purchase a subscription"));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-center justify-center bg-white rounded-xl lg:rounded-2xl shadow-lg w-full max-w-4xl lg:max-w-6xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden lg:flex lg:w-1/2 h-full min-h-[400px] lg:min-h-[500px] bg-gray-50 items-center justify-center p-4 lg:p-6">
          <img
            src={authImage1}
            alt="Authentication visual"
            className="w-full h-full object-contain max-h-[500px] lg:max-h-[600px]"
          />
        </div>
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex mt-4 justify-center mb-2 sm:mb-6 lg:mb-4">
            <img
              src={accompliqLogo}
              alt="accompliq logo"
              className="h-16 sm:h-18 lg:h-20 w-auto object-scale-down"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                imageRendering: "-webkit-optimize-contrast",
                imageRendering: "crisp-edges",
              }}
            />
          </div>
          <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Login Into Accompliq
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              Enter your email and password to log in
            </p>
          </div>
          {error && !isSubscriptionError && (
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-700 rounded text-xs sm:text-sm text-center">
              {error}
            </div>
          )}
          <form
            className="space-y-3 sm:space-y-4 lg:space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm lg:text-base text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full font-medium text-xs sm:text-sm lg:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-xs sm:text-sm lg:text-base text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm lg:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-[1.8rem] sm:top-[2.1rem] lg:top-[2.4rem] text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} className="sm:w-4 lg:w-5" />
                  ) : (
                    <FaEye size={16} className="sm:w-4 lg:w-5" />
                  )}
                </button>
                <div className="text-right mt-1 sm:mt-2">
                  <a
                    href="/RequestResetPasswordPage"
                    className="text-xs sm:text-sm text-[#0E0E0C] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-xs sm:text-sm lg:text-base bg-[#2241CF] text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 lg:mt-5">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-[#0E0E0C] font-bold hover:underline"
              >
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
