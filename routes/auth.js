// routes/signup.js
import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();


//Signup route
router.post("/signup", async (req, res) => {
  const {
    patientName,
    patientEmail,
    patientPhone,
    patientDob,
    patientDistrict,
    patientArea,
    patientRoadNum,
    patientGender,
    patientPassword,
  } = req.body;


  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM PATIENT WHERE PATIENT_MAIL = :patientEmail`;
  const checkEmailParams = { patientEmail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "Email already exists" });
  }


  //Insert the user into the database
  const query = `INSERT INTO PATIENT (PATIENT_NAME, PATIENT_MAIL, PATIENT_PHONE, PATIENT_DOB, PATIENT_DISTRICT, PATIENT_AREA, PATIENT_ROADNUMBER, PATIENT_GENDER, PATIENT_PASSWORD) 
                 VALUES (:patientName, :patientEmail, :patientPhone, TO_DATE(:patientDob, 'YYYY-MM-DD'), :patientDistrict, :patientArea, :patientRoadNum, :patientGender, :patientPassword)`;

  const params = {
    patientName,
    patientEmail,
    patientPhone,
    patientDob,
    patientDistrict,
    patientArea,
    patientRoadNum,
    patientGender,
    patientPassword,
  };

  try {
    await run_query(query, params);
    res.status(200).json({ msg: "User created successfully" });
  } catch (err) {
    console.error(err); 
    res.status(400).json({ error: "Error creating user" });
  }
});


//Login route
router.post("/login", async (req, res) => {
  const { patientEmail, patientPassword } = req.body;

  //Authenticate the eamil is a user 
  const query = `SELECT * FROM PATIENT WHERE PATIENT_MAIL = :patientEmail`;
  const params = { patientEmail };
  const user = await run_query(query, params);
  if(user.length === 0){
    return res.status(404).json({error: "User not found"});
  }

  //Authenticate the password
  if(user[0][9] !== patientPassword){
    return res.status(401).json({error: "Invalid password"});
  }
  else
    res.status(200).json({msg: "User logged in successfully"});

})



export default router;
