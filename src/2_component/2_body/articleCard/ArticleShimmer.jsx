import React from 'react'
import ArticelData from './ArticelData';

const ArticleShimmer = () => {
    return (
        <div className="min-w-3xl mx-auto my-6 space-y-6">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <div key={index} className="flex gap-6 animate-pulse justify-center items-center">
              {/* Article Placeholder (55% width) */}
              <div className="w-[55%] bg-gray-200 rounded-lg p-6 shadow-md h-96 flex flex-col justify-between">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2"></div>
              </div>
  
              <ArticelData />
            </div>
          ))}
      </div>
    );
  };
  
export default ArticleShimmer;
