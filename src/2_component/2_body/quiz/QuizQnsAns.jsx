import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuizData } from "../../../3_context/quizDataContext";
import { get, ref, update } from "firebase/database";
import { auth, database } from "../../../constantData/firebase";
import useFetchQnsAns from "../../../1_hooks/useFetchQnsAns";
import {
  PROMPT1,
  PROMPT2,
  PROMPT2a,
  PROMPT3,
  PROMPT4,
  PROMPT5,
  PROMPT_RANDOMIZER,
} from "../../../constantData/mock_data";
import { useNavigate } from "react-router-dom";
import QuizQuestionJump from "./QuizQuestionJump";
import QuizShimmer from "./QuizShimmer";
import { useDispatch, useSelector } from "react-redux";
import {
  clearQuizData,
  fillQuizData,
} from "../../../constantData/Slices/quizDataSlice";

const QuizComponent = () => {
  const navigate = useNavigate();
  const loggedInUserUID = auth.currentUser?.uid;

  useEffect(() => {
    if (!loggedInUserUID) {
      navigate("/authentication/1");
    }
  }, [loggedInUserUID, navigate]);

  const {
    selectedLanguage,
    customLanguage,
    level,
    challengeType,
    numQuestions,
    timePerQuestion,
    username,
  } = useQuizData();
  const dispatch = useDispatch();
  const {
    question: storedQuestions = [],
    remainingQns: storedRemainingQuestions = 0,
    currentQns: storedCurrentQuestion = 0,
    selectedAns: storedSelectedAnswer = null,
    savedAns: storedSavedAnswers = {},
    time: storedTimer = 0,
    totalSco: storedTotalScore = 0,
    heigh: storedHeight = 0,
  } = useSelector((state) => state.quizData);

  const store = useSelector((state) => state.quizData);

  const { quizQnsAns, fetchQnsAns } = useFetchQnsAns();
  const [questions, setQuestions] = useState(storedQuestions);
  const [remainingQuestions, setRemainingQuestions] = useState(
    storedRemainingQuestions || 5
  ); // Ensure min 5
  const [currentQuestion, setCurrentQuestion] = useState(storedCurrentQuestion);
  const [selectedAnswer, setSelectedAnswer] = useState(storedSelectedAnswer);
  const [savedAnswers, setSavedAnswers] = useState(storedSavedAnswers);
  const [timer, setTimer] = useState(storedTimer || 10); // Default 10 sec
  const [totalScore, setTotalScore] = useState(storedTotalScore);
  const refDivHeight = useRef(null);
  const [height, setHeight] = useState(storedHeight);

  useEffect(() => {
    const updateHeight = () => {
      if (refDivHeight.current) {
        setHeight(refDivHeight.current.clientHeight);
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []); // Run only once on mount

  const handleMcqAptiStats = async () => {
    if (!loggedInUserUID || !selectedLanguage || !numQuestions) return;

    try {
      const statsRef = ref(
        database,
        `users/${loggedInUserUID}/mcqAptiStats/subjects`
      );
      const snapshot = await get(statsRef);

      let updatedSubjects = {};
      const selectedLanguag =
        customLanguage !== "" ? customLanguage : selectedLanguage;

      if (snapshot.exists()) {
        updatedSubjects = snapshot.val();

        if (updatedSubjects[selectedLanguag]) {
          updatedSubjects[selectedLanguag] += numQuestions;
        } else {
          updatedSubjects[selectedLanguag] = numQuestions;
        }
      } else {
        updatedSubjects[selectedLanguag] = numQuestions;
      }

      await update(statsRef, updatedSubjects);
    } catch (error) {
      console.error("Error updating mcqAptiStats:", error);
    }
  };

  useEffect(() => {
    handleMcqAptiStats();
  }, [loggedInUserUID, selectedLanguage, numQuestions]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (questions.length === 0) {
          await fetchQnsAns(
            PROMPT1 +
              numQuestions +
              PROMPT2 +
              level +
              PROMPT2a +
              (customLanguage !== "" ? customLanguage : selectedLanguage) +
              PROMPT3 +
              challengeType +
              PROMPT4 +
              PROMPT_RANDOMIZER +
              PROMPT5
          );
        }
      } catch (e) {
        console.error("Error fetching questions:", e);
      }
    };

    const timeout = setTimeout(fetchData, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (quizQnsAns.length > 0) {
      setQuestions((prev) => [...prev, ...quizQnsAns]);
      setRemainingQuestions((prev) => prev - 5);
    }
  }, [quizQnsAns]);

  useEffect(() => {
    if (questions.length > 0) {
      dispatch(
        fillQuizData({
          selectedLanguage: selectedLanguage,
          customLanguage: customLanguage,
          level: level,
          challengeType: challengeType,
          numQns: numQuestions,
          timePerQns: timePerQuestion,
          user: username,
          qnsLen: questions.length,
          quizQnsAns: quizQnsAns,
          question: [...questions],
          remainingQns: remainingQuestions,
          currentQns: currentQuestion,
          selectedAns: selectedAnswer,
          savedAns: savedAnswers,
          time: timer,
          totalSco: totalScore,
          heigh: height,
        })
      );
    }
  }, [questions, totalScore]);

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

  /** ✅ Select Answer */
  const handleAnswerSelect = (answer) => {
    if (!savedAnswers[currentQuestion]) {
      setSelectedAnswer(answer);
  
      // ✅ Dispatch Redux update immediately
      dispatch(
        fillQuizData({
          selectedAns: answer,
          currentQns: currentQuestion,
        })
      );
    }
  };
  

  // Save Selection (Locks Answer)
  const handleSaveSelection = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === questions[currentQuestion]?.correctAnswer;
  
      const updatedSavedAnswers = {
        ...savedAnswers,
        [currentQuestion]: selectedAnswer,
      };
  
      setSavedAnswers(updatedSavedAnswers);
      setTotalScore((prev) => (isCorrect ? prev + 1 : prev));
  
      // ✅ Dispatch Redux update immediately
      dispatch(
        fillQuizData({
          savedAns: updatedSavedAnswers,
          totalSco: isCorrect ? totalScore + 1 : totalScore,
        })
      );
    }
  };
  

  /** ✅ Previous Question */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(savedAnswers[currentQuestion - 1] || null);
  
      // ✅ Dispatch Redux update
      dispatch(
        fillQuizData({
          currentQns: currentQuestion - 1,
          selectedAns: savedAnswers[currentQuestion - 1] || null,
        })
      );
    }
  };
  
  /** ✅ Next Question */
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimer(timePerQuestion);
  
      // ✅ Dispatch Redux update
      dispatch(
        fillQuizData({
          currentQns: currentQuestion + 1,
          selectedAns: null,
          time: timePerQuestion,
        })
      );
    }
  };
  

  /** ✅ Shimmer UI: Show while questions are loading */
  if (questions.length === 0) {
    return (
      <QuizShimmer
        numQuestions={numQuestions}
        currentQuestion={currentQuestion}
      />
    );
  }

  return (
    <div className="max-h-max w-screen flex flex-col">
      {/* Header Section - Name on Top Left */}
      <div className="bg-purple-800 text-white py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">👤 {username}'s Quiz</h1>
        <h2 className="text-lg font-semibold bg-black/50 p-2 rounded-lg animate-pulse">
          ⏳ {timer}s Left
        </h2>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* LEFT SECTION - QUESTION & OPTIONS */}
        <motion.div
          ref={refDivHeight}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 lg:col-span-2 p-4 md:p-6 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 text-white flex flex-col justify-between min-h-[75vh]"
        >
          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-center">
            Question {currentQuestion + 1} / {numQuestions}
          </h2>
          <p className="text-base md:text-lg font-medium bg-white/10 p-3 md:p-4 rounded-xl shadow-lg">
            {questions[currentQuestion]?.question}
          </p>

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4 mt-2">
            {questions[currentQuestion]?.answers.map((option, index) => {
              const isSaved = savedAnswers[currentQuestion] === option;
              const isSelected = selectedAnswer === option;

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full p-3 md:p-4 rounded-xl transition shadow-lg font-semibold text-sm md:text-lg text-center cursor-pointer ${
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
          <div className="mt-4 flex flex-wrap justify-between items-center">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`p-2 md:p-3 rounded-lg font-semibold text-sm md:text-base cursor-pointer ${
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold cursor-pointer"
            >
              Save Selection 💾
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className={`p-2 md:p-3 rounded-lg font-semibold text-sm md:text-base cursor-pointer ${
                currentQuestion === questions.length - 1
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
              }`}
            >
              Next ➡
            </button>
          </div>
        </motion.div>

        {/* RIGHT SECTION - QUESTION NAVIGATION */}
        <div
          className="hidden md:flex md:flex-col md:col-span-3 lg:col-span-1 p-4 md:p-6 justify-between w-full bg-gray-800 text-white"
          style={{ height: height ? `${height}px` : "600px" }} // Default fallback
        >
          <h2 className="text-lg md:text-xl font-bold text-center md:text-left">
            📜 Jump to Question
          </h2>
          <div className="grid grid-cols-3 gap-2 md:gap-3 overflow-y-auto my-2">
            <QuizQuestionJump
              questions={questions}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            />
          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-col space-y-2 md:space-y-3">
            <button
              onClick={() => navigate("/dev-quiz-ans")}
              className="bg-green-500 p-2 md:p-3 rounded-lg font-semibold text-sm md:text-base cursor-pointer"
            >
              Submit ✅
            </button>

            <button
              onClick={() => {
                dispatch(clearQuizData());
                navigate("/devquizform")
              }}
              className="bg-red-500 p-2 md:p-3 rounded-lg font-semibold text-sm md:text-base cursor-pointer"
            >
              Exit ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
