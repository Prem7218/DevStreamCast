import React from "react";

const TechLangSelect = ({ setSelectedLanguage, languages }) => {
  return (
    <div>
      <label className="block text-lg">Select Programming Language:</label>
      <select
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
      >
        <option value="">-- Select Language --</option>
        {languages.map((lang) => (
          <option key={lang} value={lang} className="text-black">
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TechLangSelect;
