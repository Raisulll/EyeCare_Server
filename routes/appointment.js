import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();


router.get('/doctors', async (req, res) => {
  try {
      const query = 'SELECT DOCTOR_ID, DOCTOR_NAME FROM DOCTOR';
      const doctors = await run_query(query, []);
      console.log(doctors);
      res.json(doctors);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});


router.get('/doctors/:doctorId/times', async (req, res) => {
  const doctorId = parseInt(req.params.doctorId, 10);
  if (isNaN(doctorId)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
  }
  try {
      const query = 'SELECT DOCTOR_TIMESLOT FROM DOCTOR WHERE DOCTOR_ID = :doctorId';
      const times = await run_query(query, { doctorId });
      console.log(times);
      res.json(times.map(row => row[0]));

  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch time slots' });
  }
});


router.post('/appointments', async (req, res) => {
    console.log(req.body);
  const { doctor, time, day, patientId } = req.body;
  if (!doctor || !time || !day || !patientId) {
      return res.status(400).json({ error: 'Please provide all required fields' });
  }
  try {
      const query = `
          INSERT INTO APPOINTMENT (APPOINTMENT_DATE, APPOINTMENT_TIME,APPOINTMENT_STATUS, PATIENT_ID,DOCTOR_ID)
          VALUES (SYSDATE,:time,'false',:patientId,:doctor)
      `;
      await run_query(query, { doctor, time, patientId });
      res.status(201).send('Appointment booked');
  } catch (error) {
      res.status(500).json({ error: 'Failed to book appointment' });
}
});

export default router;
