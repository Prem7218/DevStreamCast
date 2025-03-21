import { useEffect, useState } from "react";
import { useOpen } from "../../3_context/openContext";
import { Link, useNavigate } from "react-router-dom";
import SearchMain from "./SearchMain";
import { onValue, ref } from "firebase/database";
import { database } from "../../constantData/firebase";
import { useDispatch } from "react-redux";
import { useLoading } from "../../3_context/loadingContext";
import useFetchSearch from "../../1_hooks/useFetchSearch";

const Searchs = ({
  setUserChatId,
  setSearchTerm,
  searchTerm,
  isLogin,
  body,
  toggleConnections,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setShowChat } = useOpen();
  const { searchIndex, setSearchIndex } = useLoading();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [all_user, setAllUsers] = useState([]);
  const searchData = useFetchSearch(searchTerm);

  useEffect(() => {
    const allUsersRef = ref(database, `users`);

    // Fetch data from Firebase
    const unsubscribe = onValue(allUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersArray = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));
        setAllUsers(usersArray);
      } else {
        setAllUsers([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSelectedIndex(-1); // Reset selection when search changes
  }, [searchTerm]);

  if (!searchData) return;

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      if (searchData) {
        dispatch(updateData(searchData));
        setSearchIndex(searchIndex + 1);
        alert(`Searching for: ${searchTerm}`);
      } else {
        alert("Data not available yet, please try again.");
      }
    } else {
      alert("Please enter a search term!");
    }
  };

  // Filter profiles based on search term
  const filteredProfiles = searchTerm.trim()
    ? (all_user || []).filter((profile) =>
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleKeyDown = (event) => {
    if (filteredProfiles.length === 0) return;

    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredProfiles.length - 1 ? prevIndex + 1 : prevIndex
      );
    }

    if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }

    if (event.key === "Enter" && selectedIndex !== -1) {
      setSearchTerm("");
      navigate(`/profile/${filteredProfiles[selectedIndex]?.uid}`);
    }
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Search Input */}
      <SearchMain
        handleKeyDown={handleKeyDown}
        handleSearchClick={handleSearchClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        body={body}
        toggleConnections={toggleConnections}
      />

      {/* Search Results (Only Shows When Input is Not Empty) */}
      {isLogin && filteredProfiles.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg border border-gray-200 mt-3 p-3 z-50">
          {filteredProfiles.map((profile, index) => (
            <li
              key={profile.uid}
              className={`${
                index === selectedIndex ? "bg-gray-200" : ""
              } flex items-center gap-4 p-3 border-b last:border-none rounded-md transition-all duration-200 hover:bg-gray-100 hover:shadow-md`}
            >
              <Link
                to={body ? "/" : `/profile/${profile?.uid}`}
                onClick={(e) => {
                  if (body) {
                    e.preventDefault();
                    setShowChat((prev) => ({...prev, showChat: true}))
                    setUserChatId(profile?.uid)
                  } 
                  setSearchTerm("");
                }}
                className="flex items-center w-full"
              >
                <img
                  src={profile.profilePic}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {profile.title || "No Title"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchs;
