import React from "react";

const TechLevelSelect = ({ setLevel }) => {
  return (
    <div>
      <label className="block text-lg">Select Level:</label>
      <select
        onChange={(e) => setLevel(e.target.value)}
        className="w-full text-white p-2 mt-1 bg-white/20 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
      >
        <option value="basics" className="text-black">
          Basics
        </option>
        <option value="intermediate" className="text-black">
          Intermediate
        </option>
        <option value="advance" className="text-black">
          Advanced
        </option>
        <option value="mix" className="text-black">
          Mix
        </option>
      </select>
    </div>
  );
};

export default TechLevelSelect;
