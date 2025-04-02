import React from "react";
import { ChevronDown, Search } from "lucide-react";

const SearchMain = ({
  headMe,
  setSearchTerm,
  handleSearchClick,
  searchTerm,
  handleKeyDown,
  body,
  toggleConnections, // New Prop for Toggling
  isPMeet,
}) => {
  return (
    <div
      className={`${
        body && !headMe && `m-1 p-2`
      } flex items-center justify-between ${isPMeet ? 'rounded-sm border-2 border-white ' : 'rounded-lg'} bg-white`}
    >
      <input
        type="text"
        placeholder="Search developer profiles..."
        className={`outline-none text-gray-800 w-full`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className={`text-blue-600 hover:text-blue-800 transition ml-2`}
        onClick={handleSearchClick}
      >
        <Search className="h-6 w-6" />
      </button>

      {/* 🔽 Caret Toggle Button */}
      {body && !headMe && (
        <div
          className="cursor-pointer ml-2"
          onClick={toggleConnections} // Trigger Toggle
        >
          <ChevronDown className="h-6 w-6 text-blue-600 transition-transform" />
        </div>
      )}
    </div>
  );
};

export default SearchMain;
