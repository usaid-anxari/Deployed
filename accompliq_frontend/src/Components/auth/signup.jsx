/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaArrowRight, FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { verifyInviteToken } from "../../redux/feature/auth/authThunk";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  registerUser,
  verifyEmail,
  setPassword,
  updateProfile,
  fetchUserData,
} from "../../redux/feature/auth/authThunk";
import authImage1 from "../../Assets/authImage1.png";
import accompliqLogo from "../../Assets/logo_black_text.png";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const SignUpPage = () => {
  const getUserId = () => {
    return (
      inviteUserId ||
      userInfo?.id ||
      userInfo?._id ||
      localStorage.getItem("inviteUserId") ||
      ""
    );
  };
  // Redux and Router hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const { inviteEmail, inviteUserId } = useSelector((state) => state.stripe);
  // Local form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [inviteVerifying, setInviteVerifying] = useState(false);

  // UserId for setPassword/updateProfile
  const userId = inviteUserId || userInfo?.id || userInfo?._id || ""; // Get current onboarding step from the URL, default to 1
  const urlParams = new URLSearchParams(location.search);
  const inviteToken = urlParams.get("invite");
  const stepFromURL = Number(urlParams.get("step")) || 1;

  //"invite token logic" useEffect:
  useEffect(() => {
    if (inviteToken && !inviteVerifying && stepFromURL === 1) {
      setInviteVerifying(true);
      dispatch(verifyInviteToken({ inviteToken }))
        .unwrap()
        .then((result) => {
          if (result.userId) {
            localStorage.setItem("inviteUserId", result.userId);
            // 🚩 Fetch user data after invite verification!
            dispatch(fetchUserData()).then(() => {
              navigate("/signup?step=3", { replace: true });
            });
          } else {
            navigate("/signup?step=3", { replace: true });
          }
        })
        .catch((error) => {
          setLocalError("Invite link is invalid or expired.");
        });
    }
  }, [inviteToken, inviteVerifying, stepFromURL, dispatch, navigate]);

  // When verifying invite succeeded, update form:
  useEffect(() => {
    if (inviteEmail) {
      setFormData((prev) => ({ ...prev, email: inviteEmail }));
    }
  }, [inviteEmail]);

  // Handle token-based email verification on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    if (token) {
      handleVerifyEmail(token);
    }
  }, [location.search, dispatch]);

  // ---- Event Handlers ----
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  const claimInvite = async (inviteToken, userId) => {
    try {
      // Use your fetch/axios/Api instance here
      const response = await fetch("/api/auth/claim-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteToken, userId }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to claim invite");
      return true;
    } catch (err) {
      setLocalError("Failed to claim family invitation: " + err.message);
      return false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const result = await dispatch(registerUser({ email: formData.email }));
      if (registerUser.fulfilled.match(result)) {
        navigate("/signup?step=2");
      } else {
        setLocalError(result.payload?.message || "Failed to register");
      }
    } catch (err) {
      setLocalError("An unexpected error occurred during registration");
    }
  };

  const handleVerifyEmail = async (token) => {
    setLocalError(null);
    try {
      const resultAction = await dispatch(verifyEmail(token));
      if (verifyEmail.fulfilled.match(resultAction)) {
        // Remove token from URL and move to password setup
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
        navigate("/signup?step=3", { replace: true });
        return true;
      } else {
        setLocalError(
          resultAction.payload?.message ||
            (resultAction.error?.message?.includes("already exists")
              ? "This email is already registered"
              : "Verification failed")
        );
        return false;
      }
    } catch (err) {
      setLocalError("An unexpected error occurred during email verification");
      return false;
    }
  };


