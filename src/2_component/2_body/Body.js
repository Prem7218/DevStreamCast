import React, { useEffect, useState } from "react";
import useFetchData from "../../1_hooks/useFetchData";
import ArticleCard from "./ArticleCard";
import { useauthCheck } from "../../3_context/authContext";
import DevLoginModal from "../../Authentications/DevLoginModal";
import { cors, devAPIEnd, devAPIStart } from "../../constantData/url_icons";
import { useLoading } from "../../3_context/loadingContext";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Body = () => {
  const data = useFetchData();
  const { isLogin, isModalOpen, setModalOpen } = useauthCheck();
  const { currentIndex, setCurrentIndex, perPage, setPerPage } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [mainArticleData, setMainArticleData] = useState(data?.result || []);
  const datas = useSelector((store) => store.search.initialState);

  useEffect(() => {
    // console.log("datas: ", datas);
    if(datas) setMainArticleData(datas);
  }, [datas]);
  
  if (!mainArticleData.length === 0) {
    return <h1>Loading...</h1>; // Show a loading message while fetching
  }

  const fetchData = async () => {
    if (isLoading) return; // Prevent multiple simultaneous fetches
    setIsLoading(true);

    try {
      const url =
        cors +
        devAPIStart +
        `per_page=${perPage}&page=${currentIndex}` +
        devAPIEnd;
      const resp = await fetch(url);
      const data = await resp.json();

      // Update the state with new movies
      if (data?.result) {
        setMainArticleData((prevData) => [...prevData, ...data.result]);
      }
    } catch (e) {
      console.error("Error fetching data: ", e);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
      ) {
        if (!isLoading) {
          setCurrentIndex((prevIndex) => prevIndex + 1); // Move to the next category
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex, isLoading]);

  useEffect(() => {
    
      fetchData();
    
  }, [currentIndex]);

  return (
    <div className="flex justify-around">
      <div className="hidden md:block lg:block">
        <h2>Side List</h2>
      </div>

      <div className="min-h-screen w-[65%] p-6">
        {isModalOpen && (
          <DevLoginModal
            isOpen={isLogin === false && isModalOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
        {mainArticleData.length > 0 ? (
          mainArticleData.map((articleData, index) => {
            return (
              <div
                key={index || articleData.id}
                {...(!isLogin && { onClick: () => setModalOpen(true) })}
                style={{ cursor: !isLogin ? "pointer" : "default" }}
              >
                {isLogin ? (
                  <Link
                    to={isLogin ? `https://dev.to/` + articleData?.path : '/'}
                  >
                    <ArticleCard {...articleData} />
                  </Link>
                ) : 
                  <ArticleCard {...articleData} />
                }
              </div>
            );
          })
        ) : (
          <>
            {isLoading && (
              <div className="flex flex-row text-center text-gray-500 py-4">
                Loading more Messages...
              </div>
            )}
          </>
        )}
      </div>

      <div className="hidden md:block lg:block">
        <h2>Latest Tech News</h2>
      </div>
    </div>
  );
};

export default Body;
