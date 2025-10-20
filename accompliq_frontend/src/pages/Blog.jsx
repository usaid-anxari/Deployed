import React from "react";
import Image1 from "../Assets/Iamge1.png";
import Image2 from "../Assets/Iamge2.png";
import Image3 from "../Assets/Iamge3.png";
import Image4 from "../Assets/Iamge4.png";
import Image5 from "../Assets/Iamge5.png";
import Image6 from "../Assets/Iamge6.png";


const Blog = () => {
  return (
    <div className="bg-gray-900 text-white">

      <section className="py-12 md:py-20 bg-white text-center px-4">
        {/* Section Label */}
        <span className="inline-block bg-[#F9F5F2] text-gray-700 text-sm md:text-lg px-3 py-1 md:px-4 md:py-2 rounded-2xl mb-3 md:mb-4">
          BLOG & ARTICLE
        </span>

        {/* Heading */}
        <h2 className="text-[#1E1E1E] text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12">
          Take a look at the latest <br /> articles
        </h2>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image1}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#1E1E1E] text-white text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image2}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#2241CF] text-white text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image3}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#F0B143] text-white text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image4}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#2241CF] text-white text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image5}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#F0B143] text-white text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={Image6}
                alt="blog"
                className="w-full h-40 md:h-48 object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#1E1E1E] text-xs md:text-lg px-2 py-1 md:px-4 md:py-2 rounded-xl md:rounded-2xl">
                STORIES
              </span>
            </div>
            <div className="p-3 md:p-4">
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                May 5, 2022 | 4 MIN READ
              </p>
              <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                How marketing can help your business more than anything.
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
