import React from "react";
import { Search } from "lucide-react";
import useFetchSearch from "../../1_hooks/useFetchSearch";
import { useDispatch } from "react-redux";
import { updateData } from "../../constantData/Slices/searchDataSlice";
import { useLoading } from "../../3_context/loadingContext";

const Searchs = ({ setSearchTerm, searchTerm, isMenuOpen }) => {
  const dispatch = useDispatch();
  const { searchIndex, setSearchIndex } = useLoading();
  const searchData = useFetchSearch(searchTerm);
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

  return (
    <>
      <input
        type="text"
        placeholder="Search developer profiles..."
        className={`outline-none text-gray-800 ${
          isMenuOpen ? "w-full" : "w-48 sm:w-64"
        }`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="text-blue-600 hover:text-blue-800 transition ml-2"
        onClick={handleSearchClick}
      >
        <Search className="h-6 w-6" />
      </button>
    </>
  );
};

export default Searchs;
