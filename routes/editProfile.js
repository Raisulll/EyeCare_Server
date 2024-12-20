import express from "express";
import supabase from "../db/SupabaseClient.js";

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

    const { error } = await supabase
      .from("doctor")
      .update({
        doctor_name: doctorName,
        doctor_mail: doctorEmail,
        doctor_phone: doctorPhone,
        doctor_district: doctorDistrict,
        doctor_area: doctorArea,
        doctor_roadnumber: doctorRoadNum,
        doctor_gender: doctorGender,
        doctor_license: doctorLicense,
        doctor_timeslot: timeslot,
        doctor_speciality: experience,
      })
      .eq("doctor_id", doctorId);
    if (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
    console.log(req.body);

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

  try {
    const { error } = await supabase
      .from("patient")
      .update({
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_dob: patientDOB,
        patient_address: {
          patientDistrict,
          patientArea,
          patientRoadNumber,
        },
      })
      .eq("patient_id", patientId);
    if (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
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

  try {
    const { error } = await supabase
      .from("doctor")
      .update({
        doctor_name: doctorName,
        doctor_mail: doctorMail,
        doctor_phone: doctorPhone,
        doctor_district: doctorDistrict,
        doctor_area: doctorArea,
        doctor_roadnumber: doctorRoadNumber,
        doctor_speciality: doctorSpeciality,
      })
      .eq("doctor_id", doctorId);
    if (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ message: "Failed to update profile" });
    }
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
