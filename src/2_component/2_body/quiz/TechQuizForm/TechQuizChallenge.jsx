import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuizData } from "../../../../3_context/quizDataContext";
import { useNavigate } from "react-router-dom";
import TechName from "./TechName";
import TechLangSelect from "./TechLangSelect";
import TechLangCutomIn from "./TechLangCutomIn";
import TechLevelSelect from "./TechLevelSelect";
import TechChallenge from "./TechChallenge";
import TechQnsSelect from "./TechQnsSelect";
import TechTimePerQnsSelect from "./TechTimePerQnsSelect";

const TechQuizChallenge = () => {
  const {
    selectedLanguage,
    setSelectedLanguage,
    customLanguage,
    setCustomLanguage,
    setLevel,
    setChallengeType,
    setNumQuestions,
    setTimePerQuestion,
    username,
    setUsername,
  } = useQuizData();
  const navigate = useNavigate();

  // Language options
  const languages = ["JavaScript", "Python", "Java", "C++", "React"];

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-6 text-white border border-white/20"
        >
          <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
            🚀 Tech Quiz & Challenge
          </h1>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            
            <TechName username={username} setUsername={setUsername} />  {/* Name Input */}
            <TechLangSelect
              setSelectedLanguage={setSelectedLanguage}                 
              languages={languages}
            />                                                          {/* Language Selection */}

            <TechLangCutomIn
              customLanguage={customLanguage}                           
              setCustomLanguage={setCustomLanguage}   
            />                                                          {/* Custom Language Input */}

            <TechLevelSelect setLevel={setLevel} />                     {/* Level Selection */}
            <TechChallenge setChallengeType={setChallengeType} />       {/* Challenge Type Selection */}
            <TechQnsSelect setNumQuestions={setNumQuestions} />         {/* Number of Questions Selection */}
            <TechTimePerQnsSelect setTimePerQuestion={setTimePerQuestion} />{/* Time per Question Selection */}

            {/* Start Button */}
            <motion.button                                              
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/devquiz")}
              disabled={
                !(
                  username.trim() !== "" &&
                  (selectedLanguage !== "" || customLanguage.trim() !== "")
                )
              }
              className={`w-full mt-4 p-3 text-lg font-semibold rounded-lg shadow-lg transition ${
                username.trim() !== "" &&
                (selectedLanguage !== "" || customLanguage.trim() !== "")
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              Start Challenge 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default TechQuizChallenge;
