import { createContext, useContext, useState } from "react";

export const QuizDataContext = createContext();

export const QuizDataProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("java-script");
  const [customLanguage, setCustomLanguage] = useState("");
  const [level, setLevel] = useState("intermediate");
  const [challengeType, setChallengeType] = useState("Error-Handling");
  const [numQuestions, setNumQuestions] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(10);
  const questions = [
    {
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "Home Tool Markup Language",
        "Hyperlinks and Text Markup Language",
      ],
      correctAnswer: "Hyper Text Markup Language",
    },
  ];

  return (
    <QuizDataContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        customLanguage,
        setCustomLanguage,
        level,
        setLevel,
        challengeType,
        setChallengeType,
        numQuestions,
        setNumQuestions,
        timePerQuestion,
        setTimePerQuestion,
        questions,
        username,
        setUsername,
      }}
    >
      {children}
    </QuizDataContext.Provider>
  );
};

export const useQuizData = () => useContext(QuizDataContext);
