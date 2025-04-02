import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearQuizData } from "../../../constantData/Slices/quizDataSlice";

const QuizResult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { numQns, totalSco, savedAns, question } = useSelector(
    (store) => store.quizData
  );
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 text-white flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg text-black w-full max-w-5xl max-h-[80vh] overflow-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          🎯 Quiz Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
          {/* 📊 Total Marks */}
          <div className="p-3 bg-white rounded-md shadow">
            <p className="text-lg font-semibold">📊 Total Marks:</p>
            <p className="text-2xl font-bold">{numQns}</p>
          </div>

          <div className="p-3 bg-white rounded-md shadow">
            <p className="text-lg font-semibold text-green-600">
              ✅ Gained Marks:
            </p>
            <p className="text-2xl font-bold text-green-600">{totalSco}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {question.map((question, index) => {
            const isAttempted = savedAns[index] !== undefined;
            const isCorrect = savedAns[index] === question.correctAnswer;

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
                    className={isCorrect ? "text-green-600" : "text-red-600"}
                  >
                    {savedAns[index] || "Not Attempted"}
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

        <div className="mt-6 text-center">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 cursor-pointer"
            onClick={() => {
              dispatch(clearQuizData());
              navigate("/devquizform");
            }}
          >
            Go to DevQuizForm
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
