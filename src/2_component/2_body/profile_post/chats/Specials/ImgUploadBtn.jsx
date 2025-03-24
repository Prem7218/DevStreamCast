import React, { useState } from "react";
import { FiImage, FiMapPin } from "react-icons/fi";
import ImgsUploadBtn from "./ImgsUploadBtn";

const ImgUploadBtn = ({
  handleLocationShare,
  handleChange,
  privates,
  fileType,
  fileInputRef,
  uploadType,
  showUpload,
  setUploadType,
  setshowUpload,
}) => {
  const [showImgUpload, setShowImgUpload] = useState(false);

  const btnClasses = `cursor-pointer bg-gray-200 p-2 flex items-center gap-2 
    ${privates ? "h-6 mt-3 w-[95%] px-3 py-1" : "h-10 w-10"} 
    mt-1 rounded-lg hover:bg-gray-300 transition`;

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleChange(e, fileType, uploadType);
    }
    setShowImgUpload(false);
  };

  const handleClick = () => {
    if (fileType === "location") {
      handleLocationShare();
    } else {
      setshowUpload((prev) => ({ ...prev, img: !prev.img }));
    }
  };

  return (
    <>
      {fileType === "image/*" && (
        <>
          {showUpload.img && (
            <div
              className={`relative ${
                privates ? "bottom-14 right-24" : "bottom-28 right-16"
              }`}
            >
              <ImgsUploadBtn
                setUploadType={setUploadType}
                privates={privates}
                fileInputRef={fileInputRef}
                setShowImgUpload={setShowImgUpload}
                showUpload={showUpload}
                setShowUpload={setshowUpload}
              />
            </div>
          )}

          {showImgUpload && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          )}

          <button
            onClick={handleClick}
            className={`flex justify-start bg-gray-200 ${privates ? "py-2 px-8 h-7 mt-1" : "p-2"} rounded-lg items-center text-sm text-gray-600 gap-2 cursor-pointer`}
          >
            <div>Img {privates && "Upload Image"}</div>
          </button>
        </>
      )}

      {privates && fileType !== "image/*" && (
        <label className={btnClasses}>
          <>
            {fileType !== "location" && (
              <input
                type="file"
                accept={fileType}
                onChange={handleFileChange}
                className="hidden"
              />
            )}

            {fileType === "location" ? (
              <FiMapPin size={22} className="text-green-500" />
            ) : (
              <FiImage size={22} className="text-gray-500" />
            )}

            <div className="text-sm text-gray-600">
              {fileType === "application/pdf"
                ? "Upload Document"
                : fileType === "location"
                ? "Share Location"
                : "Share Files"}
            </div>
          </>
        </label>
      )}
    </>
  );
};

export default ImgUploadBtn;
