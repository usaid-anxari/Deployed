import React, { useState, useEffect } from "react";
import AppLogo from "../Assets/AccompliqLogo-02.png";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 12,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray text-white min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center p-6 animate-fadeIn">
        {/* Logo */}
        <img
          src={AppLogo}
          alt="Logo"
          className="w-24 h-24 mb-6 animate-bounce"
        />

        {/* Coming Soon Text */}
        <h1 className="text-5xl text-[#0D6DA9] font-bold mb-4 animate-pulse">
          Coming Soon
        </h1>
        <p className="text-lg text-[#0D6DA9] max-w-lg">
          We're working hard to bring something amazing. Stay tuned!
        </p>

        {/* Countdown Timer */}
        <div className="flex space-x-4 mt-6 text-xl">
          <div className="bg-[#E6BA4C] text-black px-4 py-2 rounded-lg shadow-md">
            {timeLeft.days}d
          </div>
          <div className="bg-[#E6BA4C] text-black px-4 py-2 rounded-lg shadow-md">
            {timeLeft.hours}h
          </div>
          <div className="bg-[#E6BA4C] text-black px-4 py-2 rounded-lg shadow-md">
            {timeLeft.minutes}m
          </div>
          <div className="bg-[#E6BA4C] text-black px-4 py-2 rounded-lg shadow-md">
            {timeLeft.seconds}s
          </div>
        </div>

        {/* Notify Me Button */}
        <button className="mt-6 text-white bg-[#0D6DA9] px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-opacity-80 transition-all duration-300">
          Notify Me
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
