import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../Assets/AccompliqLogo.png";
import colapsLogo from "../../Assets/AccompliqLogo-02.png";
import {
  FaTachometerAlt,
  FaBookDead,
  FaListUl,
  FaUsers,
  FaUserCog,
  FaMonument,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaSpinner,
  FaCreditCard,
  FaLock,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUserData } from "../../redux/feature/auth/authThunk";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const dispatch = useDispatch();
  const { userInfo, isLoading } = useSelector((state) => state.auth);
  const userRole = userInfo?.role;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch user data on component mount if not already loaded
  useEffect(() => {
    if (!userInfo && isInitialLoad) {
      dispatch(fetchUserData());
      setIsInitialLoad(false);
    }
  }, [dispatch, userInfo, isInitialLoad]);

  const sidebarStyle = {
    background: isCollapsed
      ? "linear-gradient(195deg, #ffffff 0%, #f5f7ff 100%)"
      : "linear-gradient(195deg, #ffffff 0%, #f0f4ff 100%)",
  };

  // --- FIXED: All menu paths now use /app/xxx ---
  const menuItems = [
    ...(userRole === "admin"
      ? [
          {
            name: "Dashboard",
            icon: <FaTachometerAlt className="text-lg" />,
            path: "/dashboard",
            pulse: true,
          },
        ]
      : []),
    {
      name: "Accompliq",
      icon: <FaBookDead className="text-lg" />,
      path: "/accompliq",
    },
    {
      name: "Bucket List",
      icon: <FaListUl className="text-lg" />,
      path: "/bucket-list",
    },
    {
      name: "Family Planning",
      icon: <FaUsers className="text-lg" />,
      path: "/family-planning",
    },
    {
      name: "Personal Planning Form",
      icon: <FaUserCog className="text-lg" />,
      path: "/personal-planning",
    },
    {
      name: "Public Memorial",
      icon: <FaMonument className="text-lg" />,
      path: "/public-memorial",
    },
    {
      name: "Profile Setting",
      icon: <FaUserCircle className="text-lg" />,
      path: "/profile-setting",
    },
    {
      name: "Payment Plans",
      icon: <FaCreditCard className="text-lg" />,
      path: "/payment-plans",
    },
  ];

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-0.5">
      {menuItems.map((item) => (
        <li key={item.name} className="relative z-50">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 text-sm rounded-xl transition-all group hover:shadow-md
              ${
                isActive
                  ? "bg-gradient-to-r from-[#2241CF] to-[#3A5BEF] text-white shadow-lg"
                  : "text-[#717579] hover:bg-white hover:bg-opacity-70"
              }`
            }
            onClick={() => isMobile && setIsMobileOpen(false)}
          >
            <span
              className={`transition-all duration-200 ${
                isCollapsed && !isMobile ? "mx-auto" : "mr-3"
              } ${isCollapsed && !isMobile && "group-hover:scale-125"}`}
            >
              {item.icon}
            </span>
            {(!isCollapsed || isMobile) && (
              <span className="flex-1 flex items-center">{item.name}</span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  // Upgrade Card

const renderUpgradeCard = (isMobile = false) => {
   // Check if user already has premium/family plan
  const isPremiumUser = userInfo?.subscriptionStatus === 'active' && 
  (userInfo?.planType === 'premium' || userInfo?.planType === 'family');
  console.log(isPremiumUser);
  if (isPremiumUser) {
    return null;
  }
  return(
    <div className={`${isMobile ? 'px-4 pb-2' : 'px-4 pb-2'}`}>
    {(!isCollapsed || isMobile) && (
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-3 text-white">
        <div className="bg-white bg-opacity-20 rounded-lg p-1.5 w-8 h-8 flex items-center justify-center mb-2">
          <FaLock className="text-white text-sm" />
        </div>
        <h3 className="text-sm font-bold mb-1">Upgrade Pro</h3>
        <p className="text-[10px] text-blue-100 mb-2 leading-tight">
          Master your family with detailed analytics and clear graphs.
        </p>
        <button className="w-full bg-white text-blue-700 font-semibold py-1.5 px-3 text-xs rounded-lg hover:bg-blue-50 transition-colors">
          Upgrade Now
        </button>
      </div>
    )}
  </div>
  )
}

  const renderProfileSection = (isMobile = false) => {
    if (isLoading && isInitialLoad) {
      return (
        <div className="p-4 border-t border-gray-100 flex justify-center items-center">
          <FaSpinner className="animate-spin text-[#2241CF]" />
        </div>
      );
    }

    return (
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed || isMobile ? (
          <div className="flex items-center group">
            <div className="relative mr-3">
              {userInfo?.profilePicture ? (
                <img
                  src={userInfo.profilePicture}
                  alt={userInfo.fullName || "User"}
                  className={`${
                    isMobile ? "h-8 w-8" : "h-10 w-10"
                  } rounded-full object-cover border border-gray-200`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
                />
              ) : (
                <div
                  className={`${
                    isMobile ? "h-8 w-8" : "h-10 w-10"
                  } rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xl`}
                >
                  {userInfo?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div
                className={`absolute bottom-0 right-0 ${
                  isMobile ? "w-2 h-2" : "w-3 h-3"
                } bg-green-400 rounded-full border-2 border-white`}
              ></div>
            </div>
            <div className="overflow-hidden transition-all duration-300">
              <p className="text-sm font-medium text-[#717579] group-hover:text-[#2241CF] transition-colors truncate">
                {userInfo?.fullName || "User Name"}
              </p>
              <p className="text-xs text-[#717579] group-hover:text-[#2241CF] transition-colors truncate">
                {userInfo?.email || "user@example.com"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
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
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-lg">
                  {userInfo?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border border-white"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-110"
        onClick={() => setIsMobileOpen(true)}
      >
        <FaBars className="text-[#2241CF] text-xl" />
      </button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-screen fixed border-r border-gray-200 shadow-lg overflow-visible z-30"
        style={sidebarStyle}
      >
        <div className="p-4 flex items-center justify-between relative border-b border-gray-100">
          <motion.div
            animate={{ width: isCollapsed ? "2.5rem" : "10rem" }}
            transition={{ duration: 0.3 }}
            className="overflow-visible"
          >
            <img
              src={isCollapsed ? colapsLogo : logo}
              alt="Logo"
              className={`h-8 ${isCollapsed ? "mx-auto" : ""}`}
            />
          </motion.div>
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-[-16px] bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:border-gray-300 z-10 transition-all duration-200 hover:scale-110"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FaChevronRight className="text-[#2241CF]" />
            ) : (
              <FaChevronLeft className="text-[#2241CF]" />
            )}
          </button>
        </div>

        <div className="p-2 overflow-y-auto h-[calc(100vh-220px)]">
          {!isCollapsed && (
            <h2 className="text-xs font-semibold mb-2 text-[#717579] px-3 py-1 bg-white bg-opacity-50 rounded-lg">
              Main Menu
            </h2>
          )}
          {renderMenuItems()}
        </div>

        {renderUpgradeCard()}
        {renderProfileSection()}
      </motion.div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 md:visible"
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-40 shadow-xl md:visible flex flex-col"
              style={sidebarStyle}
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <img src={logo} alt="Logo" className="h-8" />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:scale-110"
                >
                  <FaTimes className="text-[#2241CF]" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto h-[calc(100vh-220px)]">
                <h2 className="text-md font-semibold mb-4 text-[#717579] px-3 py-2 bg-white bg-opacity-50 rounded-lg">
                  Main Menu
                </h2>
                {renderMenuItems(true)}
              </div>

              {renderUpgradeCard(true)}
              {renderProfileSection(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
