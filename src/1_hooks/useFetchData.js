import { useEffect, useState } from "react";
import { cors, devAPIEnd, devAPIStart } from "../constantData/url_icons";

const useFetchData = () => {
  const [apiData, setApiData] = useState(null);
  const [newData, setNewData] = useState(null);

  useEffect(() => {
    let timeout;

    const fetchData = async () => {
      try {
        const resp = await fetch(
          `${cors}${devAPIStart + `per_page=15&page=0` + devAPIEnd}`
        );
        const data = await resp.json();
        setNewData(data?.result);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };

    if (!apiData || newData !== apiData) {
      timeout = setTimeout(() => {
        
        fetchData();
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [apiData, newData]);

  useEffect(() => {
    if (newData && newData !== apiData) {
      setApiData(newData);
    }
  }, [newData]);

  return apiData; // Return raw HTML
};

export default useFetchData;
