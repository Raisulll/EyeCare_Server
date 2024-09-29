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

// set doctorProfile image
router.post("/doctorProfile", async (req, res) => {
  const { imageBase64, doctorId } = req.body;
  console.log("server", doctorId);
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "EyeCare",
      unique_filename: true,
      timeout: 60000,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "limit",
        },
      ],
    });
    console.log(cloudinaryResponse);
    const query = await run_query(
      `UPDATE DOCTOR SET DOCTOR_IMAGE = :image WHERE DOCTOR_ID = :id`,
      {
        image: cloudinaryResponse.secure_url,
        id: doctorId,
      }
    );
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
})

// set shop profile image
router.post("/shopprofile", async (req, res) => {
  const { imageBase64, shopId } = req.body;
  console.log("server", shopId);
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "EyeCare",
      unique_filename: true,
      timeout: 60000,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "limit",
        },
      ],
    });
    console.log(cloudinaryResponse);
    const query = await run_query(
      `UPDATE SHOP SET SHOP_IMAGE = :image WHERE SHOP_ID = :id`,
      {
        image: cloudinaryResponse.secure_url,
        id: shopId,
      }
    );
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
})


router.post("/deliveryprofile", async (req, res) => {
  const { imageBase64, deliveryId } = req.body;
  console.log("server", deliveryId);
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: "EyeCare",
      unique_filename: true,
      timeout: 60000,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "limit",
        },
      ],
    });
    console.log(cloudinaryResponse);
    const query = await run_query(
      `UPDATE DELIVERY_AGENCY SET DELIVERY_IMAGE = :image WHERE DELIVERY_AGENCY_ID = :id`,
      {
        image: cloudinaryResponse.secure_url,
        id: deliveryId,
      }
    );
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
});

export default router;
