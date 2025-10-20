import React, { useState } from "react";

const PrivacyPolicy = () => {
  const [acknowledgedPolicy, setAcknowledgedPolicy] = useState(false);

  const handleAcknowledge = () => {
    setAcknowledgedPolicy(true);
    // You could add navigation logic here
  };

  return (
    <div className="bg-[#1E1E1E] text-white py-20 md:py-20 md:pt-40 px-4 md:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-[#F0B143] md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300 mb-2">
            for Accompliq.com (under MyAutobituary LLC)
          </p>
          <p className="text-sm text-gray-400">
            Effective Date: August 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-lg leading-relaxed">
            At <span className="text-[#F0B143]">Accompliq.com</span>, your privacy is our priority. We are committed to
            protecting any personal information you share with us. This Privacy
            Policy outlines how we collect, use, store, and protect your data.
          </p>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-8">
          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              1. Information We Collect
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>
                  Personal identification information (e.g., name, email
                  address, phone number)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>
                  Sensitive data input by users (e.g., autobiographical details,
                  passwords)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>
                  Payment information (processed via secure third-party
                  services)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>
                  Usage data (e.g., IP address, browser type, session duration)
                </p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              2. How We Use Your Information
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>To provide, personalize, and improve our services</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>To communicate with users regarding updates or support</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>For internal analytics and service development</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#F0B143] mt-1">•</span>
                <p>To comply with legal obligations</p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              3. Information Sharing
            </h2>
            <div className="space-y-4 text-gray-300">
              <p className="font-semibold">
                We do not sell or rent your personal data.
              </p>
              <p>We may share it with:</p>
              <div className="space-y-3 ml-4">
                <div className="flex items-start space-x-3">
                  <span className="text-[#F0B143] mt-1">•</span>
                  <p>
                    Third-party service providers under strict confidentiality
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-[#F0B143] mt-1">•</span>
                  <p>
                    Legal authorities if required by law or to protect our
                    rights
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              4. Data Security
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>
                We use industry-standard encryption, firewalls, and access
                control measures.
              </p>
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4">
                <p className="text-yellow-200 font-medium">
                  Important: However, no system is 100% secure.
                </p>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              5. Your Rights
            </h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300 mb-3">
                You may request to access, update, or delete your personal
                information at any time.
              </p>
              <p className="text-gray-300">
                Please contact{" "}
                <a
                  href="mailto:support@accompliq.com"
                  className="text-[#F0B143] hover:text-[#d69a3a] transition-colors duration-300 font-medium underline"
                >
                  support@accompliq.com
                </a>
              </p>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              6. Changes to This Policy
            </h2>
            <p className="text-gray-300">
              We may update this policy. Continued use of the platform indicates
              acceptance of changes.
            </p>
          </section>
        </div>

        {/* Data Rights Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h4 className="text-[#F0B143] font-semibold mb-2">
              Access Your Data
            </h4>
            <p className="text-gray-400 text-sm">
              Request a copy of your personal information
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h4 className="text-[#F0B143] font-semibold mb-2">
              Update Information
            </h4>
            <p className="text-gray-400 text-sm">
              Modify or correct your personal data
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h4 className="text-[#F0B143] font-semibold mb-2">
              Delete Account
            </h4>
            <p className="text-gray-400 text-sm">
              Request complete removal of your data
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 rounded-lg p-6 mt-12 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-[#F0B143]">
            Contact Us
          </h3>
          <p className="text-gray-300">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <a
            href="mailto:support@accompliq.com"
            className="text-[#F0B143] hover:text-[#d69a3a] transition-colors duration-300 font-medium"
          >
            support@accompliq.com
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Last updated: August 1, 2025</p>
          <p className="mt-2">© 2025 MyAutobituary LLC. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
