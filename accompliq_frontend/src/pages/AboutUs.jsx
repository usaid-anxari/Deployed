/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaQuoteLeft,
  FaTwitter,
} from "react-icons/fa";
import About1 from "../Assets/about-img1.jpg";
import About2 from "../Assets/about-img2.jpg";
import About3 from "../Assets/about-img3.jpg";
import About4 from "../Assets/about-img4.jpg";
import About5 from "../Assets/about-img5.jpg";
import TahnLane from "../Assets/TahnLane.png";
import AlexMax from "../Assets/AlexMex.png";
import BorkatAli from "../Assets/BorkatAli.png";
import KatieSmith from "../Assets/KatieSmith.png";
import MarufMia from "../Assets/MarufMia.png";
import NiloyMex from "../Assets/NiloyMex.png";
import blog1 from "../Assets/blog1.png";
import blog2 from "../Assets/blog2.png";
import blog3 from "../Assets/blog3.png";
import blog4 from "../Assets/blog4.png";
import blog5 from "../Assets/blog5.png";
import blog6 from "../Assets/blog6.png";
import usePageTitle from "../hooks/usePageTitle";

const About = () => {
  usePageTitle("About Us");

  const testimonials = [
    {
      quote:
        "Filling out legal forms was overwhelming, but Accompliq made it simple and stress-free. Highly recommend!",
      author: "Alex Mex",
      role: "CEO/DIRECTOR",
    },
    {
      quote:
        "Filling out legal forms was overwhelming, but Accompliq made it simple and stress-free. Highly recommend!",
      author: "Alex Mex",
      role: "CEO/DIRECTOR",
    },
    {
      quote:
        "Filling out legal forms was overwhelming, but Accompliq made it simple and stress-free. Highly recommend!",
      author: "Alex Mex",
      role: "CEO/DIRECTOR",
    },
  ];

  const teamSections = [
    {
      title: "CEO & FOUNDER",
      members: [
        {
          name: "Katie Smith",
          role: "CEO & Founder",
          roleColor: "bg-[#2241CF]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: KatieSmith,
        },
        {
          name: "Borkat Ali",
          role: "CEO & Founder",
          roleColor: "bg-[#FF3C78]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: BorkatAli,
        },
        {
          name: "Alex Max",
          role: "CEO & Founder",
          roleColor: "bg-[#4FC553]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: AlexMax,
        },
      ],
    },
    {
      title: "VP TEAM",
      members: [
        {
          name: "Tahn Lane",
          role: "VP TEAM",
          roleColor: "bg-[#F0B143]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: TahnLane,
        },
        {
          name: "Maruf Mia",
          role: "VP TEAM",
          roleColor: "bg-[#4FC553]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: MarufMia,
        },
        {
          name: "Niloy Mex",
          role: "VP TEAM",
          roleColor: "bg-[#FF3C78]",
          bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: NiloyMex,
        },
      ],
    },
  ];

  const blogPosts = [
    { img: blog1, tagColor: "bg-[#1E1E1E]" },
    { img: blog2, tagColor: "bg-[#2241CF]" },
    { img: blog3, tagColor: "bg-[#FF3C78]" },
    { img: blog4, tagColor: "bg-[#2241CF]" },
    { img: blog5, tagColor: "bg-[#FF3C78]" },
    { img: blog6, tagColor: "bg-[#1E1E1E]" },
  ];
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-[#F9F5F2]">

         <div className="content-section">
          <h2 className="content-heading mt-8">A place for your story, your dreams, your peace of mind.</h2>
          <p className="content-paragraph">
           <span className="font-semibold">Accompliq.com</span> is your space to celebrate life, stay organized, and protect your legacy. Capture your personal story through a living&nbsp;<span className="font-semibold">Accompliq</span>, check off your bucket list dreams, and keep your important documents and passwords in one secure place.
          </p>
         
        </div>

        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <div className="mb-8 md:mb-12 ">
            <p className="text-2xl md:text-4xl font-bold text-[#172327]">
              We're a people focused organization
            </p>
          </div>

          {/* Image Grid */}
<div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-6 mb-8">
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <img
      src={About1}
      alt="Our Team"
      className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
    />
  </div>
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <img
      src={About2}
      alt="Our Team"
      className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
    />
  </div>
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <img
      src={About3}
      alt="Our Team"
      className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
    />
  </div>
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <img
      src={About4}
      alt="Our Team"
      className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
    />
  </div>
  <div className="w-full md:w-[48%] lg:w-[30%]">
    <img
      src={About5}
      alt="Our Team"
      className="rounded-2xl shadow-lg w-full h-[360px] object-cover"
    />
  </div>
</div>

        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 md:py-20 bg-gray-50 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-3xl md:text-5xl text-[400] text-[#172327]">
              Testimonials
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* First Testimonial */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <FaQuoteLeft className="bg-[#2241CF] text-2xl md:text-4xl text-[#FFFFFF] p-1 md:p-2 rounded-lg mb-4 md:mb-6" />
              <p className="text-gray-700 text-sm md:text-base text-center mb-4 md:mb-6">
                Filling out legal forms was always overwhelming, but Accompliq
                made it simple and stress-free. Highly recommend!
              </p>
              <div>
                <div className="flex flex-col items-center">
                  <img
                    src={About3}
                    alt="Our Team"
                    className="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover mb-3 md:mb-4"
                  />
                </div>
                <p className="font-bold text-center text-sm md:text-base">
                  Alex Mex
                </p>
                <p className="text-gray-500 text-center text-xs md:text-sm">
                  CEO/DIRECTOR
                </p>
              </div>
            </div>

            {/* Second Testimonial */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <FaQuoteLeft className="bg-[#2241CF] text-2xl md:text-4xl text-[#FFFFFF] p-1 md:p-2 rounded-lg mb-4 md:mb-6" />
              <p className="text-gray-700 text-sm md:text-base text-center mb-4 md:mb-6">
                Filling out legal forms was always overwhelming, but Accompliq
                made it simple and stress-free. Highly recommend!
              </p>
              <div>
                <div className="flex flex-col items-center">
                  <img
                    src={About1}
                    alt="Our Team"
                    className="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover mb-3 md:mb-4"
                  />
                </div>
                <p className="font-bold text-center text-sm md:text-base">
                  Alex Mex
                </p>
                <p className="text-gray-500 text-center text-xs md:text-sm">
                  CEO/DIRECTOR
                </p>
              </div>
            </div>

            {/* Third Testimonial */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
              <FaQuoteLeft className="bg-[#2241CF] text-2xl md:text-4xl text-[#FFFFFF] p-1 md:p-2 rounded-lg mb-4 md:mb-6" />
              <p className="text-gray-700 text-sm md:text-base text-center mb-4 md:mb-6">
                Filling out legal forms was always overwhelming, but Accompliq
                made it simple and stress-free. Highly recommend!
              </p>
              <div>
                <div className="flex flex-col items-center">
                  <img
                    src={About5}
                    alt="Our Team"
                    className="rounded-full w-16 h-16 md:w-20 md:h-20 object-cover mb-3 md:mb-4"
                  />
                </div>
                <p className="font-bold text-center text-sm md:text-base">
                  Alex Mex
                </p>
                <p className="text-gray-500 text-center text-xs md:text-sm">
                  CEO/DIRECTOR
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 md:gap-8">
            <button className="bg-[#FFDEC6] text-black p-2 md:p-3 rounded-full hover:bg-blue-700 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="bg-[#FFDEC6] text-black p-2 md:p-3 rounded-full hover:bg-blue-700 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Blog and article section */}
      <section className="bg-white py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Section Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E]">
            Blogs & Articles
          </h2>
        </div>

        {/* Blog Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left justify-items-center mt-6 md:mt-8">
          {blogPosts.map((post, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-xs"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={post.img}
                  alt={`blog-${i}`}
                  className="w-full h-40 md:h-48 object-cover"
                />
                <span
                  className={`absolute bottom-1 md:bottom-2 left-1 md:left-2 px-2 md:px-4 py-0.5 md:py-1 rounded-xl md:rounded-2xl text-white text-xs md:text-sm font-semibold ${post.tagColor}`}
                >
                  STORIES
                </span>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <p className="text-xs md:text-sm text-gray-500 mb-1">
                  May 5, 2022 | 4 MIN READ
                </p>
                <h3 className="text-sm md:text-base font-semibold text-[#1E1E1E]">
                  How marketing can help your business more than anything.
                </h3>
              </div>
            </div>
          ))}
        </div>
         <p className="content-paragraph mt-12">
            It’s simple, thoughtful, and made for real life. Whether you’re planning or reflecting on what you’ve done, <span className="font-semibold">Accompliq.com</span> helps you stay on top of what matters — with heart, clarity, and peace of mind.
          </p>
      </section>
    </div>
  );
};

export default About;
