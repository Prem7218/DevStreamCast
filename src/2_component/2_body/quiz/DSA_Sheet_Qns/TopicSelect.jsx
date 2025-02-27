import React from 'react'

const TopicSelect = ({ DevDSAQuestions, selectedLevel, setSelectedTopic, selectedTopic }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.keys(DevDSAQuestions[selectedLevel] || {}).map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-5 py-1 rounded-md font-medium transition-all duration-300 shadow-md
              ${
                selectedTopic === topic
                  ? "bg-green-600 text-white scale-105"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
          >
            {topic}
          </button>
        ))}
    </div>
  )
}

export default TopicSelect;
