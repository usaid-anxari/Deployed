import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../Assets/accompliq_new_logo.png";
import { useSelector } from "react-redux";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubmenu = (menu) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileSubmenu(null);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/pricing", label: "Pricing" },
    { path: "/blog", label: "Blog" },
    // { path: "/faq", label: "FAQ" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1E1E1E] py-2 shadow-xl"
          : "bg-[#1E1E1E]/90 py-1 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between">
          {/* Logo with shine effect */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold"
          >
            <NavLink to="/">
              <img
                src={logo}
                alt="accompliq Logo"
                className="h-16 w-auto filter drop-shadow-lg"
              />
            </NavLink>
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.path} className="relative group">
                {link.submenu ? (
                  <>
                    <button
                      className="flex items-center text-white hover:text-[#F0B143] transition-colors"
                      onClick={() => toggleSubmenu(link.path)}
                    >
                      {link.label}
                      <FaChevronDown className="ml-1 text-xs" />
                    </button>
                    <AnimatePresence>
                      {mobileSubmenu === link.path && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 mt-2 w-48 bg-[#2A2A2A] rounded-lg shadow-xl py-2 z-50"
                        >
                          {link.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.path}
                              to={subItem.path}
                              className="block px-4 py-2 text-white hover:bg-[#3A3A3A] hover:text-[#F0B143]"
                            >
                              {subItem.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative py-2 ${
                        isActive
                          ? "text-[#F0B143]"
                          : "text-white hover:text-[#F0B143]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.span
                            className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F0B143]"
                            layoutId="navUnderline"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              userInfo?.role === "admin" ? ( // Check if user is admin
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#F0B143] text-[#1E1E1E] font-medium"
                        : "text-white hover:bg-[#2A2A2A]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              ) : (
                <NavLink
                  to="/accompliq"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#F0B143] text-[#1E1E1E] font-medium"
                        : "text-white hover:bg-[#2A2A2A]"
                    }`
                  }
                >
                  {/* My Account */}
                </NavLink>
              )
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-white hover:text-[#F0B143] transition-colors px-4 py-2"
                >
                  Login
                </NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink to="/signup">
                    <button className="bg-gradient-to-r from-[#F0B143] to-[#FFD166] text-[#1E1E1E] px-6 py-2 rounded-full hover:shadow-lg transition-all font-medium">
                      Sign Up
                    </button>
                  </NavLink>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-6 space-y-4">
                {navLinks.map((link) => (
                  <div key={link.path}>
                    {link.submenu ? (
                      <div className="mb-2">
                        <button
                          className="flex items-center justify-between w-full text-left text-white py-3 px-4 rounded-lg hover:bg-[#2A2A2A]"
                          onClick={() => toggleSubmenu(link.path)}
                        >
                          <span>{link.label}</span>
                          {mobileSubmenu === link.path ? (
                            <FaChevronUp className="text-xs" />
                          ) : (
                            <FaChevronDown className="text-xs" />
                          )}
                        </button>
                        <AnimatePresence>
                          {mobileSubmenu === link.path && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-6 space-y-2"
                            >
                              {link.submenu.map((subItem) => (
                                <NavLink
                                  key={subItem.path}
                                  to={subItem.path}
                                  className="block py-2 px-4 text-white hover:text-[#F0B143] rounded-lg hover:bg-[#2A2A2A]"
                                >
                                  {subItem.label}
                                </NavLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-lg ${
                            isActive
                              ? "bg-[#F0B143] text-[#1E1E1E] font-medium"
                              : "text-white hover:bg-[#2A2A2A]"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-700 space-y-4">
                  {isAuthenticated ? (
                    userInfo?.role === "admin" ? ( // Check if user is admin
                      <NavLink
                        to="/dashboard"
                        className="block text-center py-3 px-4 bg-[#F0B143] text-[#1E1E1E] font-medium rounded-lg"
                      >
                        Dashboard
                      </NavLink>
                    ) : (
                      <NavLink
                        to="/accompliq"
                        className="block text-center py-3 px-4 bg-[#F0B143] text-[#1E1E1E] font-medium rounded-lg"
                      >
                        My Account
                      </NavLink>
                    )
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="block py-3 px-4 text-white hover:bg-[#2A2A2A] rounded-lg text-center"
                      >
                        Login
                      </NavLink>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <NavLink to="/signup">
                          <button className="w-full py-3 bg-gradient-to-r from-[#F0B143] to-[#FFD166] text-[#1E1E1E] rounded-full font-medium">
                            Sign Up
                          </button>
                        </NavLink>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
