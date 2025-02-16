import React, { useEffect, useState } from 'react'
import { useLoading } from '../3_context/loadingContext';

const useFetchSearch = (query) => {
    const [searchData, setSearchData] = useState(null);
    const { searchIndex } = useLoading();

    useEffect(() => {
        fetchData();
    }, [searchIndex]);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "https://prsobfp46h-dsn.algolia.net/1/indexes/Article_production/query", // Correct URL format
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Algolia-API-Key": "9aa7d31610cba78851c9b1f63776a9dd",
                        "X-Algolia-Application-Id": "PRSOBFP46H",
                    },
                    body: JSON.stringify({
                        query: `${query}`,  // Correct query format
                        hitsPerPage: 15,
                        queryType: "prefixNone",
                        page: searchIndex,
                    })
                }
            );
     
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
     
            const respData = await response.json();
            setSearchData(respData);
        } catch (e) {
            console.log("Error: ", e.message);
        }
    };

  return searchData;
}

export default useFetchSearch;
