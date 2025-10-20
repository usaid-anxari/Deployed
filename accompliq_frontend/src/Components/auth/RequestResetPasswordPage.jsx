import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../redux/feature/auth/authThunk";
import forgotPasswordImage from "../../Assets/forgetpasswordRightSide.png";
import logo from "../../Assets/logo_black_text.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const RequestResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      const result = await dispatch(requestPasswordReset(email));

      if (requestPasswordReset.fulfilled.match(result)) {
        setMessage("Password reset instructions have been sent to your email");
        setEmailSent(true);
      } else {
        setError(
          result.payload?.message || "Failed to send reset instructions"
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Content */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-xs text-center">
            {/* Logo */}
            <div className="mb-4 sm:mb-6 flex justify-center">
              <img src={logo} alt="accompliq logo" className="h-10 sm:h-16" />
            </div>

            {!emailSent ? (
              <>
                {/* Forgot Password Form */}
                <div className="flex items-center justify-center mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Forgot Password
                  </h2>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                  Enter your email for instructions.
                </p>

                {error && (
                  <div className="mb-3 sm:mb-4 p-2 bg-red-50 text-red-700 rounded text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="text-left relative">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400"
                        />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#2241CF] text-white text-xs sm:text-sm py-2 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Sending..." : "Send Link"}
                    </button>
                    <Link
                      to="/login"
                      className="block w-full text-center text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-xl hover:text-gray-800 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  Check your email
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                  We sent a password reset link to your email.
                </p>
                <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 font-medium">
                  Please check your inbox
                </p>

                <div className="mt-4 sm:mt-6">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Didn't receive the email?{" "}
                    <button
                      onClick={handleSubmit}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <div className="mt-6 sm:mt-8">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src={forgotPasswordImage}
            alt="Forgot password"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
