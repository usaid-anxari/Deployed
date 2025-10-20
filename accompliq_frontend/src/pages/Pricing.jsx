import { useNavigate } from "react-router-dom";
import planLogo from "../Assets/planLogo.png";
import plan2Logo from "../Assets/plan2Logo.png";
import blueCurve from "../Assets/blueCorve.png";
import yellowCurve from "../Assets/yellowCurve.png";
import usePageTitle from "../hooks/usePageTitle";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EmailSection from "./EmailSection";
// Pricing Plan Component
const PricingPlan = ({ plan }) => {
  usePageTitle("Pricing");
  const navigate = useNavigate();
  const {
    logo,
    price,
    period,
    description,
    features,
    buttonText,
    buttonColor,
    popular,
    darkMode = false,
  } = plan;

  const handleGetStarted = () => {
    navigate("/signup"); // Navigate to signup page
  };




  return (
    <div
      className={`${
        darkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-[#172327]"
      } shadow-lg rounded-xl p-4 md:p-6 w-full sm:w-80 mx-auto mb-8 sm:mb-0`}
    >
      <div className="flex items-center justify-between mb-4">
        <img src={logo} alt="Plan logo" className="w-10 h-10 md:w-12 md:h-12" />
        {popular && (
          <span className="bg-[#2241CF] text-white text-sm md:text-xl font-semibold rounded-xl py-1 px-3 md:px-4">
            Most Popular
          </span>
        )}
      </div>

      <p className="text-xl md:text-2xl font-bold mt-4">
        {price}{" "}
        <span
          className={`${
            darkMode ? "text-gray-200" : "text-[#172327]"
          } text-xs md:text-sm`}
        >
          / {period}
        </span>
      </p>
      <p
        className={`text-left text-xs md:text-sm ${
          darkMode ? "text-white" : "text-gray-600"
        } mt-2 md:mt-4`}
      >
        {description}
      </p>
      <hr className="border-[#E1E0DE] mt-3 md:mt-4" />

      <ul className="text-left mt-3 md:mt-4 space-y-1 md:space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full mr-2 ${
                popular ? "bg-white" : "bg-[#1E1E1E]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-2 w-2 md:h-3 md:w-3 ${
                  popular ? "text-black" : "text-white"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.293 5.293a1 1 0 010 1.414L8.707 14.707a1 1 0 01-1.414 0L3.707 10.707a1 1 0 011.414-1.414L8 12.586l6.879-6.879a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span
              className={`text-xs md:text-sm ${
                darkMode ? "text-white" : "text-gray-600"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <div className="text-left mt-4 md:mt-6">
        <button
          onClick={handleGetStarted}
          className={`mt-4 md:mt-6 ${buttonColor} text-white py-2 px-4 md:px-6 rounded-xl w-full hover:opacity-90 transition-opacity text-sm md:text-base`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ user }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-bold text-[#1E1E1E] text-sm md:text-base">
            {user.name}
          </h4>
          <p className="text-xs md:text-sm text-gray-600">{user.role}</p>
        </div>
      </div>
      <p className="text-[#1E1E1E] mb-3 md:mb-4 text-xs md:text-base">
        {user.testimonial}
      </p>
      <div className="flex space-x-1 text-[#F0B143] text-base md:text-xl">
        {[...Array(5)].map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
    </div>
  );
};

const PricingPage = () => {
    const [openItems, setOpenItems] = useState(new Set());
  const [heights, setHeights] = useState({});
  const contentRefs = useRef({});


useEffect(() => {
    const newHeights = {};
    Object.keys(contentRefs.current).forEach(id => {
      if (contentRefs.current[id]) {
        newHeights[id] = contentRefs.current[id].scrollHeight;
      }
    });
    setHeights(newHeights);
  }, []);

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };


 const faqData = [
    {
      id: 1,
      question: "What is an Accompliq?",
      answer: "An Accompliq is your personal life story — written by you, updated as you grow. It's a living, evolving document where you can reflect on your journey, highlight milestones, and shape your legacy in your own words. Unlike an obituary, it's meant to celebrate your life while you're living it."
    },
    {
      id: 2,
      question: "How does Accompliq help me stay organized?",
      answer: "Accompliq brings everything that matters into one secure, easy-to-access place. From your bucket list goals to important legal forms and passwords, you can track, update, and download everything you need — with tools designed for clarity, simplicity, and peace of mind."
    },
    {
      id: 3,
      question: "Is my information secure?",
      answer: "Yes! We take privacy and security seriously. All your data is stored with encrypted protection, and only you (or those you authorize) can access or update your information. You're in complete control of what is shared, saved, or printed."
    },
    {
      id: 4,
      question: "Can I update my documents and story over time?",
      answer: "Absolutely. Your Accompliq, documents, and password records are all designed to evolve with you. Log in anytime to make edits, track new goals, or update critical information — we make it easy."
    },
    {
      id: 5,
      question: "Who is Accompliq for?",
      answer: "Anyone who wants to live intentionally and leave nothing important behind. Whether you're starting your legacy planning early or catching up on life's paperwork, Accompliq is for individuals, families, and future-focused people of all ages."
    },
    {
      id: 6,
      question: "Is Accompliq only for end-of-life planning?",
      answer: "Not at all. Accompliq is built for living. It's a platform for tracking goals, reflecting on experiences, staying organized, and preparing for the future — all while you're actively living and growing. It's about being intentional now, so you're always ready for what's next."
    },
    {
      id: 7,
      question: "What’s the difference between an Accompliq and an obituary?",
      answer: `An obituary is written after your life ends. An Accompliq is written as you live it. 
While an obituary is typically a summary created by others — often under time constraints and 
with limited details — an Accompliq is your own, ongoing life story written in your voice. It 
highlights not just dates and accomplishments, but the meaning behind them — the lessons, 
passions, and memories that define you. 
 The beauty of an Accompliq is that it's updated over time, so it grows as you do. And when the 
time comes, your Accompliq can become your obituary — already written, already true to who 
you are. In your own words, on your own terms.`
    }
  ];
  const navigate = useNavigate();

  // Pricing plans data
  const plans = [
    {
      logo: planLogo,
      price: "$29.99",
      period: "Month",
      description:
        "Add some details here to describe the type of plan and its particular benefits",
      features: [
        "All limited links",
        "Own analytics Platform",
        "Unlimited users",
        "Chat support",
        "Optimize",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-[#2241CF]",
    },
    {
      logo: planLogo,
      price: "$129.99",
      period: "6 Month",
      description:
        "Add some details here to describe the type of plan and its particular benefits",
      features: [
        "All limited links",
        "Own analytics Platform",
        "Unlimited users",
        "Chat support",
        "Optimize",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-[#2241CF]",
    },
    {
      logo: planLogo,
      price: "$349.9",
      period: "Family",
      description:
        "Add some details here to describe the type of plan and its particular benefits",
      features: [
        "All limited links",
        "Own analytics Platform",
        "Unlimited users",
        "Chat support",
        "Optimize",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-[#2241CF]",
    },
    {
      logo: plan2Logo,
      price: "$199.99",
      period: "Yearly Plan",
      description:
        "Add some details here to describe the type of plan and its particular benefits",
      features: [
        "All limited links",
        "Own analytics Platform",
        "Unlimited users",
        "Chat support",
        "Optimize",
      ],
      buttonText: "Get Started",
      buttonColor: "bg-[#F0B143]",
      popular: true,
      darkMode: true,
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Shahzaib",
      role: "UX UI",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      testimonial:
        "Filling out legal forms was always overwhelming, but Accompliq made it simple and stress-free. Highly recommend!",
    },
    {
      name: "Albart Flores",
      role: "Graphic Designer",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      testimonial:
        "The bucket list feature inspired me to chase my dreams and document my journey. It's been such a rewarding experience!",
    },
    {
      name: "Albart Flores",
      role: "Graphic Designer",
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      testimonial:
        "Creating an online account for my father was such a meaningful experience. The platform was easy to use, and the final tribute.",
    },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="bg-[#F9F5F2] text-white">
      {/* Meet Our Company Section */}
      <section className="pt-12 md:pt-16 px-4 md:px-6 z-10 mt-12">

        <div className="max-w-screen-xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1E1E1E]">
            Pricing built to suit teams of all sizes
          </h2>
          <p className="text-[#172327] mt-2 md:mt-4 mx-auto max-w-md md:max-w-lg text-sm md:text-base">
            Accompliq is an online platform designed to help you celebrate life,
            preserve memories, and plan for the future.
          </p>
        </div>

        <div className="text-center mb-6 md:mb-8 flex flex-wrap justify-center gap-2 md:gap-4">
          <button className="bg-[#FBBC05] text-white font-medium px-3 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-base">
            Monthly plan
          </button>
          <button className="bg-[#FBBC05] text-white font-medium px-3 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-base">
            6 Monthly plan
          </button>
          <button className="bg-[#FBBC05] text-white font-medium px-3 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-base">
            1 year plan
          </button>
          <button className="bg-[#2241CF] text-white font-medium px-3 py-1 md:px-4 md:py-2 rounded-2xl text-xs md:text-base">
            Annual plan
          </button>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <div className="relative pt-12 md:pt-16 pb-12 md:pb-16">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white w-full"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-nowrap overflow-x-auto gap-2 md:gap-8 py-4">
            {plans.map((plan, index) => (
              <PricingPlan key={index} plan={plan} />
            ))}
          </div>
        </div>
      </div>

      {/* Customer Experience Section */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <img
          src={blueCurve}
          alt="blue decorative curve"
          className="absolute top-20 md:top-40 left-0 w-full md:w-[1400px] opacity-72 pointer-events-none"
        />
        <img
          src={yellowCurve}
          alt="yellow decorative curve"
          className="absolute -bottom-4 md:-bottom-8 left-0 w-full md:w-[1200px] opacity-72 pointer-events-none"
        />

        <div className="text-center mb-8 md:mb-12 px-4 z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E] leading-snug">
            Customers love the ease <br /> and simplicity
          </h2>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4">
          {testimonials.map((user, index) => (
            <TestimonialCard key={index} user={user} />
          ))}
        </div>

        <div className="mt-8 md:mt-12 flex justify-center space-x-4 md:space-x-6">
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black text-white text-base md:text-xl">
            &#8592;
          </button>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black text-white text-base md:text-xl">
            &#8594;
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl md:text-3xl font-bold text-[#1E1E1E] uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>
{/* ?cxzv */}
            {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200   focus:text-orange-300  group"
            >
              <h3 className="text-lg font-semibold text-gray-800 pr-4 group-hover:text-orange-300 transition-colors duration-200  focus:text-orange-300 focus:ring-inset group">
                {item.question}
              </h3>
              <div className="flex-shrink-0">
                {openItems.has(item.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-orange-300 transform transition-all duration-300 rotate-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-orange-300 transform transition-all duration-300 rotate-0" />
                )}
              </div>
            </button>
            
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                openItems.has(item.id)
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
              style={{
                height: openItems.has(item.id) ? `${heights[item.id] || 0}px` : '0px',
              }}
            >
              <div 
                ref={(el) => contentRefs.current[item.id] = el}
                className="px-6 pb-5 pt-0"
              >
                <div className="border-t  border-gray-100 pt-4">
                  <p className="text-gray-700 leading-relaxed transform transition-all duration-300 translate-y-0">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

          {/* Join Us Section */}
          
        </div>
      </section>

      
          <EmailSection/>

    </div>
  );
};

export default PricingPage;
