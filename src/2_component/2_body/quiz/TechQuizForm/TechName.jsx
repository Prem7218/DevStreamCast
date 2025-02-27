import React from "react";

const TechName = ({ username, setUsername }) => {
  return (
    <div>
      <label className="block text-lg">Name:</label>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
        required
      />
    </div>
  );
};

export default TechName;
