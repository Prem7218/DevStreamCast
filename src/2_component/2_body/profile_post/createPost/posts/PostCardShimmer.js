import React from "react";

const PostCardShimmer = () => {
  return (
    <div className="bg-white w-full shadow-sm border border-gray-200 rounded-lg p-4 mb-2 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div className="flex flex-col gap-1 w-full">
          <div className="h-3 w-24 bg-gray-300 rounded" />
          <div className="h-2 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Post Content */}
      <div className="flex flex-col gap-2">
        <div className="h-3 w-full bg-gray-300 rounded" />
        <div className="h-3 w-4/5 bg-gray-300 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* Media Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-sm text-gray-500 mt-4">
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-16 bg-gray-300 rounded" />
        <div className="h-3 w-16 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default PostCardShimmer;
