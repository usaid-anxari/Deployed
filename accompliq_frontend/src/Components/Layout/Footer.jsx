import React from "react";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../Assets/accompliq_new_logo.png";

const Footer = () => {
  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Enhanced Link component that scrolls to top on click
  const ScrollToTopLink = ({ to, children, className, ...props }) => (
    <Link to={to} className={className} onClick={scrollToTop} {...props}>
      {children}
    </Link>
  );

  return (
    <footer className="bg-[#1E1E1E] text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left section - Full width on mobile */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              Your life, organized — your legacy, preserved.
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              <ScrollToTopLink
                to="/"
                className="transition-colors inline-block py-1 text-white font-semibold"
              >
                Accompliq.com
              </ScrollToTopLink>
              &nbsp; is your all-in-one platform to track life goals, organize
              essential documents, and write your evolving personal story — all
              while preserving your legacy with purpose and clarity.
            </p>

            {/* Social Media Links - Enhanced Version */}
            <div className="flex space-x-6 mb-6 mt-4 justify-left">
              {[
                {
                  icon: <FaYoutube />,
                  color: "text-red-600 hover:text-white hover:bg-red-600",
                  url: "https://www.youtube.com/channel/UCKyDSJSIL2u7nz2IjPBghsQ",
                  name: "YouTube",
                },
                {
                  icon: <FaFacebookF />,
                  color: "text-blue-600 hover:text-white hover:bg-blue-600",
                  url: "https://www.facebook.com/profile.php?id=61577991717891",
                  name: "Facebook",
                },
                {
                  icon: <FaTwitter />,
                  color: "text-blue-500 hover:text-white hover:bg-blue-500",
                  url: "https://x.com/accompliq",
                  name: "Twitter",
                },
                {
                  icon: <FaInstagram />,
                  color:
                    "text-pink-600 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600",
                  url: "https://www.instagram.com/accompliq/",
                  name: "Instagram",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
        ${social.color}
        flex items-center justify-center
        w-8 h-8 
        rounded-full 
        border-2 border-current
        text-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-110 hover:shadow-lg
        group
      `}
                  aria-label={`Visit our ${social.name} page`}
                >
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
            {/* Logo Section */}
            <div>
              <img src={logo} alt="accompliq Logo" className="h-16 md:h-16" />
            </div>
          </div>

          {/* Overview links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Overview</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              {[
                { path: "/", label: "Home" },
                { path: "/about", label: "About" },
                { path: "/pricing", label: "Pricing" },
                { path: "https://blog.accompliq.com/", label: "Blog" },
                { path: "/contact", label: "Contact" },
              ].map((link, index) => (
                <li key={index}>
                  <ScrollToTopLink
                    to={link.path}
                    className="hover:text-white transition-colors block py-1"
                  >
                    {link.label}
                  </ScrollToTopLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Page Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Pages</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              {[
                { path: "/login", label: "Login" },
                { path: "/sample-accompliqs", label: "Sample Accompliq's" },
                { path: "/sample-buckets", label: "Sample Bucket List" },
                { path: "/passwords", label: "Passwords Templates" },
                { path: "/faqs", label: "FAQS" },
                { path: "/newsletter", label: "Newsletter" },
              ].map((link, index) => (
                <li key={index}>
                  <ScrollToTopLink
                    to={link.path}
                    className="hover:text-white transition-colors block py-1"
                  >
                    {link.label}
                  </ScrollToTopLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Connect</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <p>+001 234 567 89</p>
              <p>support@accompliq.com</p>
              <p className="mt-4">
                Monday - Friday: 9am - 6pm
                <br />
                Saturday: 10am - 4pm
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Accompliq. All rights reserved. Powered by <a href="https://thinkasa.com/" target="_blank" rel="noopener noreferrer"><i>Thinkasa</i></a> </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ScrollToTopLink
              to="/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Terms & Condition
            </ScrollToTopLink>
            <ScrollToTopLink
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy policy
            </ScrollToTopLink>
            <ScrollToTopLink
              to="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
