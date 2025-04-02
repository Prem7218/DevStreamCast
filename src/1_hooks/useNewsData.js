import { useEffect, useState } from "react";
import { THE_NEWS_API } from "../constantData/url_icons";

const useNewsData = () => {
  const [news, setNews] = useState([]); 

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${THE_NEWS_API}` + process.env.THE_NEWS_API2
      );
      const data = await response.json();

      if (data.articles) {
        setNews(data.articles); 
      } else {
        console.log("Invalid response format", data);
        setNews([]); 
      }
    } catch (error) {
      console.log("Error fetching news:", error);
      setNews([]); 
    }
  };

  useEffect(() => {
    
    const timeout = setTimeout(() => {
      console.log("Hello In News Time Out...");
      fetchData();
    }, 1000);

    return () => clearTimeout(timeout);

  }, []); 

  return news;
};

export default useNewsData;
