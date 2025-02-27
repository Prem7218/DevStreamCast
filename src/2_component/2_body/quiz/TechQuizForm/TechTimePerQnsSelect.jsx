import React from "react";

const TechTimePerQnsSelect = ({ setTimePerQuestion }) => {
  return (
    <div>
      <label className="block text-lg">Time Per Question:</label>
      <select
        onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
      >
        {[10, 20, 25, 30].map((time) => (
          <option key={time} value={time} className="text-black">
            {time}s per Question
          </option>
        ))}
      </select>
    </div>
  );
};

export default TechTimePerQnsSelect;
