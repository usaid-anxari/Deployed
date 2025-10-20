import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword, loginUser } from "../../redux/feature/auth/authThunk";
import logo from "../../Assets/AccompliqLogo.png";
import forgotPasswordImage from "../../Assets/forgetpasswordRightSide.png";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  // Auto-login after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        if (email) {
          dispatch(loginUser({ email, password })).then((result) => {
            if (loginUser.fulfilled.match(result)) {
              navigate("/dashboard", { replace: true });
            } else {
              navigate("/login", { replace: true });
            }
          });
        } else {
          navigate("/login", { replace: true });
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, email, password, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({ token, newPassword: password })
      );

      if (resetPassword.fulfilled.match(result)) {
        setSuccess(true);
        setEmail(result.payload.email);
      } else {
        setError(result.payload?.message || "Failed to reset password");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-6xl w-full flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-xs text-center">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img src={logo} alt="Accompliq logo" className="h-10 sm:h-12" />
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Well Done!
              </h2>
              <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4">
                Your Password Changed Successfully
              </h3>

              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                Always remember the password for your account
              </p>

              <div className="mt-6 sm:mt-8">
                <p className="text-xs sm:text-sm text-gray-500">
                  Redirecting to login...
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2 relative">
            <img
              src={forgotPasswordImage}
              alt="Success"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-xs text-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <img src={logo} alt="Accompliq logo" className="h-10 sm:h-12" />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Create a new password
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
              Set your password with minimum 8 characters with a combination of
              letters and numbers
            </p>

            {error && (
              <div className="mb-3 sm:mb-4 p-2 bg-red-50 text-red-700 rounded text-xs sm:text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="text-left">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your new password"
                />
              </div>
              <div className="text-left">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2241CF] text-white text-xs sm:text-sm py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={forgotPasswordImage}
            alt="Forgot Password"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
