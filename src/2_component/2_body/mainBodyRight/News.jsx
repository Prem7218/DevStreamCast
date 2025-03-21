import React from "react";
import useNewsData from "../../../1_hooks/useNewsData";

const News = () => {
  const articles = useNewsData();

  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500">Loading latest news...</p>; // ✅ Show loading state
  }

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">📰 Latest Tech News</h1>

      <div className="space-y-2">
        {articles.map((article, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-4 gap-4">
            {/* News Image */}
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-32 object-cover mx-auto rounded-lg"
              />
            )}

            {/* News Content */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{article.title}</h2>
              <p className="text-gray-600 text-sm">
                {article.author ? `By ${article.author}` : "Unknown Author"} • {article.source.name}
              </p>
              <p className="text-gray-700 text-sm mt-2">{article.description}</p>

              {/* Read More Button */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-blue-600 hover:underline text-sm font-semibold"
              >
                Read More ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
