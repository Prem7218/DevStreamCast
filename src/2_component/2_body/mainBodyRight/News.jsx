import React, { useRef } from "react";
import useNewsData from "../../../1_hooks/useNewsData";
import useReadArticles from "../../../1_hooks/useReadNewsArticles";

const News = () => {
  const articles = useNewsData();
  const {
    activeArticleId,
    pauseReading,
    resumeReading,
    stopReading,
  } = useReadArticles();

  if (!articles || articles.length === 0) {
    return <p className="text-center text-gray-500">Loading latest news...</p>;
  }

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">📰 Latest Tech News</h1>

      <div className="space-y-2">
        {articles.map((article, index) => {
          const articleId = `article-${index}`;
          const isActive = activeArticleId === articleId;

          return (
            <div
              key={index}
              className="news-article bg-white shadow-lg rounded-lg p-4 gap-4"
              data-id={articleId}
            >
              {/* 🔹 Show TTS controls when reading */}
              {isActive && (
                <div className="mb-2 flex gap-3">
                  <button onClick={pauseReading} className="bg-yellow-400 px-3 py-1 rounded text-sm cursor-pointer">
                    ⏸ Pause
                  </button>
                  <button onClick={resumeReading} className="bg-green-400 px-3 py-1 rounded text-sm cursor-pointer">
                    ▶️ Resume
                  </button>
                  <button onClick={stopReading} className="bg-red-400 px-3 py-1 rounded text-sm cursor-pointer">
                    ⏹ Stop
                  </button>
                </div>
              )}

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
                <h2 className="article-title text-lg font-semibold text-gray-900">{article.title}</h2>
                <p className="article-author text-gray-600 text-sm">
                  {article.author ? `By ${article.author}` : "Unknown Author"} • {article.source.name}
                </p>
                <p className="article-content text-gray-700 text-sm mt-2">{article.description}</p>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more mt-3 inline-block text-blue-600 hover:underline text-sm font-semibold"
                >
                  Read More ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
