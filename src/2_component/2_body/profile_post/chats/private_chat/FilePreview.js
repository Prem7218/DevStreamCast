import React from "react";
import { FaFileAlt, FaMapMarkerAlt } from "react-icons/fa";

const FilePreview = ({ fileType, fileData, locationLink }) => {
  return (
    <div className="w-full h-full p-4 rounded-md shadow-md border border-gray-300 bg-gray-100">
      {/* 🔹 Image Preview */}
      {fileType === "image/*" && (
        <img
          src={fileData}
          alt="Image Preview"
          className="w-full h-64 object-cover rounded-md"
        />
      )}

      {/* 🔹 Document Preview (PDF, DOCX, etc.) */}
      {fileType === "application/pdf" && (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow">
          <FaFileAlt className="text-red-500 text-3xl" />
          <a
            href={fileData}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View PDF Document
          </a>
        </div>
      )}

      {/* 🔹 File Preview (ZIP, EXE, etc.) */}
      {fileType === "application/zip" && (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow">
          <FaFileAlt className="text-yellow-500 text-3xl" />
          <a
            href={fileData}
            download
            className="text-blue-500 hover:underline"
          >
            Download ZIP File
          </a>
        </div>
      )}

      {/* 🔹 Location Sharing */}
      {fileType === "location" && (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow">
          <FaMapMarkerAlt className="text-green-500 text-3xl" />
          <a
            href={`https://www.google.com/maps?q=${locationLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Location on Maps
          </a>
        </div>
      )}

      {/* 🔹 Unknown File Type */}
      {!['image/*', 'application/pdf', 'application/zip', 'location'].includes(fileType) && (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md shadow">
          <FaFileAlt className="text-gray-500 text-3xl" />
          <span className="text-gray-500">Unsupported File Type</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
