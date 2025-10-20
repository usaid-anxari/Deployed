import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleAgree = () => {
    setAgreedToTerms(true);
    // You could add navigation logic here ----
  };

  return (
    <div className="bg-[#1E1E1E] text-white py-20 md:py-20 md:pt-40 px-4 md:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-[#F0B143] md:text-5xl font-bold mb-4">
            Terms and Conditions
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
            By using Accompliq.com, you agree to these Terms and Conditions. 
            If you do not agree, please do not use the website.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              1. Use of the Site
            </h2>
            <div className="space-y-3 text-gray-300">
              <p>You must be 18 or older to use this platform.</p>
              <p>You are responsible for maintaining the confidentiality of your login credentials.</p>
            </div>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              2. Intellectual Property
            </h2>
            <p className="text-gray-300">
              All content on this site, unless user-submitted, is the property of MyAutobituary LLC. 
              You may not copy, distribute, or exploit any part without permission.
            </p>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              3. User Content
            </h2>
            <p className="text-gray-300">
              You retain ownership of the content you submit, but grant us a non-exclusive 
              license to host, display, and back up your data.
            </p>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              4. Limitation of Liability
            </h2>
            <p className="text-gray-300">
              MyAutobituary LLC is not liable for any indirect or incidental damages 
              resulting from use or inability to use the service.
            </p>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              5. No Legal Advice
            </h2>
            <p className="text-gray-300">
              Accompliq.com is not a law firm. The content provided is for informational 
              purposes and does not constitute legal advice.
            </p>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              6. Termination
            </h2>
            <p className="text-gray-300">
              We may suspend or terminate your access if you violate these terms.
            </p>
          </section>

          <section className="border-l-4 border-[#F0B143] pl-6">
            <h2 className="text-2xl font-bold mb-4 text-[#F0B143]">
              7. Governing Law
            </h2>
            <p className="text-gray-300">
              These Terms are governed by the laws of the State of New Jersey.
            </p>
          </section>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 rounded-lg p-6 mt-12 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-[#F0B143]">Contact Us</h3>
          <p className="text-gray-300">
            If you have any questions about these Terms and Conditions, please contact us at:
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
          <p className="mt-2">
            © 2025 MyAutobituary LLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;