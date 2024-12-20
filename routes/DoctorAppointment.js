import express from "express";
import supabase from "../db/SupabaseClient.js";

const router = express.Router();

// Fetch appointments for a specific doctor
router.get("/senddoctorappointments", async (req, res) => {
  const { doctorId } = req.query;

  try {
    // Query appointments for the given doctorId using Supabase
    const { data: appointments, error } = await supabase
      .from("appointment")
      .select(
        `
        appointment_id,
        appointment_date,
        appointment_time,
        appointment_status,
        patients!inner(patient_name) 
      `
      )
      .eq("doctor_id", doctorId);

    if (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }

    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found for the given doctor." });
    }

    const formattedAppointments = appointments.map((appointment) => ({
      appointment_id: appointment.appointment_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      appointment_status: appointment.appointment_status,
      patient_name: appointment.patients.patient_name,
    }));
    console.log(formattedAppointments);

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

export default router;
