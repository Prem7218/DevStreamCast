import React from "react";

const ImgsUploadBtn = ({
  privates
}) => {

  return (
    <>
      {showUpload.img && (
        <div
          className={`absolute ${
            privates ? "bottom-40 mx-auto" : "bottom-16 left-0"
          } bg-white border border-gray-300 rounded-md shadow-md w-[180px] p-2 space-y-2 z-50`}
        >
          <button
            className="block w-full text-left px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer"
          >
            🌐 Normal Upload
          </button>

          {!privates && (
            <button
              className="block w-full text-left px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded-md cursor-pointer"
            >
              ⏳ Temporary Upload
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ImgsUploadBtn;
