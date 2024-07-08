// routes/signup.js
import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

//patient Signup route
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

//Patient Login route
router.post("/login", async (req, res) => {
  const { patientEmail, patientPassword } = req.body;

  if (!patientEmail || !patientPassword)
    return res.status(400).json({ error: "Please fill all the fields" });

  //Authenticate the eamil is a user
  const query = `SELECT * FROM PATIENT WHERE PATIENT_MAIL = :patientEmail`;
  const params = { patientEmail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  //Authenticate the password
  if (user[0][9] !== patientPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      PatientId: user[0][0],
      patientName: user[0][1],
      patientEmail: user[0][2],
      patientPhone: user[0][3],
      patientDob: user[0][4],
      patientDistrict: user[0][5],
      patientArea: user[0][6],
      patientRoadNum: user[0][7],
      patientGender: user[0][8],
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});

// Doctor Signup route
router.post("/doctorsignup", async (req, res) => {
  const {
    doctorName,
    doctorEmail,
    doctorPhone,
    doctorDistrict,
    doctorArea,
    doctorRoadNum,
    doctorGender,
    doctorLicense,
    timeSlot,
    experience,
    doctorPassword,
  } = req.body;

  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM DOCTOR WHERE DOCTOR_MAIL = :doctorEmail`;
  const checkEmailParams = { doctorEmail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "User already exists" });
  }

  //Insert the user into the database
  const query = `INSERT INTO DOCTOR (DOCTOR_NAME, DOCTOR_MAIL, DOCTOR_PHONE, DOCTOR_DISTRICT, DOCTOR_AREA, DOCTOR_ROADNUMBER, DOCTOR_GENDER, DOCTOR_PASSWORD, DOCTOR_LICENSE, DOCTOR_TIMESLOT, DOCTOR_SPECIALITY) 
                 VALUES (:doctorName, :doctorEmail, :doctorPhone, :doctorDistrict, :doctorArea, :doctorRoadNum, :doctorGender, :doctorPassword, :doctorLicense, :timeSlot, :experience)`;

  const params = {
    doctorName,
    doctorEmail,
    doctorPhone,
    doctorDistrict,
    doctorArea,
    doctorRoadNum,
    doctorGender,
    doctorPassword,
    doctorLicense,
    timeSlot,
    experience,
  };

  try {
    await run_query(query, params);
    res.status(200).json({
      msg: "User createdf successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating user" });
  }
});

// Doctor Login route
router.post("/doctorsignin", async (req, res) => {
  const { doctorEmail, doctorPassword } = req.body;

  if (!doctorEmail || !doctorPassword)
    return res.status(400).json({ error: "Please fill all the fields" });

  //Authenticate the eamil is a user
  const query = `SELECT * FROM DOCTOR WHERE DOCTOR_MAIL = :doctorEmail`;
  const params = { doctorEmail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  console.log(user);
  //Authenticate the password
  if (user[0][11] !== doctorPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      DoctorId: user[0][0],
      doctorName: user[0][1],
      doctorEmail: user[0][2],
      doctorPhone: user[0][3],
      doctorDistrict: user[0][4],
      doctorArea: user[0][5],
      doctorRoadNum: user[0][6],
      doctorGender: user[0][7],
      doctorLicense: user[0][8],
      timeSlot: user[0][9],
      experience: user[0][10],
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});

// Shop Owner Signup route
router.post("/shopsignup", async (req, res) => {
  const {
    shopName,
    shopMail,
    shopPhone,
    shopDistrict,
    shopArea,
    shopRoadNum,
    shopLicense,
    shopPassword,
  } = req.body;

  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM SHOP WHERE SHOP_MAIL = :shopMail`;
  const checkEmailParams = { shopMail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  // console.log(emailExists);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "User already exists" });
  } else {
    //Insert the user into the database
    const query = `INSERT INTO SHOP (SHOP_NAME, SHOP_MAIL, SHOP_PHONE, SHOP_DISTRICT, SHOP_AREA, SHOP_ROADNUMBER, SHOP_LICENSE, SHOP_PASSWORD) 
                   VALUES (:shopName, :shopMail, :shopPhone, :shopDistrict, :shopArea, :shopRoadNum, :shopLicense, :shopPassword)`;

    const params = {
      shopName,
      shopMail,
      shopPhone,
      shopDistrict,
      shopArea,
      shopRoadNum,
      shopLicense,
      shopPassword,
    };

    try {
      await run_query(query, params);
      res.status(200).json({ msg: "User created successfully" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Error creating user" });
    }
  }
});

// // Shop Owner Login route
// router.post("/shopsignin", async (req, res) => {
//   const { shopMail, shopPassword } = req.body;
//   console.log(shopMail, shopPassword)
//   if (!shopMail || !shopPassword)
//     return res.status(400).json({ error: "Please fill all the fields" });
//   console.log("Eikhane asche");

//   // Authenticate the eamil is a user
//   const query = `SELECT * FROM SHOP WHERE SHOP_MAIL = :shopMail`;
//   const params = { shopMail };
//   const user = await run_query(query, params);
//   if (user.length === 0) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   // Authenticate the password
//   if (user[0][8] !== shopPassword) {
//     return res.status(401).json({ error: "Invalid password" });
//   } else {
//     // i need to send all user data without password to the client
//     const userInfo = {
//       ShopId: user[0][0],
//       shopName: user[0][1],
//       shopMail: user[0][2],
//       shopPhone: user[0][3],
//       shopDistrict: user[0][4],
//       shopArea: user[0][5],
//       shopRoadNum: user[0][6],
//       shopLicense: user[0][7],
//     };
//     console.log("Eikhane asche");
//     console.log(userInfo);
//     res.status(200).json(userInfo);
//   }
// });



// -------------------------------------------------------- Shop Owner Login Route --------------------------------------------------------
// Shop owner Login route
router.post("/shopsignin", async (req, res) => {
  const { shopMail, shopPassword } = req.body;

  if (!shopMail || !shopPassword)
    return res.status(402).json({ error: "Please fill all the fields" });

  //Authenticate the eamil is a user
  const query = `SELECT * FROM SHOP WHERE SHOP_MAIL = :shopMail`;
  const params = { shopMail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  console.log(user);
  //Authenticate the password
  if (user[0][8] !== shopPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      ShopId: user[0][0],
      shopName: user[0][1],
      shopMail: user[0][2],
      shopPhone: user[0][3],
      shopDistrict: user[0][4],
      shopArea: user[0][5],
      shopRoadNum: user[0][6],
      shopGender: user[0][7],
      shopLicense: user[0][8],
      timeSlot: user[0][9],
      experience: user[0][10],
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});










//-------------------------------------------------------------------------------------------------------------------------------------------

// Hospital Manager Signup route
router.post("/hospitalsignup", async (req, res) => {
  const {
    hospitalName,
    hospitalMail,
    hospitalPhone,
    hospitalDistrict,
    hospitalArea,
    hospitalRoadNum,
    hospitalLicense,
    hospitalPassword,
  } = req.body;

  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM HOSPITAL_MANAGER WHERE HOSPITAL_MAIL = :hospitalMail`;
  const checkEmailParams = { hospitalMail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "User already exists" });
  }

  //Insert the user into the database
  const query = `INSERT INTO HOSPITAL_MANAGER (HOSPITAL_NAME, HOSPITAL_MAIL, HOSPITAL_PHONE, HOSPITAL_DISTRICT, HOSPITAL_AREA, HOSPITAL_ROADNUMBER, HOSPITAL_LICENSE, HOSPITAL_PASSWORD) 
                 VALUES (:hospitalName, :hospitalMail, :hospitalPhone, :hospitalDistrict, :hospitalArea, :hospitalRoadNum, :hospitalLicense, :hospitalPassword)`;
  
  const params = {
    hospitalName,
    hospitalMail,
    hospitalPhone,
    hospitalDistrict,
    hospitalArea,
    hospitalRoadNum,
    hospitalLicense,
    hospitalPassword,
  };

  try {
    await run_query(query, params);
    res.status(200).json({
      msg: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error creating user" });
  }
});
  
// Hospital Manager Login route
router.post("/hospitalsignin", async (req, res) => {
  const { hospitalMail, hospitalPassword } = req.body;

  if (!hospitalMail || !hospitalPassword)
    return res.status(400).json({ error: "Please fill all the fields" });

  //Authenticate the eamil is a user
  const query = `SELECT * FROM HOSPITAL_MANAGER WHERE HOSPITAL_MAIL = :hospitalMail`;
  const params = { hospitalMail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  //Authenticate the password
  if (user[0][7] !== hospitalPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      HospitalId: user[0][0],
      hospitalName: user[0][1],
      hospitalMail: user[0][2],
      hospitalPhone: user[0][3],
      hospitalDistrict: user[0][4],
      hospitalArea: user[0][5],
      hospitalRoadNum: user[0][6],
      hospitalLicense: user[0][7],
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});   

export default router;
