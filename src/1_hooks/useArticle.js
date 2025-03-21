import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cors, DEV_ARTICLE_API } from "../constantData/url_icons";

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
            "api-key": process.env.THE_DEV_API,
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
