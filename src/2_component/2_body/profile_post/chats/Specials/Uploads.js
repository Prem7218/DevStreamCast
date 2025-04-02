import { useCallback } from "react";
import { resizeImage } from "../Image/reziseImage";

// ✅ Helper function to upload to Cloudinary (Handles images, PDFs, ZIPs)
const uploadToCloudinary = async (file, fileType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "DevStreamCast"); // Make sure this preset supports PDFs & ZIPs

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  if (data.secure_url) {
    return data.secure_url;
  } else {
    throw new Error("Failed to upload file.");
  }
};

export const Uploads = ({ setUploads, setUploadType, setshowUpload }) => {
  const handleChange = useCallback(
    async (e, fileType, uploadType) => {
      const file = e.target.files?.[0];
      if (!file) return alert("Please select a file first!");

      try {
        let fileURL = URL.createObjectURL(file); // Temporary URL

        if (uploadType === "normal") {
          if (fileType === "image/*") {
            const resizedFile = await resizeImage(file);
            fileURL = await uploadToCloudinary(resizedFile, "image/*");
          } else if (fileType === "application/pdf" || fileType === "application/zip") {
            fileURL = await uploadToCloudinary(file, fileType);
          }
        }

        // ✅ Update State with Permanent File URL
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
        console.error("Upload Error:", error);
        alert("Failed to upload file.");
      }
    },
    [setUploads, setUploadType, setshowUpload]
  );

  return { handleChange };
};
