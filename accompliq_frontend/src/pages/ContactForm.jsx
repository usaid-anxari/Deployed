/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaYoutube,
} from "react-icons/fa";
import blog2 from "../Assets/blog2.png";
import blog3 from "../Assets/blog3.png";
import blog5 from "../Assets/blog5.png";
import usePageTitle from "../hooks/usePageTitle";

const Contact = () => {
  usePageTitle("Contact");
  const testimonials = [
    {
      name: "Shahzalb",
      role: "UX UI Designer",
      quote:
        "Filling out legal forms was always overwhelming, but Accompliq made it simple and stress-free. Highly recommend!",
      rating: 5,
      image: blog2,
    },
    {
      name: "Albert Flores",
      role: "Graphic Designer",
      quote:
        "The bucket list feature inspired me to chase my dreams and document my journey. It's been such a rewarding experience!",
      rating: 5,
      image: blog3,
    },
    {
      name: "Albert Flores",
      role: "Graphic Designer",
      quote:
        "Creating an online accompliq for my father was such a meaningful experience. The platform was easy to use, and the final tribute.",
      rating: 5,
      image: blog5,
    },
  ];

  return (
    <div className="bg-white">
      {/* Contact Form Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-[#1E1E1E]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column */}
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Get in touch with our <br className="hidden md:block" /> team
              today.
            </h2>
            <p className="mb-6 md:mb-8 text-sm md:text-base">
              Have questions? Let's Chat! Fill out the form below{" "}
              <br className="hidden md:block" /> and one of our team members
              will reach out as soon <br className="hidden md:block" /> as
              possible.
            </p>

            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Socials
              </h3>
              <div className="flex space-x-3 md:space-x-4 ">
                <a href="https://x.com/accompliq" className="text-blue-500 rounded-2xl p-1 border-white hover:text-white hover:bg-blue-500">
                  <FaTwitter size={24} className="md:w-6" />
                </a>
                <a href="https://www.youtube.com/channel/UCKyDSJSIL2u7nz2IjPBghsQ" className="text-red-600 rounded-2xl p-1 border-white hover:text-white hover:bg-red-600">
                  <FaYoutube size={24} className="md:w-6" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61577991717891" className="text-blue-600 rounded-2xl p-1 border-white hover:text-white hover:bg-blue-600">
                  <FaFacebook size={24} className="md:w-6" />
                </a>
                <a href="https://www.instagram.com/accompliq/" className="text-pink-600 rounded-2xl p-1 border-white hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600">
                  <FaInstagram size={24} className="md:w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
              Get in touch with us
            </h3>
            <form className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs md:text-sm text-gray-700 mb-1"
                  >
                    First name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="bg-[#E1E1E1] w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs md:text-sm text-gray-700 mb-1"
                  >
                    Last name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="bg-[#E1E1E1] w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs md:text-sm text-gray-700 mb-1"
                >
                  Work Mail*
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-[#E1E1E1] w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs md:text-sm text-gray-700 mb-1"
                >
                  Phone number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="bg-[#E1E1E1] w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs md:text-sm text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={3}
                  className="bg-[#E1E1E1] w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="consent"
                  className="text-xs md:text-sm text-[#474747]"
                >
                  By clicking submit below, you consent to Justuno storing and
                  processing the personal information submitted to provide the
                  content requested.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2241CF] text-white py-2 px-4 rounded-xl md:rounded-2xl hover:bg-blue-700 transition duration-200 text-sm md:text-base"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-[#F9F5F2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Customers love the ease and simplicity
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-sm border border-gray-200"
              >
                {/* Profile Picture and Name */}
                <div className="flex items-center mb-3 md:mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 md:mr-4"
                  />
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs md:text-base text-gray-700">
                  {testimonial.quote}
                </p>
                {/* Star Rating */}
                <div className="flex mt-3 md:mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
