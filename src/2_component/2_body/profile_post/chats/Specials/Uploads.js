import { useCallback } from "react";
import { resizeImage } from "../Image/reziseImage";

export const Uploads = ({ setUploads, setUploadType, setshowUpload }) => {
  const handleChange = useCallback(
    async (e, fileType) => {
      const file = e?.target?.files?.[0];

      if (!file) {
        alert("Please select a file first!");
        return;
      }

      if (fileType === "image/*") {
        const resizedFile = await resizeImage(file); // 🔄 Resize for Faster Upload
        const formData = new FormData();
        formData.append("file", resizedFile);
        formData.append("upload_preset", "DevStreamCast");

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.secure_url) {
            setUploads((prev) => ({ ...prev, imageUpload: data.secure_url }));
          } else {
            alert("Failed to upload file.");
          }
        } catch (error) {
          console.error("Upload Error:", error);
        } finally {
          console.log("Coming Done...");
        }
      } else {
        const fileURL = URL.createObjectURL(file);

        switch (fileType) {
          case "image/*":
            setUploads({
              locationUpload: null,
              documentUpload: null,
              zipElseUpload: null,
              imageUpload: fileURL,
            });
            break;
          case "application/pdf":
            setUploads({
              locationUpload: null,
              documentUpload: fileURL,
              zipElseUpload: null,
              imageUpload: null,
            });
            break;
          case "application/zip":
            setUploads({
              locationUpload: null,
              documentUpload: null,
              zipElseUpload: fileURL,
              imageUpload: null,
            });
            break;
          case "location":
            setUploads({
              locationUpload: fileURL,
              documentUpload: null,
              zipElseUpload: null,
              imageUpload: null,
            });
            break;
          default:
            console.log("Unsupported file type selected.");
        }
        setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
      }
      setUploadType("");
    },
    [setUploads, setUploadType, setshowUpload]
  );

  return { handleChange };
};
