import React from "react";

const TechChallenge = ({ setChallengeType }) => {
  return (
    <div>
      <label className="block text-lg">Select Challenge Type:</label>
      <select
        onChange={(e) => setChallengeType(e.target.value)}
        className="w-full p-2 mt-1 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-400 outline-none transition"
      >
        <option value="mix" className="text-black">
          Mix
        </option>
        <option value="mcq" className="text-black">
          MCQ
        </option>
        <option value="code-completion" className="text-black">
          Code Completion
        </option>
        <option value="error-finding" className="text-black">
          Error Finding
        </option>
        <option value="optimization" className="text-black">
          Optimize Code Selection
        </option>
      </select>
    </div>
  );
};

export default TechChallenge;
