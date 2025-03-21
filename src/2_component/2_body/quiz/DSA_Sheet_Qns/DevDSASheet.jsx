import React, { useState, useEffect } from "react";
import { DevDSAQuestions, DevHeader, levels } from "../../../../constantData/mock_data";
import DifficultySelect from "./DifficultySelect";
import TopicSelect from "./TopicSelect";
import QuestionList from "./QuestionList";

const DevDSAPracticeSheet = () => {
  // 🔹 State for selected difficulty & topic
  const [selectedLevel, setSelectedLevel] = useState(levels[0]); // Default Level: Beginner
  const [selectedTopic, setSelectedTopic] = useState("");
  const [levelCompCheck, setLevelCompCheck] = useState([
    true,
    false,
    false,
    false,
  ]);

  // 🔹 Set the first available topic when level changes
  useEffect(() => {
    const topics = Object.keys(DevDSAQuestions[selectedLevel]);
    if (topics.length > 0) {
      setSelectedTopic(topics[0]); // Auto-select first topic
    }
  }, [selectedLevel]);

  // 🔹 Handle level selection (Only unlocked levels can be selected)
  const handleLevelSelect = (index) => {
    if (levelCompCheck[index]) {
      setSelectedLevel(levels[index]);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-950 text-white px-8 py-12">

      {/* 🔹 Header */}
      <DevHeader />

      {/* 🔹 Difficulty Selector */}
      <DifficultySelect
        levelCompCheck={levelCompCheck}
        selectedLevel={selectedLevel}
        levels={levels}
        handleLevelSelect={handleLevelSelect}
      />

      {/* 🔹 Topic Selector */}
      <TopicSelect
        DevDSAQuestions={DevDSAQuestions}
        selectedLevel={selectedLevel}
        setSelectedTopic={setSelectedTopic}
        selectedTopic={selectedTopic}
      />

      {/* 🔹 Questions List */}
      <QuestionList
        DevDSAQuestions={DevDSAQuestions}
        selectedLevel={selectedLevel}
        selectedTopic={selectedTopic}
      />
    </div>
  );
};

export default DevDSAPracticeSheet;
