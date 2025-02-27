import React from "react";
import CodeMirror from "@uiw/react-codemirror";

const CodeEditorShimmer = ({ loading, darkMode, languageExtensions, language, checker, setChecker }) => {
  return (
    <div id="code-editor" className="bg-gray-900 text-white flex-grow">
      {!loading?.codeEditor && (
        <CodeMirror
          value={checker?.code}
          height="100%"
          className="w-full h-[98%]"
          theme={darkMode ? "dark" : "light"}
          extensions={languageExtensions[language] || []}
          onChange={(value) => setChecker((prev) => ({ ...prev, code: value }))}
        />
      )}

      {loading?.codeEditor && (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full border border-white">
          <div className="w-full animate-pulse bg-gray-700 rounded h-full"></div>
        </div>
      )}
    </div>
  );
};

export default CodeEditorShimmer;
