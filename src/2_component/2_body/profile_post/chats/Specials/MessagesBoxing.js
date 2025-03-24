import React, { useState } from "react";
import { imogies } from "../../../../../constantData/mock_data";
import useMessageSelection from "../../../../../1_hooks/useMessageSelection";
import { FaFileAlt, FaMapMarkerAlt } from "react-icons/fa";
import MapLibreSatellite from "./MapLibreSatellite";

const MessagesBoxing = ({
  upload,
  messages,
  username,
  imogie,
  setImogie,
  setUploads,
  classi,
}) => {
  const { selectedMessages, toggleMessageSelection } = useMessageSelection();
  const [showMap, setShowMap] = useState(false);

  return (
    <>
      <div>
        {messages.map((msg, index) => {
          const messanerId = msg.senderId;
          const isCurrentUser =
            msg.username === username || messanerId === username;
          const isSelected = !!selectedMessages[messanerId];

          return (
            <div
              key={msg.id || index}
              className={`${classi} flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              } my-2`}
              onClick={() => toggleMessageSelection(index)}
            >
              {/* ✅ Show Checkbox for Selected Messages */}
              {!msg.username && isSelected && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleMessageSelection(index)}
                  className="mr-2 cursor-pointer"
                />
              )}

              <div
                className={`p-2 rounded-lg shadow-sm max-w-[85%] w-fit ${
                  isCurrentUser
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {/* 🔹 Text Message */}
                {msg.message && (
                  <div
                    className={`text-sm p-2 rounded-md shadow-md w-full ${
                      isCurrentUser
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-100 text-black mr-auto"
                    }`}
                    style={{
                      whiteSpace: "normal", // Allows wrapping for long messages
                      wordBreak: "break-word", // Ensures long words (like URLs) break into new lines
                      overflowWrap: "break-word", // Ensures long words don't overflow
                    }}
                  >
                    {msg.message}
                  </div>
                )}

                {(msg.image ||
                  msg.location ||
                  msg.document ||
                  msg.zipElseUpload) && (
                  <div
                    className={`relative my-2 max-h-40 w-fit ${
                      isCurrentUser ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    {/* 📷 Image Preview */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded Image"
                        className="rounded-md max-h-40 shadow-md hover:scale-95"
                      />
                    )}

                    {/* 📍 Location Preview (Only Show Map for Selected Message) */}
                    {msg.location && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md shadow-md">
                        <FaMapMarkerAlt className="text-green-500 text-3xl" />
                        <button
                          onClick={() => {
                            setUploads((prev) => ({
                              ...prev,
                              locationUpload: msg.location,
                            }));
                            setShowMap(true);
                          }}
                          className="text-blue-500 hover:underline cursor-pointer"
                        >
                          📍 View location
                        </button>
                      </div>
                    )}

                    {/* 📄 Document Preview (PDF) */}
                    {msg.document && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md shadow-md">
                        <FaFileAlt className="text-red-500 text-3xl" />
                        <a
                          href={msg.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View PDF Document
                        </a>
                      </div>
                    )}

                    {/* 📦 ZIP File Preview */}
                    {msg.zipElseUpload && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-gray-300 rounded-md shadow-md">
                        <FaFileAlt className="text-yellow-500 text-3xl" />
                        <a
                          href={msg.zipElseUpload}
                          download
                          className="text-blue-500 hover:underline"
                        >
                          Download ZIP File
                        </a>
                      </div>
                    )}

                    {/* 🟦 Emoji Reaction */}
                    {msg.username && imogie[msg.id] && (
                      <div
                        className={`absolute bottom-0 w-full flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-3xl drop-shadow-md">
                          {imogie[msg.id]}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 🔹 Emoji Selection */}
                <div className="flex space-x-2 mt-2 text-lg">
                  {msg.username &&
                    imogies.map((emoji) => (
                      <span
                        key={emoji}
                        className={`cursor-pointer ${
                          imogie[msg.id] === emoji
                            ? "bg-blue-200 rounded-full"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selecting message when clicking emoji
                          setImogie((prev) => ({
                            ...prev,
                            [msg.id]: emoji,
                          }));
                        }}
                      >
                        {emoji}
                      </span>
                    ))}
                </div>

                {/* 🔹 Timestamp */}
                <span
                  className={`block text-xs text-gray-400 mt-1 ${
                    isCurrentUser ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showMap && (
        <div className="border border-gray-300 rounded-lg shadow-lg bg-white">
          <MapLibreSatellite
            location={upload}
            onClose={() => {
              setShowMap(false);
              setUploads({
                imageUpload: null,
                locationUpload: null,
                documentUpload: null,
                zipElseUpload: null,
              });
            }}
            setUploads={setUploads}
            messageBox={true}
          />
        </div>
      )}
    </>
  );
};

export default MessagesBoxing;
