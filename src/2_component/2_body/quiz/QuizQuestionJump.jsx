import React from "react";

const QuizQuestionJump = ({ questions, setCurrentQuestion, currentQuestion }) => {
  return (
    <>
      {questions.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentQuestion(index)}
          className={`p-3 rounded-lg font-semibold cursor-pointer ${
            currentQuestion === index
              ? "bg-yellow-500 text-black"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </>
  );
};

export default QuizQuestionJump;
