/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../Assets/asian-couple-hero.jpg";
import familyHeroImg from "../Assets/black-family-hero.jpg";

import { FaCommentDots, FaPlay } from "react-icons/fa";
import blackFamily from "../Assets/black-family.jpg";
import redAccent from "../Assets/redAccent.png";
import greenUnderline from "../Assets/greenUnderline.svg";
import travelIcon from "../Assets/travel.png";
import writeIcon from "../Assets/write.png";
import healthIcon from "../Assets/health.png";
import legacyIcon from "../Assets/legacy.png";
import sampleImage from "../Assets/couples.jpg";
import orangeAccent from "../Assets/orangeAccent.png";
import decorative from "../Assets/Decorative.jpg";
import decor from "../Assets/decor.png";
import user1 from "../Assets/user1.png";
import user2 from "../Assets/user2.png";
import user3 from "../Assets/user3.png";
import thumbnail from "../Assets/thumbnail.png";
import pingdom from "../Assets/pingdom.png";
import Pendo from "../Assets/pendo.png";
import sendgrid from "../Assets/sendgrid.png";
import lattice from "../Assets/lattice.png";
import gitlab from "../Assets/gitlab.png";
import LBlue from "../Assets/LBlue.png";
import LBlue2 from "../Assets/LBlue2.png";
import LBlue3 from "../Assets/LBlue3.png";
import LBlue4 from "../Assets/LBlue4.png";
import RBlue from "../Assets/RBlue.png";
import RBlue2 from "../Assets/RBlue2.png";
import RBlue3 from "../Assets/RBlue3.png";
import RBlue4 from "../Assets/RBlue4.png";
import yellowCurve from "../Assets/yellowCurve.png";
import blueCurve from "../Assets/blueCorve.png";
import goldenStripes from "../Assets/goldenStripes.svg";
import Image1 from "../Assets/Iamge1.png";
import Image2 from "../Assets/Iamge2.png";
import Image3 from "../Assets/Iamge3.png";
import Image4 from "../Assets/Iamge4.png";
import Image5 from "../Assets/Iamge5.png";
import Image6 from "../Assets/Iamge6.png";
import usePageTitle from "../hooks/usePageTitle";
import EmailSection from "./EmailSection";

