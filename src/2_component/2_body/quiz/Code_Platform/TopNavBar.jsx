
import React from "react";
import { Link } from "react-router-dom";

const TopNavBar = ({ setDarkMode, darkMode }) => {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
      <div className="flex items-center gap-3">
        <Link to={"/"}><button className="text-lg font-bold">⬅ Back</button></Link>
        <span className="text-lg font-semibold">1. Coding Challenge</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
        <span className="font-semibold">👤 User Name</span>
      </div>
    </div>
  );
};

export default TopNavBar;
