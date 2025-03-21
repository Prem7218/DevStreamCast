import React from "react";
import { FiImage, FiMapPin } from "react-icons/fi";

const ImgUploadBtn = ({
  handleLocationShare,
  handleChange,
  privates,
  fileType,
}) => {
  const btnClasses = `cursor-pointer bg-gray-200 p-2 flex items-center gap-2 ${
    privates ? "h-6 mt-3 w-[95%] px-3 py-1" : "h-10"
  } mt-1 rounded-lg hover:bg-gray-300 transition`;

  const handleFileChange = (e) => {
    const fileSelected = e.target.files.length > 0;

    if (!fileSelected) {
      console.log("Hello's");
    } else {
      handleChange(e, fileType);
    }
  };

  const handleClick = () => {
    if (fileType === "location") {
      handleLocationShare();
    }
  };

  return (
    <label className={btnClasses} onClick={handleClick}>
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

      {privates && (
        <div className="text-sm text-gray-600">
          {fileType === "image/*"
            ? "Upload Image"
            : fileType === "application/pdf"
            ? "Upload Document"
            : fileType === "location"
            ? "Share Location"
            : "Share Files"}
        </div>
      )}
    </label>
  );
};

export default ImgUploadBtn;
