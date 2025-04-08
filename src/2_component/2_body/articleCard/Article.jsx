import { useEffect, useRef, useState } from "react";
import ArticelData from "./ArticelData";
import ArticleShimmer from "./ArticleShimmer";
import useArticle from "../../../1_hooks/useArticle";
import { motion, AnimatePresence } from "framer-motion";
import useReadArticles from "../../../1_hooks/useReadNewsArticles";

const Article = () => {
  const { article, error } = useArticle();
  const {
    activeArticleId,
    pauseReading,
    resumeReading,
    stopReading,
    summarizeArticle,
  } = useReadArticles();
  const [dataMap, setDataMap] = useState({});
  const [sdataMap, setSDataMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const cardRefs = useRef({});
  const dataRefs = useRef({});
  const [pageMap, setPageMap] = useState({});

  const togglePage = (articleId, value) => {
    setPageMap((prev) => ({
      ...prev,
      [articleId]: value,
    }));
  };

  const syncHeights = () => {
    Object.keys(cardRefs.current).forEach((id) => {
      if (cardRefs.current[id] && dataRefs.current[id]) {
        dataRefs.current[
          id
        ].style.height = `${cardRefs.current[id].offsetHeight}px`;
      }
    });
  };

  useEffect(() => {
    syncHeights();
    window.addEventListener("resize", syncHeights);

    return () => window.removeEventListener("resize", syncHeights);
  }, [article, dataMap]);

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  if (!article) {
    return <ArticleShimmer shimmercard={5} />;
  }

  const handleArticle = async (articleId, articlePath) => {
    if (dataMap[articleId]) return;

    setLoadingMap((prev) => ({ ...prev, [articleId]: true }));

    try {
      const response = await fetch(`https://dev.to/${articlePath}`);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      const articleBody = doc.querySelector(
        ".crayons-article__body.text-styles.spec__body"
      );

      if (articleBody) {
        const textContent = articleBody.innerText;
        const lines = textContent
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        const first22Lines = lines.slice(0, 22).join("\n");

        setDataMap((prev) => ({
          ...prev,
          [articleId]: first22Lines,
        }));
      } else {
        console.log("Article body not found!");
      }
    } catch (e) {
      console.log("Error fetching article: ", e);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  return (
    <div className="min-w-auto mx-auto my-6 space-y-6">
      {article.map((item, index) => {
        const articleId = `article-${index}`;
        const isActive = activeArticleId === articleId;

        return (
          <div
            data-id={articleId}
            key={item.id}
            className="news-article flex gap-6 justify-center items-center"
          >
            {/* Left Side: Article Card (55% width) */}
            <motion.div
              ref={(el) => (cardRefs.current[item.id] = el)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-[55%] bg-white shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-lg flex flex-col"
            >
              <div className="flex gap-3 p-2 justify-end">
                <button
                  onClick={() => {
                    togglePage(item.id, "Original");
                    summarizeArticle("old", dataMap[item.id]);
                  }}
                  className={`px-4 py-2 rounded-md border transition-all duration-200 font-medium cursor-pointer
                    ${pageMap[item.id] === "Original" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"}`}
                >
                  Original
                </button>

                <button
                  onClick={() => {
                    togglePage(item.id, "Summarize");
                    summarizeArticle("old", sdataMap[item.id]);
                  }}
                  disabled={!sdataMap[item.id]}
                  className={`px-4 py-2 rounded-md border transition-all duration-200 font-medium cursor-pointer 
                    ${pageMap[item.id] === "Summarize"
                      ? "bg-green-600 text-white border-green-600" 
                      : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"} 
                    ${!sdataMap[item.id] && "opacity-50 cursor-not-allowed"}`}
                >
                  Summarized
                </button>
              </div>

              {item.cover_image && (
                <motion.img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-64"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="p-6 space-y-4 flex-1">
                <h2
                  onClick={() => handleArticle(item.id, item?.path)}
                  className="article-title text-3xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-500 transition"
                >
                  {item.title}
                </h2>

                <p className="text-gray-600 text-lg">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  {item?.tag_list.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-gray-500 text-sm flex flex-wrap gap-4">
                  <p>📅 {item.readable_publish_date}</p>
                  <p>⏳ {item.reading_time_minutes} min read</p>
                  <p>👍 {item.positive_reactions_count} reactions</p>
                  <p>💬 {item.comments_count} comments</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={item.canonical_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-author text-blue-500 hover:underline text-sm"
                  >
                    Read on Dev.to ↗
                  </a>

                  {/* 🔹 Show TTS controls when reading */}
                  {isActive && (
                    <div className="flex flex-wrap items-center gap-2 bg-yellow-100 p-3 rounded-xl shadow-md">
                      <button
                        onClick={async () => {
                          togglePage(item.id, "Summarize")
                          const original = dataMap[item.id];

                          if (original) {
                            setLoadingMap((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }));

                            const summary = await summarizeArticle("new");

                            setSDataMap((prev) => ({
                              ...prev,
                              [item.id]: summary,
                            }));

                            setLoadingMap((prev) => ({
                              ...prev,
                              [item.id]: false,
                            }));
                          }
                        }}
                        disabled={!activeArticleId}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                          activeArticleId
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        📄 Summarize
                      </button>

                      <button
                        onClick={pauseReading}
                        className="px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-sm font-medium text-black transition-all duration-200 cursor-pointer"
                      >
                        ⏸ Pause
                      </button>

                      <button
                        onClick={resumeReading}
                        className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-sm font-medium text-white transition-all duration-200 cursor-pointer"
                      >
                        ▶️ Resume
                      </button>

                      <button
                        onClick={stopReading}
                        className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-all duration-200 cursor-pointer"
                      >
                        ⏹ Stop
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Side: Article Data (35% width) */}
            {dataMap[item.id] && (
              <motion.div
                ref={(el) => (dataRefs.current[item.id] = el)}
                className="w-[35%] bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {loadingMap[item.id] ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ) : dataMap[item.id] ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                      {item.title}
                    </h2>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pageMap[item.id]} // Trigger animation on change
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="article-content text-gray-700 whitespace-pre-line leading-relaxed overflow-auto"
                        style={{ maxHeight: "100%" }}
                      >
                        {(pageMap[item.id] === "Summarize"
                          ? sdataMap[item.id]
                          : dataMap[item.id]) || "No data available"}
                        ...more
                        <pre className="text-sm text-gray-500 mt-2">
                          Click to Read Dev.to Website or user Url.
                        </pre>
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <p className="text-gray-500 italic text-center">
                    Click on this article heading to load content.
                  </p>
                )}
              </motion.div>
            )}
            {!dataMap[item.id] && <ArticelData />}
          </div>
        );
      })}
    </div>
  );
};

export default Article;
