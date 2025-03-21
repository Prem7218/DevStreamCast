import React, { useState, useEffect, useRef } from "react";
import {
  model,
  QnsPROMPT1,
  QnsPROMPT2,
  QnsPROMPT3,
  SubmitPROMPT1,
  SubmitPROMPT2,
  SubmitPROMPT3,
  systemDesignTopics,
  topics,
} from "../../../../constantData/mock_data";
import { useSelector } from "react-redux";
import { Top1Shimmer, Top2Shimmer } from "./topNav/Top1Shimmer";
import TimerOnNav from "./TimerOnNav";
import TopNavBar from "./TopNavBar";
import MainSelectTopics from "./MainSelectTopics";
import LeftPanel from "./leftPanel/LeftPanel";
import RightPanel from "./rightPanel/RightPanel";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { go } from "@codemirror/lang-go";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import Split from "split.js";

const CodePlatform = () => {
  const questione = useSelector((store) => store.dsaSheet.question);
  const topic = useSelector((store) => store.dsaSheet.topic);
  const [loading, setLoading] = useState({
    topNav: false,
    topNextNav: false,
    question: false,
    codeEditor: false,
    ansShow: false,
    topNav: false,
  });
  const [checker, setChecker] = useState({
    disableCheck: false,
    question: "",
    code: "",
    codeReview: "",
  });

  const splitInstance = useRef(null);
  const [language, setLanguage] = useState("Cpp");
  const [selectedTopics, setSelectedTopics] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [timeLimit, setTimeLimit] = useState(10);
  const [timer, setTimer] = useState(timeLimit * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [showPreviousQuestions, setShowPreviousQuestions] = useState(false);
  // const loggedInUserUID = auth?.currentUser?.uid;

  const languageExtensions = {
    JavaScript: javascript(),
    Python: python(),
    Cpp: cpp(),
    Java: java(),
    Rust: rust(),
    Go: go(),
    SQL: sql(),
    "HTML & CSS": html(),
    Swift: "prismjs",
  };

  // Theme Persistence
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchQns = async () => {
      if (!questione || !topic) return;

      try {
        setLoading({
          topNav: true,
          ansShow: true,
          topNav: true,
          topNextNav: true,
          question: true,
          codeEditor: true,
        });
        setChecker((prev) => ({ ...prev, disableCheck: true }));

        const prompt = `${QnsPROMPT1}${questione} ${QnsPROMPT2} ${topic}${QnsPROMPT3}`;

        const result = await model.generateContent(prompt);
        let currentQns =
          result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";
        setChecker((prev) => ({ ...prev, question: currentQns }));
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setChecker((prev) => ({ ...prev, disableCheck: false }));
        setLoading({
          topNav: false,
          ansShow: false,
          topNav: false,
          topNextNav: false,
          question: false,
          codeEditor: false,
        });
      }
    };

    fetchQns();
  }, [questione, topic]);

  // Timer Functionality
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsRunning(false);
      alert("Time is up!");
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    // First Split: Between Question & Code Panel
    Split(["#question-panel", "#code-panel"], {
      sizes: [50, 50],
      minSize: 30,
      gutterSize: 8,
      cursor: "col-resize",
      elementStyle: (dimension, size, gutterSize) => ({
        [dimension]: `calc(${size}% - ${gutterSize / 2}px)`,
      }),
      gutterStyle: (dimension, gutterSize) => ({
        [dimension]: `${gutterSize}px`,
      }),
    });

    // Second Split: Between Code Editor & Code Review
    splitInstance.current = Split(["#code-editor", "#code-review"], {
      sizes: [50, 50], // Default: More space for Code Editor
      minSize: [0, 0], // Allows full collapse
      gutterSize: 6, // Matches CSS
      cursor: "row-resize",
      direction: "vertical",
      elementStyle: (dimension, size, gutterSize) => ({
        [dimension]: `calc(${size}% - ${gutterSize / 2}px)`,
      }),
      gutterStyle: (dimension, gutterSize) => ({
        [dimension]: `${gutterSize}px`,
      }),
      onDragEnd: (sizes) => {
        const [editorSize, reviewSize] = sizes;

        if (splitInstance.current) {
          if (editorSize < 5) {
            splitInstance.current.setSizes([0, 100]); // Fully show Code Review
          } else if (reviewSize < 5) {
            splitInstance.current.setSizes([100, 0]); // Fully show Code Editor
          }
        }
      },
    });

    return () => {
      if (splitInstance.current) {
        splitInstance.current.destroy(); // Cleanup on unmount
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!checker?.code.trim()) {
      alert("Please write some code before submitting for review.");
      return;
    }

    try {
      setChecker((prev) => ({ ...prev, disableCheck: true }));
      setLoading((prev) => ({ ...prev, codeEditor: true, ansShow: true }));
      const prompt = `${SubmitPROMPT1}${language}${SubmitPROMPT2}${checker?.question}
              ### 💻 User's Code:
              \`\`\`${language}
              ${checker?.code}
              \`\`\`
              ${SubmitPROMPT3}`;

      const result = await model.generateContent(prompt);

      const reviewText =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from AI.";

      setChecker((prev) => ({ ...prev, codeReview: reviewText }));
    } catch (error) {
      console.error("Error fetching code review:", error);
      setChecker((prev) => ({
        ...prev,
        codeReview: "⚠️ Error: Unable to fetch review at the moment.",
      }));
    } finally {
      setChecker((prev) => ({ ...prev, disableCheck: false }));
      setLoading((prev) => ({
        ...prev,
        question: false,
        codeEditor: false,
        ansShow: false,
      }));
    }
  };

  const fetchQuestion = async () => {
    try {
      setLoading((prev) => ({ ...prev, question: true }));
      setChecker((prev) => ({ ...prev, codeReview: "", disableCheck: true }));

      const prompt = `Generate a well-structured DSA-style coding problem labeled as 'Dev-DSA Question:' instead of 'LeetCode-style coding problem:'. 
            The problem should be based on the programming language ${language} and cover concepts related to the DSA topic ${selectedTopics}. Ensure that 
            the problem statement is clear, concise, and formatted professionally, including constraints and example cases if necessary. Do not provide 
            the solution or function signature.`;

      const result = await model.generateContent(prompt);

      let currentQns =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response";

      setPreviousQuestions((prev) => [currentQns, ...prev]);
      setChecker((prev) => ({ ...prev, question: currentQns }));
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setChecker((prev) => ({ ...prev, disableCheck: false }));
      setLoading((prev) => ({ ...prev, question: false, codeEditor: false }));
    }
  };

  return (
    <div className={`min-h-screen ${"bg-gray-900 text-white"}`}>
      {/* 🔹 Top Navigation Bar */}
      {!loading?.topNav && (
        <TopNavBar darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      {loading?.topNav && <Top1Shimmer />}

      {/* 🔹 Timer and Controls */}
      {!loading?.topNav && (
        <div className="flex justify-between items-center px-4 py-2 bg-gray-700 text-white">
          <div>
            <TimerOnNav
              setTimeLimit={setTimeLimit}
              setTimer={setTimer}
              timeLimit={timeLimit}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />

            {/* 🔹 Dropdown Section */}
            <div className="relative inline-block text-center">
              {/* 🔹 Main Button */}
              <button
                className="bg-red-500 hover:bg-red-700 ml-3 text-white font-semibold py-1 px-3 rounded transition duration-300"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
              >
                📚 DSA & System Design Topics ▼
              </button>

              {/* 🔹 Dropdown (Only for Screens > 768px, Always Centered, 90% Width) */}
              <MainSelectTopics
                setSelectedTopics={setSelectedTopics}
                topics={topics}
                systemDesignTopics={systemDesignTopics}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                selectedTopics={selectedTopics}
              />
            </div>
          </div>

          {/* 🔹 Timer Display */}
          <span className="font-semibold">
            ⏲ {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </span>
        </div>
      )}

      {loading?.topNav && <Top2Shimmer />}

      {/* 🔹 Split Layout */}
      <div className="min-h-screen bg-gray-900 text-white">
        {/* 🔹 Split Layout */}
        <div className="split h-screen">
          {/* 📜 Left Panel: Coding Question */}
          <LeftPanel
            showPreviousQuestions={showPreviousQuestions}
            previousQuestions={previousQuestions}
            checker={checker}
            setChecker={setChecker}
            setShowPreviousQuestions={setShowPreviousQuestions}
            fetchQuestion={fetchQuestion}
            loading={loading}
          />

          {/* 💻 Right Panel: Code Editor */}

          <RightPanel
            handleSubmit={handleSubmit}
            checker={checker}
            setChecker={setChecker}
            darkMode={darkMode}
            setLanguage={setLanguage}
            languageExtensions={languageExtensions}
            language={language}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CodePlatform;

// useEffect(() => {
//   if (!loggedInUserUID) return;

//   const updateQuestionDetails = async () => {
//     try {
//       const userRef = ref(
//         database,
//         `users/${loggedInUserUID}/solvedQuestions`
//       );
//       const snapshot = await get(userRef);

//       let updatedQnsDetails = {};

//       if (snapshot.exists()) {
//         updatedQnsDetails = snapshot.val();

//         if (updatedQnsDetails["pending"] !== undefined) {
//           updatedQnsDetails["pending"] = updatedQnsDetails["pending"] + 1;
//         } else {
//           updatedQnsDetails["pending"] = 1; // Default to 1 if not exist
//         }
//       } else {
//         updatedQnsDetails["pending"] = 1; // Default for new users
//       }

//       await update(userRef, updatedQnsDetails);

//       alert(
//         `Updated: "pending", Total Questions: ${updatedQnsDetails["pending"]}`
//       );
//     } catch (error) {
//       console.error("Error updating solved questions:", error);
//     }
//   };

//     updateQuestionDetails();
// }, [loggedInUserUID, questione, topic]);
