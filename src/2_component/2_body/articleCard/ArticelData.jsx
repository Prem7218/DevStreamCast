import React from "react";

const ArticelData = () => {
  return (
    <>
      {/* Data Placeholder (35% width) */}
      <div className="w-[35%] bg-gray-200 rounded-lg p-6 shadow-md h-96">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <p className="text-gray-500 italic text-center">
          Click on this article heading to load content.
        </p>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-2 mt-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </>
  );
};

export default ArticelData;
