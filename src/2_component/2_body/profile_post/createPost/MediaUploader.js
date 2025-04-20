import React from "react";
import { useDropzone } from "react-dropzone";
import { Uploads } from "../chats/Specials/Uploads";

const MediaUploader = ({ files, setFiles }) => {
  const { handleChange } = Uploads({ isPost: true });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },
    onDrop: async (acceptedFiles) => {
      const uploaded = [];

      for (const file of acceptedFiles) {
        const fileType = file.type.startsWith("image/") ? "image/*" : "video/*";

        try {
          const filer = await handleChange(
            { target: { files: [file] } }, 
            fileType,
            "normal"
          );

          const { url, public_id, resource_type } = filer;

          uploaded.push({
            public_id,
            resource_type,
            name: file.name,
            url: url,
            type: fileType,
          });
        } catch (err) {
          console.log("Failed to upload:", file.name);
        }
      }
      
      setFiles((prev) => [...prev, ...uploaded]);
    },
  });

  return (
    <div
      {...getRootProps()}
      className="dropzone cursor-pointer p-4 border rounded text-center"
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">
        📂 Drag & drop images/videos here, or click to select files
      </p>

      {/* <div className="mt-3 flex flex-wrap gap-3">
        {files.map((file, idx) => (
          <div key={idx} className="text-sm text-gray-700">
            ✅ {file.name}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default MediaUploader;
