import { useEffect, useRef, useState } from "react";
import ArticelData from "./ArticelData";
import ArticleShimmer from "./ArticleShimmer";
import useArticle from "../../../1_hooks/useArticle";
import { motion } from "framer-motion";

const Article = () => {
  const { article, error } = useArticle();
  const [dataMap, setDataMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({}); // Track loading state per article
  const cardRefs = useRef({}); // Store references for article heights
  const dataRefs = useRef({}); // Store references for data div heights

  // Function to sync heights dynamically
  const syncHeights = () => {
    Object.keys(cardRefs.current).forEach((id) => {
      if (cardRefs.current[id] && dataRefs.current[id]) {
        dataRefs.current[id].style.height = `${cardRefs.current[id].offsetHeight}px`;
      }
    });
  };

  useEffect(() => {
    syncHeights(); 
    window.addEventListener("resize", syncHeights); // Adjust on resize

    return () => window.removeEventListener("resize", syncHeights);
  }, [article, dataMap]);

  if (error) {
    return <p className="text-center text-red-500 font-semibold">{error}</p>;
  }

  if (!article) {
    return <ArticleShimmer />;
  }

  const handleArticle = async (articleId, articlePath) => {
    if (dataMap[articleId]) return;

    setLoadingMap((prev) => ({ ...prev, [articleId]: true })); // Set loading state

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
      setLoadingMap((prev) => ({ ...prev, [articleId]: false })); // Remove loading state
    }
  };

  return (
    <div className="min-w-auto mx-auto my-6 space-y-6">
      {article.map((item) => (
        <div key={item.id} className="flex gap-6 justify-center items-center">
          {/* Left Side: Article Card (55% width) */}
          <motion.div
            ref={(el) => (cardRefs.current[item.id] = el)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[55%] bg-white shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 rounded-lg flex flex-col"
          >
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
                className="text-3xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-500 transition"
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

              <a
                href={item.canonical_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Read on Dev.to ↗
              </a>
            </div>
          </motion.div>

          {/* Right Side: Article Data (35% width) */}
          {dataMap[item.id] &&  <motion.div
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
                  <div
                    className="text-gray-700 whitespace-pre-line leading-relaxed overflow-auto"
                    style={{ maxHeight: "100%" }} // Keep inside fixed height
                  >
                    {dataMap[item.id]}...more
                    <pre>Click to Read {"Dev.to"} Website or user Url.</pre>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic text-center">
                  Click on this article heading to load content.
                </p>
              )}
            </motion.div>}

            {!dataMap[item.id] && <ArticelData />}
        </div>
      ))}
    </div>
  );
};

export default Article;
