import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cors, DEV_ARTICLE_API, DEV_API } from "../constantData/url_icons"; // Ensure DEV_API is correctly imported

const useArticle = () => {
  const { username } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!username) {
      setError("Article ID not found");
      return;
    }

    const fetchData = async () => {
      try {
        const response1 = await fetch(`${cors}${DEV_ARTICLE_API}${username}`, {
          headers: {
            "api-key": DEV_API,
          },
        });

        const data = await response1.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, [username]);

  return { article };
};

export default useArticle;
