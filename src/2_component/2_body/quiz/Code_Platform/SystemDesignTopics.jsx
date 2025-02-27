import React from "react";

const SystemDesignTopics = ({ systemDesignTopics, setSelectedTopics }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-green-400 text-center">
        System Design & Advanced
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
        {systemDesignTopics.flat().map((topic) => (
          <button
            onClick={() => setSelectedTopics(topic)}
            key={topic}
            className="px-5 py-2 bg-gray-800 rounded hover:bg-gray-700 transition whitespace-nowrap"
          >
            {topic}
          </button>
        ))}
      </div>
    </>
  );
};

export default SystemDesignTopics;
