import React from "react";

const ImgsUploadBtn = ({
  privates,
  fileInputRef,
  setUploadType,
  setShowImgUpload,
  showUpload,
  setShowUpload,
}) => {

  const handleUploadImg = (ImgType) => {
    try {
      setShowUpload((prev) => ({ ...prev, img: false }));
      setUploadType(ImgType);

      if(showUpload?.img) {
        const timeout = setTimeout(() => {
          if(fileInputRef?.current) {
            fileInputRef?.current?.click();
          }
        }, 0);

        setShowImgUpload(true);
        return () => clearTimeout(timeout);
      }

    } catch(e) {
      console.log("Error: ", e);
    }
  }

  return (
    <div
      className={`absolute bg-white border border-gray-300 rounded-md shadow-md w-[180px] p-2 space-y-2 z-50`}
    >
      {/* 🌐 Normal Upload */}
      <button
        onClick={() => handleUploadImg("normal")}
        className="block w-full text-left px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer"
      >
        🌐 Normal Upload
      </button>

      {/* ⏳ Temporary Upload (Only Show if NOT Private) */}
      {!privates && (
        <button
          onClick={() => handleUploadImg("temp")}
          className="block w-full text-left px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-md cursor-pointer"
        >
          ⏳ Temporary Upload
        </button>
      )}
    </div>
  );
};

export default ImgsUploadBtn;
