import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

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

    const updateDoctorProfile = `UPDATE doctor SET doctorName = '${doctorName}', doctorGender = '${doctorGender}', doctorEmail = '${doctorEmail}', doctorPhone = '${doctorPhone}', doctorDistrict = '${doctorDistrict}', doctorArea = '${doctorArea}', doctorRoadNum = '${doctorRoadNum}', doctorLicense = '${doctorLicense}', timeslot = '${timeslot}', experience = '${experience}' WHERE DoctorId = ${doctorId}`;

    const result = await run_query(updateDoctorProfile);
    result.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



export default router;