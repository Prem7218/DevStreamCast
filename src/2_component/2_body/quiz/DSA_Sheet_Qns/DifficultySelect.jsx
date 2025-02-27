import React from 'react'

const DifficultySelect = ({ levels, handleLevelSelect, levelCompCheck, selectedLevel }) => {
  return (
    <div className="flex flex-wrap justify-center gap-5 mb-8">
        {levels.map((level, index) => (
          <button
            key={level}
            onClick={levelCompCheck[index] ? () => handleLevelSelect(index, level) : null}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md
              ${
                levelCompCheck[index]
                  ? selectedLevel === level
                    ? "bg-blue-600 text-white scale-105 shadow-lg"
                    : "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
          >
            {levelCompCheck[index] ? level : `🔒 ${level}`}{" "}
            {/* Lock icon for locked levels */}
          </button>
        ))}
    </div>
  )
}

export default DifficultySelect;
