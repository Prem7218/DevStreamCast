import { useEffect, useState } from 'react';
import { cors, devAPI, devAPIEnd, devAPIStart } from '../constantData/url_icons'; 

const useFetchData = () => {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await fetch(`${cors}${devAPIStart + `per_page=15&page=0` + devAPIEnd}`);
      const data = await resp.json();
      setApiData(data?.result);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  return apiData;  // Return raw HTML
};

export default useFetchData;
