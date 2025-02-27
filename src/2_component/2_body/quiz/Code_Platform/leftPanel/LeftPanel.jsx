import React from "react";
import QuestionShimmer from "./QuestionShimmer";
import { MOCK_QNS } from "../../../../../constantData/mock_data";

const LeftPanel = ({
  showPreviousQuestions,
  previousQuestions,
  checker,
  setChecker,
  setShowPreviousQuestions,
  fetchQuestion,
  loading,
}) => {
  return (
    <div
      id="question-panel"
      className="p-4 bg-gray-800 text-white overflow-auto"
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-4">📝 Problem Statement</h2>

        {/* 🔹 Dropdown for Previous Questions (Only if Show is True) */}
        {showPreviousQuestions && previousQuestions.length > 1 && (
          <div>
            <select
              onChange={(e) => setChecker((prev) => ({ ...prev, question: e.target.value }))}
              className="bg-orange-400 text-white p-1 rounded cursor-pointer w-full"
            >
              {previousQuestions.map((q, index) => (
                <option key={index} value={q}>
                  {`📌 Previous Question ${previousQuestions.length - index}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!loading?.question && (
        <pre className="bg-gray-900 p-4 rounded-md overflow-auto whitespace-pre-wrap h-[84%]">
          {checker?.question || MOCK_QNS}
        </pre>
      )}

      {loading?.question && <QuestionShimmer />}

      {/* 🔹 Buttons Container */}
      <div className="flex justify-between mt-4">
        {/* 📜 View Previous Questions Button (Left) */}
        {previousQuestions.length > 1 && (
          <button
            onClick={() => setShowPreviousQuestions(!showPreviousQuestions)}
            className="p-2 rounded transition bg-gray-800 hover:bg-gray-700"
          >
            {showPreviousQuestions
              ? "🔼 Hide Previous Questions"
              : "📜 View Previous Questions"}
          </button>
        )}

        {/* 🎲 Generate New Question Button (Right) */}
        <button
          onClick={fetchQuestion}
          disabled={checker?.disableCheck}
          className={`p-2 rounded transition ${
            checker?.disableCheck
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {checker?.disableCheck
            ? "Generating Question..."
            : "Generate LeetCode Question 🎯"}
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;
