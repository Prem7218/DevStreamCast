import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DevLoginModal from "../../Authentications/DevLoginModal";
import ChatWithDraganDrop from "./ChatWithDraganDrop";
import AnonymousChat from "./profile_post/chats/AnanomusChat";
import { ChevronUp } from "lucide-react";
import ChatCloseDown from "./ChatCloseDown";
import { get, ref } from "firebase/database";
import { auth, database } from "../../constantData/firebase";
import Body_UL from "./UL_List/Body_UL";
import Searchs from "../1_header/Search";
import Connection from "./profile_post/chats/connection/Connection";
import { useOpen } from "../../3_context/openContext";
import News from "./mainBodyRight/News";
import DevMeetRecording from "./mainBodyRight/DevMeetRecording";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLoading } from "../../3_context/loadingContext";
import { cors, devAPIEnd, devAPIStart } from "../../constantData/url_icons";
import ArticleCard from "./articleCard/ArticleCard";
import useFetchData from "../../1_hooks/useFetchData";
import { useauthCheck } from "../../3_context/authContext";
import BodyCardShimmer from "../../BodyCardShimmer";
import { useOpenZustand } from "../../4_Zustand/useOpenZustand";
import ApiSandbox from "./API/ApiSandbox";

const Body = () => {
  const loggedInUserUID = auth?.currentUser?.uid;
  const data = useFetchData();
  const { setConnListOpen, user, setUser, anonomusChat, setAnonomusChat } =
    useOpen();
  const { isLogin, isModalOpen, setModalOpen } = useauthCheck();
  const { currentIndex, setCurrentIndex, perPage } = useLoading();
  const { searchTerm1, setSearchTerm1, showConnections, setShowConnections } =
    useOpenZustand();
  const userChatId = useOpenZustand((state) => state.userChatId);
  const setUserChatId = useOpenZustand((state) => state.setUserChatId);

  const [isLoading, setIsLoading] = useState(false);
  const [mainArticleData, setMainArticleData] = useState(data?.result || []);
  const datas = useSelector((store) => store.search.initialState);
  const videos = useSelector((store) => store.meetRecording || []);
  const toggleConnections = () => setShowConnections(!showConnections);
  const searchRef = useRef(null);
  const [page, setPage] = useState("Main");

  useEffect(() => {
    if (datas) setMainArticleData(datas);
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
      console.log("Error fetching data: ", e);
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

  useEffect(() => {
    try {
      // Check if the logged-in user's profile exists in Firebase
      const userRef = ref(database, `users/${loggedInUserUID}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.val()); // Set user profile if it exists
        } else {
          setUser(null); // No profile found
        }
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [loggedInUserUID]);

  return (
    <div className="flex justify-between bg-gray-50">
      {/* 🔹 Left Navigation Panel */}
      <div className="hidden md:block lg:block lg:w-[20%] p-5 bg-white shadow-md border-r border-gray-200 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Navigation</h2>
        <nav>
          <Body_UL setPage={setPage} />
        </nav>

        {/* 🔍 Search & Connection Section */}
        <div className="fixed bottom-0 left-5 w-[30%] bg-white shadow-lg rounded-md border border-gray-300">
          {/* 🔍 Search Bar with Toggle Caret */}
          <div className="flex items-center bg-gray-100 rounded-t-md px-4 py-2 border-b border-gray-200">
            {/* 🔍 Search Bar - Shown When List is Open */}
            <div
              ref={searchRef}
              className={showConnections ? "block w-full" : "hidden"}
            >
              <Searchs
                setSearchTerm={setSearchTerm1}
                searchTerm={searchTerm1}
                isLogin={isLogin}
                body={true}
                headMe={false}
                toggleConnections={toggleConnections}
                isConnectionsVisible={showConnections}
                setUserChatId={setUserChatId}
              />
            </div>

            {/* 🔹 "Connections:" Text + Caret - Shown When List is Closed */}
            {!showConnections && (
              <ChatCloseDown
                toggleConnections={toggleConnections}
                body={false}
              />
            )}
          </div>

          {/* 👥 Connection List with Animation */}
          <div className="flex justify-center w-full mx-auto">
            <div
              className={`overflow-y-scroll h-[250px] transition-all duration-300 w-full ${
                showConnections ? "opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <Connection
                connections={user?.connections}
                setConnListOpen={setConnListOpen}
                body={true}
                setUserChatId={setUserChatId}
              />
            </div>
          </div>

          <>
            <ChatWithDraganDrop
              userChatId={userChatId}
              toggleConnections={toggleConnections}
            />
          </>
        </div>
      </div>

      {/* 🔹 Main Content Area */}

      {page === "Main" && (
        <div className="flex-1 lg:w-[55%] md:w-[50%] z-0">
          {isModalOpen && (
            <DevLoginModal
              isOpen={isLogin === false && isModalOpen}
              onClose={() => setModalOpen(false)}
            />
          )}

          {mainArticleData.length > 0 ? (
            mainArticleData.map((articleData, index) => (
              <div
                key={`${articleData?.id}-${index}` || article.id || uuidv4()}
                {...(!isLogin && { onClick: () => setModalOpen(true) })}
                className={`rounded-lg shadow-md border border-gray-200
                            ${
                              !isLogin ? "cursor-pointer hover:bg-gray-100" : ""
                            }`}
              >
                {isLogin ? (
                  <Link
                    to={
                      isLogin
                        ? `/dev-article/${articleData?.user?.username}`
                        : "/"
                    }
                  >
                    <ArticleCard {...articleData} />
                  </Link>
                ) : (
                  <ArticleCard {...articleData} />
                )}
              </div>
            ))
          ) : (
            <>{isLoading && <BodyCardShimmer />}</>
          )}
        </div>
      )}

      {page === "API" && (
        <ApiSandbox />
      )}

      <div className="fixed bottom-0 right-4 w-[95%] sm:w-[60%] md:w-[40%] lg:w-[30%] max-w-[400px]">
        {/* Chat Window */}
        {anonomusChat.showanonomus && (
          <>
            {!anonomusChat?.sleepanonomus ? (
              <div className="rounded-md shadow-lg border border-gray-300">
                <AnonymousChat />
              </div>
            ) : (
              <div className="flex items-center justify-between  bg-blue-600 text-white px-3 py-2 hover:bg-white hover:text-black shadow-md border border-blue-400 rounded-lg">
                <div className="text-lg font-semibold">
                  Anonymous Chat Room 🕵️
                </div>

                <button
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => {
                    setAnonomusChat((prev) => ({
                      ...prev,
                      sleepanonomus: !prev?.sleepanonomus,
                    }));
                  }}
                >
                  <ChevronUp
                    className={`h-6 w-[24px] transition-transform ${
                      anonomusChat.sleepanonomus ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🔹 Right Sidebar */}
      {page === "Main" && (
        <aside className="lg:w-[25%] md:w-[30%] sm:w-[35%] p-4 space-y-4 shadow-md border-l border-gray-200 h-fit">
          {/* 🎥 Dev Meet Recordings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <DevMeetRecording videos={videos} />
          </div>

          {/* 📰 News Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <News />
          </div>
        </aside>
      )}
    </div>
  );
};

export default Body;
