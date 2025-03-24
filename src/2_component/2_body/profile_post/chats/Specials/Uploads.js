import { useCallback } from "react";
import { resizeImage } from "../Image/reziseImage";

export const Uploads = ({ setUploads, setUploadType, setshowUpload }) => {
  const handleChange = useCallback(
    async (e, fileType, uploadType) => {
      const file = e.target.files?.[0];
      if (!file) return alert("Please select a file first!");

      let fileURL = URL.createObjectURL(file);

      if (uploadType === "normal" && fileType === "image/*") {
        try {
          const resizedFile = await resizeImage(file);
          const formData = new FormData();
          formData.append("file", resizedFile);
          formData.append("upload_preset", "DevStreamCast");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
            { method: "POST", body: formData }
          );

          const data = await response.json();
          if (data.secure_url) {
            setUploads((prev) => ({ ...prev, imageUpload: data.secure_url }));
          } else {
            alert("Failed to upload file.");
          }
        } catch (error) {
          console.error("Upload Error:", error);
        }
      } else {
        setUploads((prev) => ({
          ...prev,
          imageUpload: fileType === "image/*" ? fileURL : prev.imageUpload,
          documentUpload:
            fileType === "application/pdf" ? fileURL : prev.documentUpload,
          zipElseUpload:
            fileType === "application/zip" ? fileURL : prev.zipElseUpload,
          locationUpload:
            fileType === "location" ? fileURL : prev.locationUpload,
        }));

        setTimeout(() => URL.revokeObjectURL(fileURL), 5000); // Cleanup
      }

      setUploadType("");
      setshowUpload((prev) => ({...prev, img:false}));
    },
    [setUploads, setUploadType, setshowUpload]
  );

  return { handleChange };
};
