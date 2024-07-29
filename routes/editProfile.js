import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// POST route to update the doctor's profile
router.post("/doctorprofile", async (req, res) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorGender,
      doctorEmail,
      doctorPhone,
      doctorDistrict,
      doctorArea,
      doctorRoadNum,
      doctorLicense,
      timeslot,
      experience,
    } = req.body;

    // Input validation
    if (
      !doctorId ||
      !doctorName ||
      !doctorEmail ||
      !doctorPhone ||
      doctorPhone.length !== 11 ||
      !doctorDistrict ||
      !doctorArea ||
      !doctorRoadNum ||
      !doctorLicense ||
      !timeslot ||
      !experience
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const updateDoctorProfile = `
      UPDATE DOCTOR
      SET
        DOCTOR_NAME = :doctorName,
        DOCTOR_MAIL = :doctorEmail,
        DOCTOR_PHONE = :doctorPhone,
        DOCTOR_DISTRICT = :doctorDistrict,
        DOCTOR_AREA = :doctorArea,
        DOCTOR_ROADNUMBER = :doctorRoadNum,
        DOCTOR_GENDER = :doctorGender,
        DOCTOR_LICENSE = :doctorLicense,
        DOCTOR_TIMESLOT = :timeslot,
        DOCTOR_SPECIALITY = :experience
      WHERE DOCTOR_ID = :doctorId
    `;

    console.log(req.body);

    // Execute the query with parameters
    await run_query(updateDoctorProfile, {
      doctorName,
      doctorEmail,
      doctorPhone,
      doctorDistrict,
      doctorArea,
      doctorRoadNum,
      doctorGender,
      doctorLicense,
      timeslot,
      experience,
      doctorId: Number(doctorId), // Ensure the ID is a number
    });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
