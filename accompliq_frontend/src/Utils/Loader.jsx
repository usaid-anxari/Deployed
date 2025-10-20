// src/components/Loader.jsx
import React from "react";
import loader from "../Assets/AccompliqLogo-02.png";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <img
        src={loader}
        alt="Loading..."
        className="w-20 h-20 animate-spin-slow"
      />
    </div>
  );
};

export default Loader;
