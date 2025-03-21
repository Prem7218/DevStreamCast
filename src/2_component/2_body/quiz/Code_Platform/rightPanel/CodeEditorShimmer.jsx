import React, { useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useDispatch, useSelector } from "react-redux";
import { addQnsTop } from "../../../../../constantData/Slices/dsaSlice";

const CodeEditorShimmer = ({
  loading,
  darkMode,
  languageExtensions,
  language,
  checker,
  setChecker,
}) => {
  const dispatch = useDispatch();
  const dsaSheet = useSelector((store) => store.dsaSheet);
  const { topic, question, code } = dsaSheet;

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Unsaved changes will be lost. Are you sure?";
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if(code && code !== checker?.code) {
      setChecker((prev) => ({...prev, code: code}));
    }
  }, []);

  useEffect(() => {
    if(checker?.code && checker?.code !== code) {
        const timeout = setTimeout(() => {
          dispatch(addQnsTop({ topic, question, code: checker?.code }));
        }, 1000);

        return () => clearTimeout(timeout);
    }
  }, [checker?.code, dispatch, topic, question]);
  

  return (
    <div id="code-editor" className="bg-gray-900 text-white flex-grow">
      {!loading?.codeEditor && (
        <CodeMirror
          value={checker?.code || ""}
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
