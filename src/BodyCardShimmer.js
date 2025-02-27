import React from "react";

const BodyCardShimmer = () => {

    const cards = [];

    for(let i = 0; i < 5; i++) {
        {cards.push(
            <div className="bg-white border rounded-lg shadow-md p-5 max-w-4xl w-full sm:w-11/12 mx-auto my-3 border-gray-400 animate-pulse">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <div className="flex flex-col space-y-2">
                    <div className="w-32 h-4 bg-gray-700 rounded"></div>
                    <div className="w-24 h-3 bg-gray-700 rounded"></div>
                    </div>
                </div>
        
                {/* Title */}
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-700 rounded w-2/3"></div>
        
                {/* Tags */}
                <div className="flex space-x-2 mt-3">
                    <div className="w-16 h-5 bg-gray-700 rounded"></div>
                    <div className="w-14 h-5 bg-gray-700 rounded"></div>
                    <div className="w-20 h-5 bg-gray-700 rounded"></div>
                </div>
        
                {/* Icons Placeholder */}
                <div className="flex space-x-4 mt-5">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
            </div>
        )}
    }

  return (
    <>
        {cards}
    </>
  );
};

export default BodyCardShimmer;
