import express from "express";
import { run_query } from "../db/connectiondb.js";
import cloudinary from "../cloudenary.js"; 
const router = express.Router();

// set userProfile image
router.post("/patientProfile", async (req, res) => {
  const { imageBase64, patientId } = req.body;
  console.log("server", patientId);
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "EyeCare",
      unique_filename: true,
      timeout: 60000,
      transformation: [{
        width: 800, height: 600,
        crop: "limit"
      }]
    });
    console.log(cloudinaryResponse);
    const query = await run_query(`UPDATE PATIENT SET PATIENT_IMAGE = :image WHERE PATIENT_ID = :id`, {
      image: cloudinaryResponse.secure_url,
      id: patientId,
    });
    res
      .status(200)
      .json({
        message: "Image uploaded successfully",
        url: cloudinaryResponse.secure_url,
      });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
});

export default router;
