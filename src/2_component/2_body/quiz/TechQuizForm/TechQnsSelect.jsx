import React from "react";

const TechQnsSelect = ({ setNumQuestions }) => {
  return (
    <div>
      <label className="block text-lg">Number of Questions:</label>
      <select
        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
      >
        {[5, 10, 15, 25, 30, 45, 51].map((num) => (
          <option key={num} value={num} className="text-black">
            {num} Questions
          </option>
        ))}
      </select>
    </div>
  );
};

export default TechQnsSelect;
