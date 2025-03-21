import React from "react";
import { QuestionShimmer } from "../leftPanel/QuestionShimmer";
import CodeEditorShimmer from "./CodeEditorShimmer";
import "../../../../../App.css";

const RightPanel = ({
  setLanguage,
  languageExtensions,
  language,
  darkMode,
  handleSubmit,
  loading,
  checker,
  setChecker,
}) => {
  return (
    <div
      id="code-panel"
      className="my-auto mx-[1%] bg-gray-900 text-white h-[95%] flex flex-col"
    >
      <div className="grid grid-cols-3 w-full items-center">
        {/* 🔹 Title - Start */}
        <h2 className="text-lg font-semibold text-start">💻 Code Editor</h2>

        {/* 🔹 Search Info - Center */}
        <div className="hidden sm:flex justify-center w-full">
          <pre className="text-sm font-semibold text-white bg-gray-700 px-3 py-1 rounded-md overflow-x-auto w-fit removeScrollX">
            🔍 Open Search: Press [ Ctrl + F ] OR [ F3 ]
          </pre>
        </div>

        {/* 🔹 Language Selector - End */}
        <div className="flex justify-end w-full">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 sm:px-1 py-1 mb-1 rounded cursor-pointer w-fit"
          >
            {[
              "C++",
              "JavaScript",
              "Python",
              "Java",
              "Rust",
              "Go",
              "SQL",
              "HTML",
            ].map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        id="code-panel"
        className="split-vertical flex-grow flex flex-col h-[70%]"
      >
        {/* Code Editor */}
        <CodeEditorShimmer
          setChecker={setChecker}
          checker={checker}
          loading={loading}
          language={language}
          languageExtensions={languageExtensions}
          darkMode={darkMode}
        />

        {/* Splitter Between Code Editor & Code Review */}
        <div id="gutter" className="gutter gutter-vertical"></div>

        {/* Code Review */}
        <div id="code-review" className="p-4 bg-gray-900 text-white flex-grow">
          <h2 className="text-lg font-semibold text-white">
            📋 Optimize & Normal Answer For Code
          </h2>

          <div className="mt-3 bg-gray-800 p-4 rounded-lg h-full overflow-auto">
            {checker?.codeReview && !loading?.ansShow ? (
              <pre className="bg-gray-900 p-3 rounded text-white whitespace-pre-wrap">
                {checker?.codeReview}
              </pre>
            ) : !loading?.ansShow ? (
              <p className="text-gray-400">
                Click "Write Code Click Submit & Review Your Code Answer..." ---
                <></> get feedback.
              </p>
            ) : (
              <div>
                <QuestionShimmer />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={checker?.disableCheck}
          className={`w-full p-3 rounded-lg font-bold transition z-20 m-2 ${
            checker?.disableCheck
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {checker?.disableCheck ? "Processing..." : "Submit Code ✅"}
        </button>
      </div>
    </div>
  );
};

export default RightPanel;

{
  /* <button
          onClick={() =>
            setRightUI( splitRightUI === "testResult" && splitRightUI === "codeEditor" &&
              splitRightUI === "codeEditor" ? "testResult" : "codeEditor"
            )
          }
          className="w-full bg-gray-700 hover:bg-gray-800 p-3 rounded-lg font-bold"
        >
          {splitRightUI === "codeEditor" ? "🧪 Test Result" : "💻 Code Editor"}
        </button> */
}
