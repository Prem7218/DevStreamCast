import React from "react";

const QuestionShimmer = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full animate-pulse h-[84%] border border-white">
      <div className="h-6 bg-gray-700 w-2/3 rounded mb-4"></div>{" "}
      {/* "Dev-DSA Question:" */}
      <div className="h-4 bg-gray-700 w-1/3 rounded mb-4"></div>{" "}
      {/* "Problem:" */}
      <div className="h-6 bg-gray-700 w-full rounded mb-2"></div>
      <div className="h-6 bg-gray-700 w-5/6 rounded mb-2"></div>
      <div className="h-6 bg-gray-700 w-4/5 rounded mb-4"></div>
      <div className="h-4 bg-gray-700 w-1/4 rounded mb-4"></div>{" "}
      {/* "Input:" */}
      <div className="h-6 bg-gray-700 w-full rounded mb-2"></div>
      <div className="h-6 bg-gray-700 w-5/6 rounded mb-2"></div>
      <div className="h-6 bg-gray-700 w-4/5 rounded mb-4"></div>
      <div className="h-4 bg-gray-700 w-1/3 rounded mb-4"></div>{" "}
      {/* Code Block */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-700 w-full rounded mb-2"></div>
      ))}
      <div className="h-4 bg-gray-700 w-2/3 rounded"></div>
    </div>
  );
};

export default QuestionShimmer;
