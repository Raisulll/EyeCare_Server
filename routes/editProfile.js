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
      doctorId: Number(doctorId), 
    });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



//update patient details

router.post("/patientProfileData", async (req, res) => {
  console.log("Patient profile data", req.body);
  const {
    patientId,
    patientName,
    patientPhone,
    patientDOB,
    patientDistrict,
    patientArea,
    patientRoadNumber,
  } = req.body;
  const updatePatientProfile = `
    UPDATE PATIENT
    SET
      PATIENT_NAME = :patientName,
      PATIENT_PHONE = :patientPhone,
      PATIENT_DOB = TO_DATE(:patientDOB, 'YYYY-MM-DD'),
      PATIENT_DISTRICT = :patientDistrict,
      PATIENT_AREA = :patientArea,
      PATIENT_ROADNUMBER = :patientRoadNumber
    WHERE PATIENT_ID = :patientId
  `;
  try {
    await run_query(updatePatientProfile, {
      patientName,
      patientPhone,
      patientDOB,
      patientDistrict,
      patientArea,
      patientRoadNumber,
      patientId: Number(patientId),
    });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//update doctor data
router.post("/doctorProfileData", async (req, res) => {
  console.log("Doctor profile data", req.body);
  const {
    doctorId,
    doctorName,
    doctorMail,
    doctorPhone,
    doctorDistrict,
    doctorArea,
    doctorRoadNumber,
    doctorSpeciality,
  } = req.body;
  const updatePatientProfile = `
    UPDATE DOCTOR
    SET
      DOCTOR_NAME = :doctorName,
      DOCTOR_MAIL = :doctorMail,
      DOCTOR_PHONE = :doctorPhone,
      DOCTOR_DISTRICT = :doctorDistrict,
      DOCTOR_AREA = :doctorArea,
      DOCTOR_ROADNUMBER = :doctorRoadNumber,
      DOCTOR_SPECIALITY = :doctorSpeciality
    WHERE DOCTOR_ID = :doctorId
  `;
  try {
    await run_query(updatePatientProfile, {
      doctorName,
      doctorMail,
      doctorPhone,
      doctorDistrict,
      doctorArea,
      doctorRoadNumber,
      doctorSpeciality,
      doctorId: Number(doctorId),
    });
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
