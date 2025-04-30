import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Delete route
app.post("/delete", async (req, res) => {
  const { publicId } = req.body;
  console.log("PublicId: ", publicId);
  if (!publicId) return res.status(400).json({ error: "Missing publicId" });

  try {
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      cloudinary: cloudinaryResult,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`running: http://localhost:${PORT}`);
});
