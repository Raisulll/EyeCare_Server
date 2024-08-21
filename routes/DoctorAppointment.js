import express from 'express';
import { run_query } from '../db/connectiondb.js';


const router = express.Router();

// Fetch appointments for a specific doctor
router.get('/senddoctorappointments', async (req, res) => {
  const { doctorId } = req.query; // Get doctorId from query parameters
  
  try {
    const query = `
      SELECT A.APPOINTMENT_DATE, A.APPOINTMENT_TIME, A.APPOINTMENT_STATUS, 
             P.PATIENT_NAME 
      FROM APPOINTMENT A
      JOIN PATIENT P ON A.PATIENT_ID = P.PATIENT_ID
      WHERE A.DOCTOR_ID = :doctorId
    `;
    
    const appointments = await run_query(query, [doctorId]);

    // Ensure data is sent in the correct format (array of objects)
    const formattedAppointments = appointments.map(appointment => ({
      APPOINTMENT_DATE: appointment[0],
      APPOINTMENT_TIME: appointment[1],
      APPOINTMENT_STATUS: appointment[2],
      PATIENT_NAME: appointment[3]
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

export default router;
