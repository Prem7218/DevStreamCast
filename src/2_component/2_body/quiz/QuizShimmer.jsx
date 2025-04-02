import React from "react";

const QuizShimmer = ({ currentQuestion, numQuestions }) => {
  return (
    <div className="w-screen flex flex-col max-h-max bg-purple-900">
      {/* 🟣 Header (Same as Quiz UI) */}
      <div className="bg-purple-800 text-white py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">👤 Prem's Quiz</h1>
        <h2 className="text-lg font-semibold bg-black/50 p-2 rounded-lg animate-pulse">
          ⏳ Loading...
        </h2>
      </div>

      {/* 🟣 Main Content */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* LEFT: Questions & Options */}
        <div className="md:w-2/3 p-6 bg-purple-800 flex flex-col justify-between min-h-[75vh]">
          {/* 🟢 Question Skeleton */}
          <div className="animate-pulse">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4 text-center text-white">
              Question {currentQuestion + 1} / {numQuestions}
            </h2>

            <div className="text-base md:text-lg font-medium bg-white/10 p-3 md:p-4 rounded-xl shadow-lg my-7">
              <p className="h-5 w-full bg-gray-400/50 rounded-md mb-4"></p>
              <p className="h-5 w-9/12 bg-gray-400/50 rounded-md mb-4"></p>
            </div>

            {/* 🟢 Answer Options Skeleton */}
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 w-full p-3 md:p-4 bg-white/10 border border-black/10 rounded-md hover:scale-105"
                ></div>
              ))}
            </div>
          </div>

          {/* 🟢 Navigation Buttons Skeleton */}
          <div className="flex justify-between animate-pulse">
            <div className="h-10 w-24 bg-gray-400/40 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-400/40 rounded-md"></div>
            <div className="h-10 w-24 bg-gray-400/40 rounded-md"></div>
          </div>
        </div>

        {/* RIGHT: Question Navigation Skeleton */}
        <div className="hidden md:flex md:w-1/3 p-4 h-full md:h-[600px] bg-gray-800 text-white flex-col justify-between">
          {/* 🟢 Jump to Question (Header) */}
          <div className="w-full">
            <h2 className="text-xl font-bold mb-3 animate-pulse">
              📜 Jump to Question
            </h2>
          </div>

          {/* 🔵 Middle: Questions Grid */}
          <div className="grid grid-cols-3 gap-2 overflow-y-auto animate-pulse">
            {[...Array(numQuestions)].map((_, index) => (
              <div
                key={index}
                className="h-12 rounded-xl m-1 bg-gray-400/40"
              ></div>
            ))}
          </div>

          {/* 🔴 Bottom: Submit & Exit Buttons */}
          <div className="mt-6 space-y-3 animate-pulse text-white w-full">
            <div className="h-12 bg-green-500/50 rounded-md text-center">
              Submit
            </div>
            <div className="h-12 bg-red-500/50 rounded-md text-center">
              Exit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizShimmer;
