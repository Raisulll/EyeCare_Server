import express from "express";
import supabase from "../db/SupabaseClient.js";

const router = express.Router();

// Route to fetch all doctors
router.get("/doctors", async (req, res) => {
  try {
    const { data, error } = await supabase.from("doctor").select("*");
    if (error) {
      console.error("Error fetching doctors:", error);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

//search doctors
router.get("/doctorsearch", async (req, res) => {
  const search = req.query.search;
  console.log(search);
  try {
    const { data, error } = await supabase
      .from("doctor")
      .select("*")
      .ilike("doctor_name", `%${search}%`);
    if (error) {
      console.error("Error fetching doctors:", error);
      return res.status(500).json({ error: "Failed to fetch doctors" });
    }
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Route to fetch time slots for a specific doctor
router.get("/doctorstime", async (req, res) => {
  const doctorId = parseInt(req.query.doctorid);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }
  try {
    const { data, error } = await supabase
      .from("doctor")
      .select("doctor_timeslot")
      .eq("doctor_id", doctorId);
    if (error) {
      console.error(
        `Error fetching time slots for doctor ID: ${doctorId}`,
        error
      );
      return res.status(500).json({ error: "Failed to fetch time slots" });
    }
    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching time slots for doctor ID: ${doctorId}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch time slots" });
  }
});

// Route to fetch all upcomming appointments for a specific patient
router.get("/upcommingappointments", async (req, res) => {
  const patientId = parseInt(req.query.patientId);

  // Validate patientId
  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    const { data, error } = await supabase
      .from("upcoming_appointment_view")
      .select("*")
      .eq("patient_id", patientId);
    if (error) {
      console.error(
        `Error fetching appointments for patient ID: ${patientId}`,
        error
      );
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching appointments for patient ID: ${patientId}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Route to fetch all previous appointments for a specific patient
router.get("/previousappointments", async (req, res) => {
  const patientId = parseInt(req.query.patientId);

  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    const { data, error } = await supabase
      .from("previous_appointment_view")
      .select("*")
      .eq("patient_id", patientId);
    if (error) {
      console.error(
        `Error fetching appointments for patient ID: ${patientId}`,
        error
      );
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    res.json(data);
  } catch (error) {
    console.error(
      `Error fetching appointments for patient ID: ${patientId}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Route to book a new appointment
router.post("/appointmentsdata", async (req, res) => {
  console.log("Request Body: ", req.body.data);

  // Proper destructuring of req.body
  const { doctor, time, date, patientId } = req.body.data;

  // Log to verify values
  console.log("Extracted Data: ", doctor, time, date, patientId);

  // Check if all required fields are provided
  if (!doctor || !time || !date || !patientId) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }
  try {
    const { error } = await supabase.from("appointment").insert([
      {
        appointment_date: date,
        appointment_time: time,
        appointment_status: "Pending",
        patient_id: patientId,
        doctor_id: doctor,
      },
    ]);
    if (error) {
      console.error("Error booking appointment:", error);
      return res.status(500).json({ error: "Failed to book appointment" });
    }
    res.status(201).json({ message: "Appointment successfully booked!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

export default router;
