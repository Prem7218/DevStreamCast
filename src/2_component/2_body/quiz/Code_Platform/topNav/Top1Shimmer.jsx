import React from "react";

export const Top1Shimmer = () => {
  return (
    <div className="flex justify-between bg-gray-800 py-5 shadow-lg w-full border border-x-white">
        <div className="flex gap-3 mx-2">
          <div className="w-12 h-6 bg-gray-700 rounded"></div>
          <div className="w-20 h-6 bg-gray-700 rounded"></div>
        </div>

        <div className="flex gap-3 mx-2">
          <div className="w-24 h-6 bg-gray-700 rounded"></div>
          <div className="w-24 h-6 bg-gray-700 rounded"></div>
        </div>
    </div>
  );
};

export const Top2Shimmer = () => {
  return (
    <div className="flex justify-between items-center py-2 bg-gray-800 shadow-lg w-full border border-x-white">
      <div className="flex gap-4 mx-2">
        <div className="w-20 h-6 bg-gray-700 rounded"></div>
        <div className="w-20 h-6 bg-gray-700 rounded"></div>
        <div className="w-16 h-6 bg-gray-700 rounded"></div>
        <div className="w-52 h-6 bg-gray-700 rounded"></div>
      </div>

      <div className="flex gap-3 mx-2">
        <div className="w-10 h-6 bg-gray-700 rounded"></div>
        <div className="w-16 h-6 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};
