import React from "react";
import { useDispatch } from "react-redux";
import { addQnsTop } from "../../../../constantData/Slices/dsaSlice";
import { useNavigate } from "react-router-dom";

const QuestionList = ({ DevDSAQuestions, selectedLevel, selectedTopic }) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQnstoDevCode = (topic, question ) => {
    dispatch(addQnsTop({ topic, question, code: "" }));
    navigate("/devleetCode");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg w-full max-w-5xl mx-auto shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold text-green-400 mb-5 border-b border-gray-700 pb-3">
        {selectedTopic || "📌 Select a Topic"}
      </h2>

      <ol className="list-none space-y-3">
        {(DevDSAQuestions[selectedLevel]?.[selectedTopic] || []).map(
          (question, index) => (
            <li
              key={index}
              onClick={() => handleQnstoDevCode(selectedTopic, question, index)}
              className="flex items-center gap-4 my-2 text-lg text-gray-300 cursor-pointer hover:text-gray-100 transition-all duration-200 p-3 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              {/* ✅ Checkbox Toggle */}
              <span className="text-2xl">☐</span>
              {question}
            </li>
          )
        )}
      </ol>
    </div>
  );
};

export default QuestionList;
