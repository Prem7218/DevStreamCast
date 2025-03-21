import React from "react";

const TechLangCutomIn = ({ setCustomLanguage }) => {
  return (
    <div>
      <label className="block text-lg">Or Enter a Custom Language:</label>
      <input
        type="text"
        placeholder="Enter Language (if not listed)"
        onChange={(e) => setCustomLanguage(e.target.value)}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
      />
    </div>
  );
};

export default TechLangCutomIn;
