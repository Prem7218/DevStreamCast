import React, { useEffect } from "react";

const MessageActions = ({
  messages,
  selectAllMessages,
  selectedMessages,
  copySelectedMessages,
  changeTheme
}) => {
  const hasSelectedMessages = Object.values(selectedMessages).some(Boolean);

  useEffect(() => {
    console.log("Hello");
  }, [])

  return (
    <div className="absolute top-10 right-0 w-44 bg-white text-black border border-gray-200 shadow-md rounded-lg z-50">
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => selectAllMessages(messages)}
      >
        ✅ Select All
      </button>

      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={copySelectedMessages}
      >
        📄 {hasSelectedMessages ? "Copy Selected" : "Copy All"}
      </button>

      <hr className="my-1" />
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => changeTheme("bg-blue-50")}
      >
        🌊 Blue Theme
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => changeTheme("bg-green-50")}
      >
        🌿 Green Theme
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => changeTheme("bg-gray-100")}
      >
        🌫️ Default Theme
      </button>
    </div>
  );
};

export default MessageActions;
