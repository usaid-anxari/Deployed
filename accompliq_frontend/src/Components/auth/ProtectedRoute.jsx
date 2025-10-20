/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser, fetchUserData } from "../../redux/feature/auth/authThunk";
import { jwtDecode } from "jwt-decode";
import Loader from "../../Utils/Loader";

// Token expiration check utility function
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Token decoding error:", error);
    return true;
  }
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get auth state from Redux
  const { isAuthenticated, userInfo, loading, error } = useSelector(
    (state) => state.auth
  );

  // Get token from localStorage (consistent with authToken naming)
  const token = localStorage.getItem("authToken");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Don't proceed if still loading
    if (loading) return;

    const verifyAuthentication = async () => {
      // Case 1: No token at all - redirect to login
      if (!token) {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        setAuthChecked(true);
        return;
      }

      // Case 2: Token exists but is expired
      if (isTokenExpired(token)) {
        await dispatch(logoutUser());
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
        setAuthChecked(true);
        return;
      }

      // Case 3: Token exists but we're not authenticated - try to fetch user data
      if (!isAuthenticated && token) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          await dispatch(logoutUser());
          navigate("/login", {
            replace: true,
            state: { from: location.pathname },
          });
          setAuthChecked(true);
          return;
        }
      }

      // Case 4: Check if route requires specific role
      if (requiredRole && userInfo?.role !== requiredRole) {
        navigate("/unauthorized", { replace: true });
        setAuthChecked(true);
        return;
      }

      // Case 5: Handle profile completion steps
      const profileStep = userInfo?.profileCompleted || "email";

      // Redirect to profile completion if needed
      // Example snippet for ProtectedRoute.js
      const isOnboarding =
        location.pathname.startsWith("/signup") ||
        location.pathname.startsWith("/login") ||
        location.pathname === "/";

      if (
        profileStep === "subscription" &&
        isOnboarding &&
        !location.pathname.startsWith("/ChoosePlanPage")
      ) {
        // Only redirect if the user is in onboarding or signup flow
        navigate("/choose-plan", { replace: true });
        setAuthChecked(true);
        return;
      }

      setAuthChecked(true);
    };

    verifyAuthentication();
  }, [
    isAuthenticated,
    token,
    userInfo,
    loading,
    navigate,
    dispatch,
    location,
    requiredRole,
  ]);

  // Show loading state while checking auth
  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Show error message if there's an error

  // Render children if authenticated

  // Block rendering until we *know* user info is ready
  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && userInfo?.role !== requiredRole) {
    return null;
  }

  // ✅ Render children only when checks are done
  return children;
};

export default ProtectedRoute;
