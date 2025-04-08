import React from "react";
import ImgUploadBtn from "./ImgUploadBtn";
import { FaFileAlt } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { FiSmile } from "react-icons/fi";

export const Special = ({
  setShowEmojiPicker,
  showEmojiPicker,
  setNewMessage,
}) => {
  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji); // Append selected emoji
    setShowEmojiPicker(false); // Close picker after selection
  };

  return (
    <>
      <div className="relative">
        {/* 😊 Emoji Button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <FiSmile size={22} />
        </button>

        {/* 🔹 Emoji Picker (Toggle on Click) */}
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-30">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </>
  );
};

import React from "react";
import { FaFileAlt } from "react-icons/fa";
import MapLibreSatellite from "./MapLibreSatellite";
import { useOpen } from "../../../../../3_context/openContext";

export const FileUploading = ({
  upload,
  setUploads,
  fileType,
  privates,
  setUploadType,
  fileInputRef,
  uploadType,
  handleChange,
  handleLocationShare,
  setshowUpload,
  showUpload,
}) => {
  const { showMap, setShowMap } = useOpen();

  const removeFile = () => {
    setUploads((prev) => ({
      ...prev,
      imageUpload: fileType === "image/*" ? null : prev.imageUpload,
      documentUpload:
        fileType === "application/pdf" ? null : prev.documentUpload,
      zipElseUpload: fileType === "application/zip" ? null : prev.zipElseUpload,
      locationUpload: fileType === "location" ? null : prev.locationUpload,
    }));

    setshowUpload((prev) => ({ ...prev, previews: false }));
  };

  return (
    <div className="flex flex-col items-center">
      {/* File Preview Section */}
      {upload !== null && !showUpload.previews && (
        <div className="absolute left-2 bottom-16 w-[200px] h-auto border border-gray-300 rounded-lg shadow-lg bg-white z-50">
          {fileType === "image/*" && (
            <img
              src={upload}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          )}

          {privates && (
            <>
              {fileType === "application/pdf" && (
                <div className="flex items-center gap-3 p-3">
                  <FaFileAlt className="text-red-500 text-3xl" />
                  {console.log("Upload: ", upload)}
                  <a
                    href={upload}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View PDF Document
                  </a>
                </div>
              )}

              {fileType === "application/zip" && (
                <div className="flex items-center gap-3 p-3">
                  <FaFileAlt className="text-yellow-500 text-3xl" />
                  <a
                    href={upload}
                    download
                    className="text-blue-500 hover:underline"
                  >
                    Download ZIP File
                  </a>
                </div>
              )}

              {/* Map Sharing Link */}
              {fileType === "location" && (
                <>
                  <div className="flex items-center gap-3 p-3">
                    <button
                      onClick={() => setShowMap(true)}
                      className="text-blue-500 hover:underline cursor-pointer"
                    >
                      📍 View Location
                    </button>
                  </div>

                  {showMap && (
                    <MapLibreSatellite
                      location={upload}
                      onClose={() => {
                        setShowMap(false);
                        setshowUpload((prev) => ({ ...prev, previews: false }));
                        setUploads({
                          imageUpload: null,
                          locationUpload: null,
                          documentUpload: null,
                          zipElseUpload: null,
                        });
                      }}
                      setUploads={setUploads}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* ❌ Remove Button */}
          {fileType !== "location" && (
            <button
              onClick={removeFile}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-[1px] rounded-md hover:bg-red-600 cursor-pointer"
            >
              ✖
            </button>
          )}
        </div>
      )}

      <ImgUploadBtn
        handleLocationShare={handleLocationShare}
        uploadType={uploadType}
        fileInputRef={fileInputRef}
        setUploadType={setUploadType}
        handleChange={handleChange}
        privates={privates}
        fileType={fileType}
        setshowUpload={setshowUpload}
        showUpload={showUpload}
      />
    </div>
  );
};
