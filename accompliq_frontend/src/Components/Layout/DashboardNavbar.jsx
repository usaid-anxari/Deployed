import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/feature/auth/authThunk";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBell } from "react-icons/fa";

const DashboardNavbar = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from redux
  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Route-to-title map: use /app/... keys
  const routeTitles = {
    "/dashboard": "Dashboard",
    "/accompliq": "Accompliq",
    "/bucket-list": "Bucket List",
    "/family-planning": "Family Planning",
    "/personal-planning": "Personal Planning",
    "/public-memorial": "Public Memorial",
    "/profile-setting": "Profile Setting",
  };

  const pageTitle = routeTitles[location.pathname] || "Dashboard";

  // Use first letter of name as avatar fallback
  const avatarLetter = userInfo?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      className={`bg-white shadow-sm py-4 px-4 sm:px-6 fixed top-0 left-0 z-20 transition-all duration-300`}
      style={{
        left: isCollapsed ? "5rem" : "16rem",
        width: isCollapsed ? "calc(100% - 5rem)" : "calc(100% - 16rem)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-y-3 sm:gap-y-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
          {pageTitle}
        </h1>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FaBell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            {userInfo?.profilePicture ? (
              <img
                src={userInfo.profilePicture}
                alt={userInfo.fullName || "User"}
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {avatarLetter}
              </div>
            )}
            <span className="text-gray-700 hidden sm:inline">
              {userInfo?.fullName || "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
