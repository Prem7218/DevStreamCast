import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { model } from "../constantData/mock_data";

let currentUtterance = null;

const speak = (text, onEnd = () => {}) => {
  if (speechSynthesis.speaking) speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 1;
  currentUtterance.pitch = 1;
  currentUtterance.onend = onEnd;

  speechSynthesis.speak(currentUtterance);
};

const useReadArticles = () => {
  const [activeArticleId, setActiveArticleId] = useState(null);

  const readArticle = (searchTitle) => {
    const articles = document.querySelectorAll(".news-article");
    const lowerSearch = searchTitle.trim().toLowerCase();

    let matchedArticle = null;

    articles.forEach((article) => {
      const titleElement = article.querySelector(".article-title");
      const titleText = titleElement?.innerText.toLowerCase();

      if (titleText?.includes(lowerSearch)) {
        matchedArticle = article;
      }
    });

    document.querySelectorAll(".news-article").forEach((el) => {
      el.classList.remove("highlight");
    });

    if (matchedArticle) {
      matchedArticle.classList.add("highlight");
      const articleId = matchedArticle.getAttribute("data-id");
      setActiveArticleId(articleId);

      const title =
        matchedArticle.querySelector(".article-title")?.innerText ||
        "Unknown Title";
      const author =
        matchedArticle.querySelector(".article-author")?.innerText ||
        "Unknown Author";
      const description =
        matchedArticle.querySelector(".article-content")?.innerText ||
        "No description available.";

      const speechText = `
        Here's an article titled: ${title}.
        Written by ${author}.
        ${description}.
        For more, click the Read More link.
      `;

      speak(speechText, () => {
        matchedArticle.classList.remove("highlight");
        setActiveArticleId(null); // 🔹 Hide controls after reading
      });
    } else {
      speak(`Sorry, I couldn't find any article matching "${searchTitle}".`);
    }
  };

  const pauseReading = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
    }
  };

  const resumeReading = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }
  };

  const stopReading = () => {
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel();
      currentUtterance = null;
      setActiveArticleId(null);
    }
  };

  // Place before commands array
  const getArticleContent = () => {
    const article = document.querySelector(".news-article.highlight");
    if (!article) return "No highlighted article found.";

    const content =
      article.querySelector(".article-content")?.innerText ||
      "No content available.";
    return content;
  };

  const summarizeArticle = async (artic, content) => {
    try {
      if(artic === "new") {
        const content = getArticleContent();

        if (!content) {
          speak(
            "Please use the 'read' command first to highlight an article before summarizing."
          );
          return;
        }

        const prompt = `Summarize this news article in 3-5 lines:\n\n${content}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        speak(`Here’s the summary: ${summary}`);
        return summary;
      }
      else {
        speak(content);
      }
    } catch (error) {
      console.log("❌ Error summarizing:", error);
      speak("Sorry, I couldn't summarize this article.");
      return null;
    }
  };

  const commands = [
    { command: "read *", callback: (title) => readArticle(title) },

    {
      command: "summarize now",
      callback: async () => {
        try {
          const content = getArticleContent();

          if (!content) {
            speak(
              "Please use the 'read' command first to highlight an article before summarizing."
            );
            return;
          }

          const prompt = `Summarize this news article in 3-5 lines:\n\n${content}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const summary = response.text();

          speak(`Here’s the summary: ${summary}`);
        } catch (error) {
          console.error("❌ Error summarizing:", error);
          speak("Sorry, I couldn't summarize this article.");
        }
      },
    },

    { command: "pause reading", callback: pauseReading },
    { command: "resume reading", callback: resumeReading },
    { command: "stop reading", callback: stopReading },
  ];

  const { transcript } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Your browser does not support speech recognition. Try Chrome.");
      return;
    }

    SpeechRecognition.startListening({ continuous: true, language: "en-US" });

    return () => {
      SpeechRecognition.stopListening();
      stopReading();
    };
  }, []);

  return {
    readArticle,
    pauseReading,
    resumeReading,
    summarizeArticle,
    stopReading,
    activeArticleId,
    transcript,
  };
};

export default useReadArticles;
