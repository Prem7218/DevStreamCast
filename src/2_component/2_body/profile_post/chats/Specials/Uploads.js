import { useCallback } from "react";
import { resizeImage } from "../Image/reziseImage";

const uploadToCloudinary = async (file, fileType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "DevStreamCast");

  let resourceType = "auto"; 
  if (fileType?.startsWith("video")) resourceType = "video";
  else if (fileType?.startsWith("image")) resourceType = "image";
  else if (fileType === "application/pdf" || fileType === "application/zip") resourceType = "raw";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();

  if (data.secure_url) {
    return {
      url: data.secure_url,
      public_id: data.public_id,
      resource_type: resourceType,
    };
  } else {
    console.log("Cloudinary Error:", data);
  }
};

export const Uploads = ({ setUploads, setUploadType, setshowUpload, isPost }) => {
  const handleChange = useCallback(
    async (e, fileType, uploadType) => {
      const file = e.target.files?.[0];
      if (!file) return alert("Please select a file first!");

      try {
        let fileURL = URL.createObjectURL(file); 

        if (uploadType === "normal") {
          if (fileType.startsWith("image")) {
            const resizedFile = await resizeImage(file); 
            fileURL = await uploadToCloudinary(resizedFile, file.type);
          } 
          else if (fileType.startsWith("video")) {
            fileURL = await uploadToCloudinary(file, file.type);
          } 
          else if (fileType === "application/pdf" || fileType === "application/zip") {
            fileURL = await uploadToCloudinary(file, fileType);
          }
        }

        if(isPost) {
          return fileURL;
        }

        setUploads((prev) => ({
          ...prev,
          imageUpload: fileType === "image/*" ? fileURL : prev.imageUpload,
          documentUpload: fileType === "application/pdf" ? fileURL : prev.documentUpload,
          zipElseUpload: fileType === "application/zip" ? fileURL : prev.zipElseUpload,
          locationUpload: fileType === "location" ? fileURL : prev.locationUpload,
        }));

        setUploadType(""); // Reset upload type
        setshowUpload((prev) => ({ ...prev, img: false }));

      } catch (error) {
        console.log("Upload Error:", error);
        alert("Failed to upload file.");
      }
    },
    [setUploads, setUploadType, setshowUpload]
  );

  return { handleChange };
};
