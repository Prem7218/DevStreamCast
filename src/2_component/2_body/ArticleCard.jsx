import React, { useState } from "react";

const ArticleCard = ({
  title = "Untitled Article",
  tag_list = [],
  public_reaction_categories = [],
  user = { name: "Anonymous", username: "unknown", profile_image_90: "https://via.placeholder.com/90" },
  reading_time = "N/A",
  readable_publish_date = "Unknown Date",
}) => {
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const reaction1 = ["😊", "❤️", "👍", "😄", "💡", "🎉", "❤️", "😄", "😊", "💡", "💡"];

  return (
    <>
      <div 
        className="bg-white border rounded-lg shadow-md p-5 max-w-4xl w-full sm:w-11/12 mx-auto mt-5 transition-transform transform hover:scale-105 duration-300">
        {/* Author Section */}
        <div className="flex items-center mb-4">
          <img
            src={user.profile_image_90}
            alt={user.name}
            className="w-12 h-12 rounded-full mr-4"
            onError={(e) => (e.target.src = "https://via.placeholder.com/90")} // Fallback image
          />
          <div>
            <h4 className="text-gray-800 font-semibold text-lg">{user.name}</h4>
            <span className="text-gray-600 text-sm">@{user.username}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3 hover:text-blue-700 transition duration-300">
          {title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tag_list.length > 0 ? (
            tag_list.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 text-xs md:text-sm font-medium px-2 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No tags available</span>
          )}
        </div>

        {/* Reading Time and Date */}
        <div className="flex justify-start gap-3 text-gray-600 text-sm md:text-base mb-4">
          <span>{reading_time} min read</span>
          <span className="font-medium">{readable_publish_date}</span>
        </div>

        {/* Reactions with Tooltip */}
        <div className="flex gap-2">
          {public_reaction_categories.length > 0 ? (
            public_reaction_categories.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-gray-300 rounded-full w-10 h-10 p-1 relative cursor-pointer"
                onMouseEnter={() => setHoveredReaction(index)}
                onMouseLeave={() => setHoveredReaction(null)}
              >
                <span className="text-lg">{reaction1[index]}</span>
                {hoveredReaction === index && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg">
                    {reaction.name || "Reaction"}
                  </div>
                )}
              </div>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No reactions available</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleCard;
