import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// Route to fetch all doctors
router.get("/doctors", async (req, res) => {
  try {
    const query =
      "SELECT * FROM DOCTOR_VIEW";
    const doctors = await run_query(query, []);
    // console.log(doctors);
    res.json(doctors);
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
    const doctors = await run_query(
      `SELECT *
      FROM DOCTOR_VIEW
      WHERE
      LOWER(DOCTOR_NAME) LIKE '%${search}%'`,
      {}
    );
    console.log(doctors);
    res.status(200).json(doctors);
  }
  catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
})

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
      SELECT * FROM UPCOMING_APPOINTMENT_VIEW WHERE PATIENT_ID = :patientId
    `;

    // Run the query with parameterized input
    const appointments = await run_query(query, { patientId });

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
      SELECT * FROM PREVIOUS_APPOINTMENT_VIEW WHERE PATIENT_ID = :patientId
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

    // Run the query with the extracted values
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
