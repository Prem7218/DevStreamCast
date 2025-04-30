import React, { useState, useRef, useEffect } from "react";

const PostOptions = ({
  mentions,
  setMentions1,
  setText,
  setMediaFiles,
  setOpen,
  setOpen1,
  displayedText,
  mediaman,
  isProfile,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  // Click-away listener to close options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common repost/edit logic
  const handleRepost = () => {
    setText(displayedText);
    setMediaFiles(mediaman);
    setMentions1(mentions)
    if (isProfile) {
      setOpen1(true);
    } else {
      setOpen(true);
    }
    setShowOptions(false);
  };

  return (
    <div className="relative inline-block text-left" ref={optionsRef}>
      <button
        onClick={() => setShowOptions((prev) => !prev)}
        title="Post Options"
        className="text-gray-500 hover:text-gray-700 text-xl px-2 cursor-pointer"
      >
        &#8942;
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-50">
          <button
            onClick={handleRepost}
            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            🔁 Repost
          </button>
          <button className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
            ✏️ Edit
          </button>
          <button
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostOptions;
