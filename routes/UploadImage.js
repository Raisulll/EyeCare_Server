import express from "express";
import supabase from "../db/SupabaseClient.js";
import cloudinary from "../cloudenary.js";

const router = express.Router();

// set userProfile image
router.post("/patientProfile", async (req, res) => {
  const { imageBase64, patientId } = req.body;
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
    const { error } = await supabase
      .from("patient")
      .update({ patient_image: cloudinaryResponse.secure_url })
      .eq("patient_id", patientId);
    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image." });
    }
    res.status(200).json({
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
    const { error } = await supabase
      .from("doctor")
      .update({ doctor_image: cloudinaryResponse.secure_url })
      .eq("doctor_id", doctorId);
    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image." });
    }
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
});

// set shop profile image
router.post("/shopprofile", async (req, res) => {
  const { imageBase64, shopId } = req.body;
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
    const { error } = await supabase
      .from("shop")
      .update({ shop_image: cloudinaryResponse.secure_url })
      .eq("shop_id", shopId);
    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image." });
    }
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
});

router.post("/deliveryprofile", async (req, res) => {
  const { imageBase64, deliveryId } = req.body;
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
    const { error } = await supabase
      .from("delivery_agency")
      .update({ delivery_image: cloudinaryResponse.secure_url })
      .eq("delivery_agency_id", deliveryId);
    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image." });
    }
    res.status(200).json({
      message: "Image uploaded successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image." });
  }
});

router.post("/hospitalprofile", async (req, res) => {
  const { imageBase64, hospitalId } = req.body;
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
    const { error } = await supabase
      .from("hospital")
      .update({ hospital_image: cloudinaryResponse.secure_url })
      .eq("hospital_id", hospitalId);
    if (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ message: "Error uploading image." });
    }
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