const Home = () => {
  usePageTitle("Home");
  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-[#1E1E1E] text-white py-20 md:py-40 px-4 md:px-6 relative">
        {/* Clip path for slanted bottom */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-[#FFFFFF] slanted-bottom"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Container for Left & Right Content */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Side: Heading & Description */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Track your dreams,
                <br />
                <span className="text-white font-extrabold">
                  Tell your story,
                </span>{" "}
                <br />
                Protect your legacy
              </h1>
            </div>

            {/* Right Side: Description & Button */}
            <div className="lg:w-1/2">
              <p className="text-base md:text-lg text-gray-300 mb-3">
                Where your story, dreams, and legacy come together. Track your
                bucket list, organize your most important documents, and write
                the evolving story of your life — all in one place.
              </p>
              <p className="text-base md:text-lg text-gray-300 mb-6">
                Your story deserves to be told — and updated — while you're
                living it.<span class="font-bold"> Accompliq.com</span> lets you
                shape your personal narrative, reflect on your milestones, and
                leave a legacy that feels authentic, uplifting, and complete.
              </p>
              <Link
                to="/login"
                className="inline-block"
                style={{ textDecoration: "none" }}
              >
                <button className="bg-[#F0B143] text-[#000] font-semibold px-6 py-3 rounded-full flex items-center space-x-2 hover:shadow-lg transition">
                  <span>Get Started</span>
                  <span className="ml-2">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Image & Floating Stats */}
          <div className="relative mt-10 flex justify-center">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full max-w-2xl rounded-lg shadow-lg aspect-video object-cover"
            />

            {/* Floating Stats Box - Hidden on mobile, shown on md and up */}
            <div className="hidden md:absolute md:bottom-16 md:right-10 lg:right-80 bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col items-center w-40 md:w-48">
              <div className="absolute -top-4 md:-top-6 bg-[#F0B143] text-white rounded-full p-2 md:p-3 shadow-md flex items-center justify-center w-10 h-10 md:w-14 md:h-14 border-[3px] md:border-[5px] border-white">
                <FaCommentDots className="text-xl md:text-2xl" />
              </div>
              {/* Number Count */}
              <p className="text-2xl md:text-3xl font-bold text-black mt-6">
                +380
              </p>

              {/* Progress Bars */}
              <div className="w-full h-2 bg-gray-300 rounded-full mt-3"></div>
              <div className="w-4/6 h-1 bg-gray-300 rounded-full mt-2"></div>

              {/* Green Button Bar (Adjusting Margin/Padding) */}
              <div className="w-full h-5 md:h-7 bg-[#59D7C9] rounded-full mt-3 mb-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover the Power Section */}
      <section className="py-16 md:py-20 bg-[#F9F5F2]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 md:px-6">
          {/* Left Side: Image with Decoration */}
          <div className="relative lg:w-1/2 mb-10 lg:mb-0 flex justify-center lg:justify-start">
            <img
              src={blackFamily}
              alt="Discover Section"
              className="rounded-lg shadow-lg w-full max-w-sm"
            />

            {/* Red Accent Marks (Top Left) */}
            <div className="absolute -top-8 -left-8 md:-top-14 md:-left-14">
              <img src={redAccent} alt="Accent" className="w-12 md:w-18" />
            </div>

            {/* Green Underline Decoration (Bottom Right) */}
            <div className="absolute -bottom-4 right-20 md:-bottom-8 md:right-44">
              <img
                src={greenUnderline}
                alt="Underline"
                className="w-32 md:w-45"
              />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:w-1/2 lg:pl-8 xl:pl-16 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              A living record of your life <br />
              written by you <br />
              {/* <span className="text-black">Accompliq.</span> */}
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-6">
              An <span class="font-bold">Accompliq</span> is your personal life
              story — written, shaped, and updated by you. More than a
              biography, it’s a dynamic reflection of who you are, what you’ve
              done, and what you value. From major milestones to meaningful
              memories, your Accompliq captures your essence as you grow,
              evolve, and continue to live your truth. It’s your legacy — told
              on your terms.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 md:px-6">
          {/* Left Side: Heading & Description */}
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0 lg:pr-10">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Life’s too short for “one day.” <br />
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-8">
              Your bucket list isn’t just about far-off fantasies — it’s about
              making space for purpose, passion, and possibility. At
              <span class="font-bold"> Accompliq.com</span>, you can create,
              track, and check off the adventures, goals, and personal triumphs
              that matter most to you. Whether it’s skydiving or publishing a
              book, we help turn “one day” into “day one.”
            </p>
            {/* CTA Button */}

            <Link to="/about" style={{ textDecoration: "none" }}>
              <button className="bg-[#2241CF] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-700 transition">
                About Us
              </button>
            </Link>
          </div>

          {/* Right Side: Features Grid */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 bg-[#F9F5F2] rounded-lg shadow-lg">
            {/* Feature 1 */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={travelIcon}
                alt="Customizable"
                className="w-10 md:w-12 mb-3 md:mb-4"
              />
              <h3 className="text-lg md:text-xl text-[#1E1E1E] font-semibold mb-2 md:mb-3">
                TRAVEL
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Create a personalized tribute that reflects their unique life.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={writeIcon}
                alt="Easy Sharing"
                className="w-10 md:w-12 mb-3 md:mb-4"
              />
              <h3 className="text-lg md:text-xl text-[#1E1E1E] font-semibold mb-2 md:mb-3">
                WRITE
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Share the accompliq via social media, email, or direct link.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={healthIcon}
                alt="Forever Access"
                className="w-10 md:w-12 mb-3 md:mb-4"
              />
              <h3 className="text-lg md:text-xl text-[#1E1E1E] font-semibold mb-2 md:mb-3">
                HEALTH
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Keep the memory alive with a permanent online memorial.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <img
                src={legacyIcon}
                alt="Interactive"
                className="w-10 md:w-12 mb-3 md:mb-4"
              />
              <h3 className="text-lg md:text-xl text-[#1E1E1E] font-semibold mb-2 md:mb-3">
                LEGACY 
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Add, edit, and check off items as you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover section */}
      <section className="py-16 md:py-20 bg-[#F9F5F2]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4 md:px-6">
          {/* Left Side: Image with Floating Stats */}
          <div className="relative lg:w-1/2 flex justify-center mb-10 lg:mb-0">
            <img
              src={sampleImage}
              alt="Discover Section"
              className="w-full max-w-md rounded-lg shadow-lg"
            />

            <div className="absolute -top-8 left-4 md:-top-16 md:left-10">
              <img src={orangeAccent} alt="Accent" className="w-12 md:w-18" />
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0 lg:pl-8 xl:pl-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight">
              Peace of mind starts here <br />
              Simplify the serious <br /> stuff.
            </h2>
            <p className="text-base md:text-lg text-gray-700 mt-4 mb-6">
              From wills and healthcare directives to insurance policies and
              power of attorney. <span class="font-bold">Accompliq.com</span>{" "}
              helps you organize your essential legal documents with clarity and
              confidence. No more scrambling or second-guessing. With everything
              in one place, your loved ones are protected, and your wishes are
              always clear.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Link to="/blog" style={{ textDecoration: "none" }}>
                <button className="bg-[#2241CF] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-700 transition">
                  Know More
                </button>
              </Link>
              <Link
                to="/signup"
                className="inline-block"
                style={{ textDecoration: "none" }}
              >
                <button className="bg-[#F0B143] text-[#ffffff] font-semibold px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 hover:shadow-lg transition">
                  <span>Get Started</span>
                  <FaPlay className="ml-2" />
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Accompliq total user */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col-reverse lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Passwords may change, <br />
              your peace of mind <br />
              shouldn’t.
              {/* <span className="text-black">Nisa.</span> */}
            </h2>
            <p className="text-gray-600 mb-3 text-base md:text-lg">
              Your online accounts are just as important as your paperwork.{" "}
              <span class="font-bold">Accompliq.com</span> offers a simple,
              secure way to keep track of your most current passwords, schedule
              updates, print a copy, and ensure your loved ones have access when
              it matters most.
            </p>
            <p className="text-gray-600 mb-6 text-base md:text-lg">
              <span class="font-bold">Accompliq.com</span> provides a
              centralized, secure location for recording and maintaining your
              most current passwords. This tool allows you to update and print
              your login credentials with ease, ensuring that essential digital
              information is accessible to those you trust — precisely when it’s
              needed most
            </p>
             <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="bg-[#2241CF] text-white font-semibold px-6 py-3 rounded-2xl hover:bg-blue-700 transition">
                Get Started
              </button>
            </Link>
          </div>

          {/* Right Image Card */}
          <div className="relative lg:w-1/2 flex justify-center">
            {/* Main Card Container */}
            <div className="bg-[#F9F5F2] p-2 md:p-3 rounded-xl relative">
              <img
                src={decorative}
                alt="Decorative"
                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-xl"
              />

              {/* Decorative Icon Top-Right */}
              <div className="absolute -top-6 -right-6 md:-top-11 md:-right-10">
                <img src={decor} alt="decor" className="w-12 md:w-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* spotlight main feature */}
      <section className="relative overflow-hidden">
        {/* Top Half - Black Section with Video and Heading */}
        <div className="bg-[#1E1E1E] py-16 md:py-20 relative z-10">
          {/* Decorative Blue Corners */}
          <img
            src={LBlue}
            alt="blue decor"
            className="absolute -top-0 -left-0 h-16 md:h-32"
          />
          <img
            src={LBlue2}
            alt="blue decor"
            className="absolute top-0 left-0 h-32 md:h-52"
          />
          <img
            src={LBlue3}
            alt="blue decor"
            className="absolute top-0 left-0 h-40 md:h-60"
          />
          <img
            src={LBlue4}
            alt="blue decor"
            className="absolute top-0 left-0 h-60 md:h-80"
          />

          <img
            src={RBlue}
            alt="blue decor"
            className="absolute top-20 md:top-40 right-0 h-20 md:h-40"
          />
          <img
            src={RBlue2}
            alt="blue decor"
            className="absolute top-10 md:top-20 right-0 h-40 md:h-60"
          />
          <img
            src={RBlue3}
            alt="blue decor"
            className="absolute top-4 md:top-8 -right-1 md:-right-2 h-48 md:h-72"
          />
          <img
            src={RBlue4}
            alt="blue decor"
            className="absolute -top-2 md:-top-5 -right-0 h-60 md:h-80"
          />

          <div className="relative z-10 max-w-5xl mx-auto text-center px-4 md:px-6">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-8 md:mb-12">
              Spotlight on the main <br /> features
            </h2>

            {/* Video Thumbnail with Play Button */}
            <div className="relative inline-block">
              <img
                src={thumbnail}
                alt="Video Thumbnail"
                className="rounded-xl w-full max-w-3xl mx-auto"
              />
              <button className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#F0B143] flex items-center justify-center shadow-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 md:h-6 md:w-6 text-white ml-0.5 md:ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Half - White Section with Logos */}
        <div className="bg-white py-8 md:py-10">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-10 px-4 md:px-6">
            <img src={pingdom} alt="Pingdom" className="h-4 md:h-6" />
            <img src={Pendo} alt="Pendo" className="h-4 md:h-6" />
            <img src={sendgrid} alt="SendGrid" className="h-4 md:h-6" />
            <img src={lattice} alt="Lattice" className="h-4 md:h-6" />
            <img src={gitlab} alt="GitLab" className="h-4 md:h-6" />
          </div>
        </div>
      </section>

      {/* Customer experience  */}

      <section className="bg-[#F9F5F2] py-12 md:py-24 relative overflow-hidden">
        <img
          src={blueCurve}
          alt="blue decorative curve"
          className="absolute top-20 md:top-40 left-0 w-[800px] md:w-[1400px] opacity-72 pointer-events-none"
        />
        <img
          src={yellowCurve}
          alt="yellow decorative curve"
          className="absolute -bottom-4 md:-bottom-8 left-0 w-[600px] md:w-[1200px] opacity-72 pointer-events-none"
        />

        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12 px-4 z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E1E1E] leading-snug">
            Customers appreciate the seamless <br />experience and intuitive design
          </h2>
        </div>

        {/* Cards */}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
          {/* Card 1 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Shahzaib"
                className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-[#1E1E1E] text-sm md:text-base">
                  Shahzaib
                </h4>
                <p className="text-xs md:text-sm text-gray-600">UX UI</p>
              </div>
            </div>
            <p className="text-[#1E1E1E] mb-3 md:mb-4 text-sm md:text-base">
              Filling out legal forms was always overwhelming, but Accompliq
              made it simple and stress-free. Highly recommend!
            </p>
            {/* Stars */}
            <div className="flex space-x-1 text-[#F0B143] text-base md:text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/76.jpg"
                alt="Albart Flores"
                className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-[#1E1E1E] text-sm md:text-base">
                  Albart Flores
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  Graphic Desogner
                </p>
              </div>
            </div>
            <p className="text-[#1E1E1E] mb-3 md:mb-4 text-sm md:text-base">
              The bucket list feature inspired me to chase my dreams and
              document my journey. It's been such a rewarding experience!
            </p>
            {/* Stars */}
            <div className="flex space-x-1 text-[#F0B143] text-base md:text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <img
                src="https://randomuser.me/api/portraits/men/77.jpg"
                alt="Albart Flores"
                className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-[#1E1E1E] text-sm md:text-base">
                  Albart Flores
                </h4>
                <p className="text-xs md:text-sm text-gray-600">
                  Graphic Desogner
                </p>
              </div>
            </div>
            <p className="text-[#1E1E1E] mb-3 md:mb-4 text-sm md:text-base">
              Creating an online accompliq for my father was such a meaningful
              experience. The platform was easy to use, and the final tribute.
            </p>
            {/* Stars */}
            <div className="flex space-x-1 text-[#F0B143] text-base md:text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="mt-8 md:mt-12 flex justify-center space-x-4 md:space-x-6">
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black text-white text-base md:text-xl">
            &#8592;
          </button>
          <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black text-white text-base md:text-xl">
            &#8594;
          </button>
        </div>
      </section>

      <EmailSection />

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

export default Home;
