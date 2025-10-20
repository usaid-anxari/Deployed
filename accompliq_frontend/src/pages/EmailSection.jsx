import React, { useState } from 'react';
import { addContactToBrevo, validateForm } from "../Utils/brevoApi.js";
import { showToast, TOAST_MESSAGES, ToastContainer } from "../Utils/toastConfig.js";
import goldenStripes from "../Assets/goldenStripes.svg";

const EmailSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast.error(TOAST_MESSAGES.NEWSLETTER_VALIDATION_ERROR);
      return;
    }
    
    setLoading(true);
    
    // Show loading toast
    const loadingToastId = showToast.loading(TOAST_MESSAGES.NEWSLETTER_SUBSCRIBE_LOADING);
    
    try {
      // Submit to Brevo - Accompliq Subscribers list
      const result = await addContactToBrevo(formData.email, formData.name);
      
      // Dismiss loading toast
      showToast.dismiss(loadingToastId);
      
      if (result.success) {
        // Reset form on success
        setFormData({ name: '', email: '' });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showToast.dismiss(loadingToastId);
      showToast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Container - Add this to show toasts */}
      <ToastContainer />
      
      <section className="w-full px-4 py-12 md:py-20 bg-white flex justify-center items-center">
        <div className="bg-[#1E1E1E] text-white rounded-2xl px-6 py-8 md:px-10 md:py-12 max-w-6xl w-full flex flex-col lg:flex-row justify-between items-start relative overflow-hidden">
          {/* Left Content */}
          <div className="lg:w-1/2 w-full mb-8 md:mb-10 lg:mb-0 lg:pr-8">
            <h2 className="text-[#F0B143] pb-4">
              Stay Inspired. Stay Accomplished
            </h2>
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Join the Accompliq Newsletter
            </h2>
            <p className="text-sm md:text-base mt-6 md:mt-10 leading-relaxed">
              Discover the power of Accompliq and take control of your legacy.
              Let's celebrate life, one memory at a time.
            </p>
          </div>

          {/* Right Form */}
          <div className="lg:w-1/2 w-full space-y-3 md:space-y-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Name input */}
              <div className={`flex items-center border rounded-full px-4 py-2 md:py-3 mb-3 md:mb-4 transition-colors ${
                errors.name ? 'border-red-400' : 'border-gray-300 focus-within:border-[#F0B143]'
              }`}>
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white mr-2 md:mr-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="bg-transparent w-full outline-none text-white placeholder-white text-sm md:text-base"
                  disabled={loading}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-red-400 text-sm mb-2 px-2" role="alert">
                  {errors.name}
                </p>
              )}

              {/* Email input */}
              <div className={`flex items-center border rounded-full px-4 py-2 md:py-3 mb-3 md:mb-4 transition-colors ${
                errors.email ? 'border-red-400' : 'border-gray-300 focus-within:border-[#F0B143]'
              }`}>
                <svg
                  className="w-4 h-4 md:w-6 md:h-6 text-white mr-2 md:mr-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="bg-transparent w-full outline-none text-white placeholder-white text-sm md:text-base"
                  disabled={loading}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-400 text-sm mb-2 px-2" role="alert">
                  {errors.email}
                </p>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#F0B143] hover:bg-[#E09A32] text-white font-semibold px-6 py-2 md:py-3 rounded-xl text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#F0B143] focus:ring-opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </span>
                ) : (
                  'Join Accompliq'
                )}
              </button>
            </form>
          </div>

          {/* Bottom Right Decoration */}
          <img
            src={goldenStripes}
            alt="Decoration"
            className="absolute bottom-0 right-0 w-24 md:w-48 opacity-80 pointer-events-none"
          />
        </div>
      </section>
    </div>
  );
};

export default EmailSection;