import React, { useState, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useFetchQnsAns from "../../../1_hooks/useFetchQnsAns";
import {
  PROMPT1,
  PROMPT2,
  PROMPT3,
  PROMPT4,
  PROMPT5,
  PROMPT_RANDOMIZER,
} from "../../../constantData/mock_data";
import { useNavigate } from "react-router-dom";
import { useQuizData } from "../../../3_context/quizDataContext";

const QuizComponent = () => {
  const navigate = useNavigate();
  const { username, level, language, challengeType, numQuestions, timePerQuestion } = useQuizData();
  const { quizQnsAns, fetchQnsAns } = useFetchQnsAns();
  const [questions, setQuestions] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState(numQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState({});
  const [timer, setTimer] = useState(timePerQuestion);
  const [totalScore, setTotalScore] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch Questions
  useEffect(() => {
    if (remainingQuestions > 0 && currentQuestion % 5 === 0) {
      const fetchData = async () => {
        try {
          await fetchQnsAns(
            PROMPT1 +
              level +
              PROMPT2 +
              language +
              PROMPT3 +
              challengeType +
              PROMPT4 +
              PROMPT_RANDOMIZER +
              PROMPT5
          );
        } catch (e) {
          console.error("Error fetching questions:", e);
        }
      };
      fetchData();
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (quizQnsAns.length > 0) {
      setQuestions((prevQuestions) => [...prevQuestions, ...quizQnsAns]);
      setRemainingQuestions((prev) => prev - 5);
    }
  }, [quizQnsAns]);

  // Timer Countdown
  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Select Answer (User Can Change Before Saving)
  const handleAnswerSelect = (answer) => {
    if (!savedAnswers[currentQuestion]) {
      setSelectedAnswer(answer);
    }
  };

  // Save Selection (Locks Answer)
  const handleSaveSelection = () => {
    if (selectedAnswer) {
      setSavedAnswers((prev) => ({
        ...prev,
        [currentQuestion]: selectedAnswer, // Always update to latest selection
      }));

      if (selectedAnswer === questions[currentQuestion]?.correctAnswer) {
        setTotalScore((prev) => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(savedAnswers[currentQuestion - 1] || null); // Restore previous selection
    }
  };

  // Next Question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimer(timePerQuestion);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header Section - Name on Top Left */}
      <div className="bg-purple-800 text-white py-4 shadow-md px-6 flex justify-between">
        <h1 className="text-2xl font-bold">👤 {username}'s Quiz</h1>
      </div>

      <div className="flex flex-grow">
        {/* LEFT SECTION - QUESTION & OPTIONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-2/3 h-full p-8 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 text-white flex flex-col justify-between"
        >
          {/* Question */}
          <h2 className="text-2xl font-bold mb-4">
            Question {currentQuestion + 1} / {numQuestions}
          </h2>
          <p className="text-lg font-medium bg-white/10 p-4 rounded-xl shadow-lg">
            {questions[currentQuestion]?.question}
          </p>

          {/* Answer Options */}
          <div className="space-y-4">
            {questions[currentQuestion]?.answers.map((option, index) => {
              const isSaved = savedAnswers[currentQuestion] === option;
              const isSelected = selectedAnswer === option;

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full p-4 rounded-xl transition shadow-lg font-semibold text-lg ${
                    isSaved
                      ? "bg-green-500 text-white"
                      : isSelected
                      ? "bg-yellow-500 text-black"
                      : "bg-white/20 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Buttons Section: Previous, Next, Save, Submit */}
          <div className="mt-4 flex justify-between">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`p-3 rounded-lg font-semibold ${
                currentQuestion === 0
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              ⬅ Previous
            </button>

            {/* Save Selection Button */}
            <button
              onClick={handleSaveSelection}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Save Selection 💾
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className={`p-3 rounded-lg font-semibold ${
                currentQuestion === questions.length - 1
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              Next ➡
            </button>
          </div>

          {/* Bottom Left - Timer */}
          <h2 className="text-lg font-semibold bg-black/50 p-2 rounded-lg w-fit">
            ⏳ {timer}s Left
          </h2>
        </motion.div>

        {/* RIGHT SECTION - QUESTION NAVIGATION */}
        <div className="w-1/3 h-full p-6 bg-gray-800 text-white flex flex-col justify-between">
          <h2 className="text-xl font-bold">📜 Jump to Question</h2>
          <div className="grid grid-cols-3 gap-3">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`p-3 rounded-lg font-semibold ${
                  currentQuestion === index
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col space-y-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 p-3 rounded-lg font-semibold"
            >
              Submit ✅
            </button>
            <button
              onClick={() => navigate("/devquizform")}
              className="bg-red-500 p-3 rounded-lg font-semibold"
            >
              Exit ❌
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black w-[70%] max-h-[80vh] overflow-auto shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              🎯 Quiz Summary
            </h2>

            {/* Total Marks & Score */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-lg font-semibold">
                📊 Total Marks:{" "}
                <span className="font-bold">{numQuestions}</span>
              </p>
              <p className="text-lg font-semibold text-green-600">
                ✅ Gained Marks: <span className="font-bold">{totalScore}</span>
              </p>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4">
              {questions.map((question, index) => {
                const isAttempted = savedAnswers[index] !== undefined;
                const isCorrect =
                  savedAnswers[index] === question.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg shadow-md ${
                      isAttempted
                        ? isCorrect
                          ? "bg-green-100"
                          : "bg-red-100"
                        : "bg-gray-200"
                    }`}
                  >
                    <p className="text-lg font-semibold">
                      {index + 1}. {question.question}
                    </p>
                    <p className="text-sm">
                      📝 Selected Answer:{" "}
                      <span
                        className={`${
                          isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {savedAnswers[index] || "Not Attempted"}
                      </span>
                    </p>
                    <p className="text-sm">
                      ✔ Correct Answer:{" "}
                      <span className="text-green-600">
                        {question.correctAnswer}
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Close & Redirect Button */}
            <div className="mt-6 text-center">
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                onClick={() => navigate("/devquizform")}
              >
                Go to DevQuizForm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
