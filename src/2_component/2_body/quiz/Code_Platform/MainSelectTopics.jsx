import React from "react";
import SystemDesignTopics from "./SystemDesignTopics";
import DSATopics from "./DSATopics";

const MainSelectTopics = ({
  setSelectedTopics,
  setIsOpen,
  systemDesignTopics,
  isOpen,
  topics,
}) => {

  const disableScroll = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Function to enable scrolling back
  const enableScroll = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
  };


  return (
    <>
      {isOpen && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 
               hidden md:block w-[90vw] max-w-[1400px] 
               bg-gray-900 text-white p-6 rounded-lg shadow-lg 
               transition-all duration-300 z-50"
          onMouseEnter={disableScroll}
          onMouseLeave={enableScroll}
        >
          {/* 🔹 DSA Topics */}
          <DSATopics setSelectedTopics={setSelectedTopics} topics={topics} />

          {/* 🔹 System Design Topics */}
          <SystemDesignTopics
            systemDesignTopics={systemDesignTopics}
            setSelectedTopics={setSelectedTopics}
          />
        </div>
      )}
    </>
  );
};

export default MainSelectTopics;
