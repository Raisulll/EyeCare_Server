import express from "express";
import { run_query, runCursorQuery } from "../db/connectiondb.js";

const router = express.Router();

// Fetch appointments for a specific doctor
router.get("/senddoctorappointments", async (req, res) => {
  const { doctorId } = req.query; // Get doctorId from query parameters
  // console.log(doctorId);
  try {
    const appointments = await runCursorQuery(
      `BEGIN GET_DOCTOR_APPOINTMENTS(:doctorId, :cursor); END;`,
      { doctorId }
    );

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
    if (error.errorNum === 20001) {
      res.status(404).json({ error: "No pending appointments found for the given doctor." });
    }
    else if(error.errorNum === 20002) {
      res.status(405).json({ error: "No appointments found for the given doctor." });
    }
    else if(error.errorNum === 20003) {
      res
        .status(406)
        .json({
          error: "An unexpected error occurred. Please try again later.",
        });
    }
  }
});

export default router;
