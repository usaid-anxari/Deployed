import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faqs = () => {
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
      question: "What's the difference between an Accompliq and an obituary?",
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

  return (
    <section className="py-12 md:py-16 md:mt-16 bg-white px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-[#1E1E1E] uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        {faqData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200 focus:text-orange-300 group"
            >
              <h3 className="text-lg font-semibold text-gray-800 pr-4 group-hover:text-orange-300 transition-colors duration-200 focus:text-orange-300 focus:ring-inset group">
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
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-700 leading-relaxed transform transition-all duration-300 translate-y-0">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;