const handleSetPassword = async (e) => {
  e.preventDefault();
  setLocalError(null);

  const effectiveUserId = getUserId();

  if (!effectiveUserId) {
    setLocalError("Signup error: user not found.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setLocalError("Passwords do not match");
    return;
  }

  try {
    const result = await dispatch(
      setPassword({
        userId: effectiveUserId,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );

    if (setPassword.fulfilled.match(result)) {
      if (inviteToken) {
        // invite logic...
      } else {
        // ✅ MANUAL NAVIGATION: Force step 4
        navigate("/signup?step=4", { replace: true });
      }
    } else {
      setLocalError(result.payload?.message || "Password setup failed");
    }
  } catch (err) {
    setLocalError("An unexpected error occurred while setting password");
  }
};


const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLocalError(null);

  const effectiveUserId = getUserId();

  try {
    console.log("User ID for profile update:", effectiveUserId);
    const result = await dispatch(
      updateProfile({
        userId: effectiveUserId,
        updateData: {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
        },
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      // ✅ This stays the same
      if (inviteToken || localStorage.getItem("inviteUserId")) {
        navigate("/login", { replace: true });
      } else {
        navigate("/ChoosePlanPage", { replace: true });
      }
    } else {
      setLocalError(result.payload?.message || "Profile update failed");
    }
  } catch (err) {
    setLocalError("An unexpected error occurred while updating profile");
  }
};

useEffect(() => {
  if (!userInfo) return;

  console.log("useEffect - step:", stepFromURL, "profileCompleted:", userInfo.profileCompleted);

  // ✅ SIMPLE: No auto-navigation during signup steps 1-4
  if (stepFromURL >= 1 && stepFromURL <= 4) {
    return; // Let manual navigation handle everything
  }

  // Only handle post-signup navigation
  if (userInfo.profileCompleted === "subscription") {
    if (inviteToken || localStorage.getItem("inviteUserId") || userInfo.familyPlanSubscriptionId) {
      navigate("/login", { replace: true });
    } else {
      navigate("/ChoosePlanPage", { replace: true });
    }
    return;
  }

  if (userInfo.profileCompleted === "completed") {
    if (userInfo.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/accompliq", { replace: true });
    }
    return;
  }
}, [userInfo, stepFromURL, navigate, inviteToken]);

  // ---- Render functions ----
  const renderHeader = (title, subtitle) => (
    <>
      <div className="flex justify-center mb-4 sm:mb-6">
        <img
          src={accompliqLogo}
          alt="accompliq logo"
          className="h-16 sm:h-20 md:h-24 w-auto object-scale-down"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            imageRendering: "-webkit-optimize-contrast",
            imageRendering: "crisp-edges",
          }}
        />
      </div>
      <div className="mb-4 sm:mb-6 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
          {title}
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">
          {subtitle}
        </p>
      </div>
    </>
  );

  const renderStep1 = () => (
    <form
      onSubmit={handleRegister}
      className="space-y-3 sm:space-y-4 md:space-y-6"
    >
      {renderHeader("Create Your Account", "Get started with accompliq")}
      {(error || localError) && (
        <div className="p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
          {error || localError}
        </div>
      )}
      <div>
        <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full font-medium text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full text-xs sm:text-sm md:text-base bg-[#2241CF] text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Continue"}
      </button>
      <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-[#0E0E0C] font-bold hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );

  const renderStep2 = () => (
    <div className="text-center">
      {renderHeader(
        userInfo?.isVerified ? "Email Verified" : "Verify Your Email",
        userInfo?.isVerified
          ? "Thank you for verifying your email"
          : `We sent a verification link to ${formData.email}`
      )}
      {localError && (
        <div className="mb-3 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
          {localError.includes("already exists") ? (
            <>
              This email is already registered. <br />
              {userInfo?.profileCompleted === "password" ? (
                <button
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                  onClick={() => navigate("/signup?step=3")}
                >
                  Continue to password setup
                </button>
              ) : (
                <button
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                  onClick={() => navigate("/login")}
                >
                  Click here to login
                </button>
              )}
            </>
          ) : (
            localError
          )}
        </div>
      )}
      {userInfo?.isVerified && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2">
          <FaCheck className="text-green-600" />
          Your email has been successfully verified
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <form
      onSubmit={handleSetPassword}
      className="space-y-3 sm:space-y-4 md:space-y-6"
    >
      {renderHeader("Create Password", "Secure your account with a password")}
      {localError && (
        <div className="mb-3 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
          {localError}
        </div>
      )}
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              minLength="6"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash size={14} className="sm:w-4" />
              ) : (
                <FaEye size={14} className="sm:w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="relative">
          <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              minLength="6"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={14} className="sm:w-4" />
              ) : (
                <FaEye size={14} className="sm:w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-xs sm:text-sm md:text-base bg-[#2241CF] text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue"}{" "}
        <FaArrowRight size={12} className="sm:w-3" />
      </button>
    </form>
  );

  const renderStep4 = () => {
    const handleGenderSelect = (gender) => {
      setFormData({ ...formData, gender });
      setIsDropdownOpen(false);
    };

    return (
      <form
        onSubmit={handleUpdateProfile}
        className="space-y-3 sm:space-y-4 md:space-y-6"
      >
        {renderHeader(
          "Tell Us About Yourself",
          "Complete your profile information"
        )}
        {(error || localError) &&
          error?.message !== "Network connection error" &&
          error !== "Network connection error" && (
            <div className="mb-3 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
              {error?.message || error || localError}
            </div>
          )}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full font-medium text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <PhoneInput
                international
                defaultCountry="US"
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className="w-full border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-blue-500"
                // inputClassName="w-full border-0 rounded-lg focus:outline-none focus:ring-0 pl-12 font-medium text-xs sm:text-sm md:text-base"
                style={{
                  "--PhoneInputCountryFlag-marginLeft": "8px",
                  "--PhoneInputCountryFlag-marginRight": "8px",
                }}
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs sm:text-sm md:text-base text-gray-700 mb-1">
              Gender
            </label>

            {/* Custom Dropdown Button */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full text-left bg-white border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-900">
                {formData.gender === "male"
                  ? "Male"
                  : formData.gender === "female"
                  ? "Female"
                  : formData.gender === "other"
                  ? "Other"
                  : "Select Gender"}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <ul className="py-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("male")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        formData.gender === "male"
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Male
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("female")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        formData.gender === "female"
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Female
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleGenderSelect("other")}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        formData.gender === "other"
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Other
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full text-xs sm:text-sm md:text-base bg-[#2241CF] text-white font-medium py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue"}{" "}
          <FaArrowRight size={12} className="sm:w-3" />
        </button>
      </form>
    );
  };

  // ---- Main Render ----
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row items-center justify-center bg-white rounded-xl lg:rounded-2xl shadow-lg w-full max-w-4xl lg:max-w-6xl overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 h-full min-h-[400px] lg:min-h-[500px] bg-gray-50 items-center justify-center p-4 lg:p-6">
          <img
            src={authImage1}
            alt="Authentication visual"
            className="w-full h-full object-contain max-h-[500px] lg:max-h-[600px]"
          />
        </div>
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10">
          {stepFromURL === 1 && renderStep1()}
          {stepFromURL === 2 && renderStep2()}
          {stepFromURL === 3 && renderStep3()}
          {stepFromURL === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
