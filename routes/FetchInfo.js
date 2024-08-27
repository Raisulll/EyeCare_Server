//fetch info for doctor profile

import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// fetch doctor data
router.get("/doctordata", async (req, res) => {
  const doctorId = req.query.doctorid;
  try {
    const doctorData = await run_query(
      `SELECT * FROM DOCTOR WHERE DOCTOR_ID=${doctorId}`,
      {}
    );
    console.log(doctorData);
    res.status(200).json(doctorData[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch patient data
router.get("/patientdata", async (req, res) => {
  const patientId = req.query.patientid;
  console.log(patientId);
  try {
    const patientData = await run_query(
      `SELECT * FROM PATIENT WHERE PATIENT_ID=${patientId}`,
      {}
    );
    console.log(patientData);
    res.status(200).json(patientData[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch appointment info
router.get("/appointmentinfo", async (req, res) => {
  const appointmentId = req.query.appointmentId;
  console.log(appointmentId);
  try {
    const appointmentInfo = await run_query(
      `SELECT DOCTOR_NAME, PATIENT_NAME, APPOINTMENT_DATE, PATIENT_AGE
      FROM APPOINTMENT A, DOCTOR D, PATIENT P
      WHERE
      A.DOCTOR_ID=D.DOCTOR_ID AND
      A.PATIENT_ID = P.PATIENT_ID AND
      A.APPOINTMENT_ID=${appointmentId}`,
      {}
    );
    console.log(appointmentInfo);
    res.status(200).json(appointmentInfo[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch doctor transaction for a specific doctor

router.get("/senddoctortransactions", async (req, res) => {
  const doctorId = req.query.doctorId;
  console.log(doctorId);
  try {
    const transaction = await run_query(
      `SELECT PATIENT_NAME, TRANSACTION_DATE, TRANSACTION_AMOUNT 
    FROM TRANSACTION T, PATIENT P
    WHERE
    T.PATIENT_ID = P.PATIENT_ID AND
    T.DOCTOR_ID=${doctorId}
    `,
      {}
    );
    console.log("All okay", transaction);
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch patient transaction for a specific patient
router.get("/sendpatienttransactions", async (req, res) => {
  const patientId = req.query.patientId;
  console.log(patientId);
  try {
    const transaction = await run_query(
      `
      SELECT PAYMENT_TO, TRANSACTION_FOR, TRANSACTION_DATE, TRANSACTION_AMOUNT
      FROM TRANSACTION
      WHERE PATIENT_ID=${patientId}
      `,
      {}
    );
    console.log("All okay", transaction);
    res.status(200).json(transaction);
  } catch (error) { 
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch hospital info
router.get("/hospitaldata", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  console.log("Hospital Id",hospitalId);
  try {
    const hospitalData = await run_query(
      `SELECT * FROM HOSPITAL WHERE HOSPITAL_ID=${hospitalId}`,
      {}
    );
    console.log(hospitalData);
    res.status(200).json(hospitalData[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

//fetch schedule for a specific hospital
router.get("/hospitalSchedule", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  console.log(hospitalId);
  try {
    const schedule = await run_query(
      `SELECT DOCTOR_NAME, PATIENT_NAME, APPOINTMENT_DATE, APPOINTMENT_TIME
      FROM APPOINTMENT A, DOCTOR D, PATIENT P, HOSPITAL H
      WHERE
      A.DOCTOR_ID=D.DOCTOR_ID AND
      A.PATIENT_ID = P.PATIENT_ID AND
      A.HOSPITAL_ID = H.HOSPITAL_ID AND
      H.HOSPITAL_ID=${hospitalId}`,
      {}
    );
    console.log("All okay", schedule);
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});


//fetch prescription for a specific appointment
router.get("/prescriptionforpatient", async (req, res) => {
  const appointmentId = req.query.appointmentId;
  try {
    const prescriptioninfo = await run_query(`SELECT * FROM PRESCRIPTION WHERE APPOINTMENT_ID=${appointmentId}`, {})
    console.log(prescriptioninfo);
    res.status(200).json(prescriptioninfo[0]);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
})

export default router;
