import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// Route to fetch all doctors
router.get("/doctors", async (req, res) => {
  try {
    const query =
      "SELECT DOCTOR_ID, DOCTOR_NAME, DOCTOR_SPECIALITY, DOCTOR_PAYMENT FROM DOCTOR";
    const doctors = await run_query(query, []);
    // console.log(doctors);
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Route to fetch time slots for a specific doctor
router.get("/doctorstime", async (req, res) => {
  const doctorId = parseInt(req.query.doctorid);
  // console.log(doctorId);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }
  try {
    const query = `SELECT DOCTOR_TIMESLOT FROM DOCTOR WHERE DOCTOR_ID = :doctorId`;
    const times = await run_query(query, { doctorId });
    // console.log(times);
    res.json(times);
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
    const query = `
      SELECT 
        A.APPOINTMENT_ID, 
        A.APPOINTMENT_DATE, 
        A.APPOINTMENT_TIME, 
        A.APPOINTMENT_STATUS, 
        D.DOCTOR_NAME, 
        D.DOCTOR_SPECIALITY
      FROM 
        APPOINTMENT A, DOCTOR D, PATIENT P
      WHERE
        A.PATIENT_ID = P.PATIENT_ID AND
        A.DOCTOR_ID = D.DOCTOR_ID AND
        P.PATIENT_ID = :patientId AND
        A.APPOINTMENT_STATUS='Pending'
    `;

    // Run the query with parameterized input
    const appointments = await run_query(query, { patientId });

    // Log the results for debugging purposes
    // console.log(appointments);

    // Send the results back as a JSON response
    res.json(appointments);
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

  // Validate patientId
  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    const query = `
      SELECT 
        A.APPOINTMENT_ID, 
        A.APPOINTMENT_DATE, 
        A.APPOINTMENT_TIME, 
        A.APPOINTMENT_STATUS, 
        D.DOCTOR_NAME, 
        D.DOCTOR_SPECIALITY
      FROM 
        APPOINTMENT A, DOCTOR D, PATIENT P
      WHERE
        A.PATIENT_ID = P.PATIENT_ID AND
        A.DOCTOR_ID = D.DOCTOR_ID AND
        P.PATIENT_ID = :patientId AND
        A.APPOINTMENT_STATUS='Completed'
    `;

    // Run the query with parameterized input
    const appointments = await run_query(query, { patientId });

    // Log the results for debugging purposes
    // console.log(appointments);

    // Send the results back as a JSON response
    res.json(appointments);
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

 
  const doctor = req.body.appointment.doctor;
  const time = req.body.appointment.time;
  const date = req.body.appointment.date;
  const patientId = req.body.appointment.patientId;
  console.log(req.body, doctor, time, date, patientId);
  // Check if all required fields are provided
  if (!doctor || !time || !date || !patientId) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    // console.log(req.body);

    // SQL query to insert a new appointment
    const query = `
            INSERT INTO APPOINTMENT (
                APPOINTMENT_DATE, 
                APPOINTMENT_TIME, 
                APPOINTMENT_STATUS, 
                PATIENT_ID, 
                DOCTOR_ID
            ) 
            VALUES (
                TO_DATE(:bind_date, 'YYYY-MM-DD'), 
                :bind_time, 
                'Pending', 
                :bind_patientId, 
                :bind_doctor
            )
        `;

    // Running the query with provided values
    await run_query(query, {
      bind_date: date,
      bind_time: time,
      bind_patientId: patientId,
      bind_doctor: doctor
    });

    // Sending success response
    res.status(201).json({ message: "Appointment successfully booked!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ error: "Failed to book appointment" });
  }
});



export default router;
