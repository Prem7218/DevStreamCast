import React from "react";

const DSATopics = ({ topics, setSelectedTopics, selectedTopics }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4 text-yellow-400 text-center">
        DSA Topics
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
        {topics.flat().map((topic) => (
          <button
            onClick={() => setSelectedTopics(topic)}
            key={topic}
            className={`px-5 py-2 rounded whitespace-nowrap transition 
              ${
                selectedTopics === topic
                  ? "bg-yellow-400 text-black" // Selected topic color
                  : "bg-gray-800 hover:bg-gray-700" // Default color
              }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </>
  );
};

export default DSATopics;
