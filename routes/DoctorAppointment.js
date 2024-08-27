import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// Fetch appointments for a specific doctor
router.get("/senddoctorappointments", async (req, res) => {
  const { doctorId } = req.query; // Get doctorId from query parameters
  // console.log(doctorId);
  try {
    const query = `
      SELECT A.APPOINTMENT_ID,A.APPOINTMENT_DATE, A.APPOINTMENT_TIME, A.APPOINTMENT_STATUS, 
             P.PATIENT_NAME
      FROM APPOINTMENT A, PATIENT P
      WHERE
      A.DOCTOR_ID = :doctorId AND
      A.PATIENT_ID = P.PATIENT_ID AND
      A.APPOINTMENT_STATUS = 'Pending'
    `;

    const appointments = await run_query(query, [doctorId]);

    // console.log(appointments);
    // Ensure data is sent in the correct format (array of objects)
    const formattedAppointments = appointments.map((appointment) => ({
      APPOINTMENT_ID: appointment.APPOINTMENT_ID,
      APPOINTMENT_DATE: appointment.APPOINTMENT_DATE,
      APPOINTMENT_TIME: appointment.APPOINTMENT_TIME,
      APPOINTMENT_STATUS: appointment.APPOINTMENT_STATUS,
      PATIENT_NAME: appointment.PATIENT_NAME,
    }));
    console.log(formattedAppointments);

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

export default router;
