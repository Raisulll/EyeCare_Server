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

  console.log(req.body);

  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM PATIENT WHERE PATIENT_MAIL = :patientEmail`;
  const checkEmailParams = { patientEmail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "Email already exists" });
  }

  //Insert the user into the database
  const query = `
  INSERT INTO PATIENT 
  (PATIENT_NAME, PATIENT_MAIL, PATIENT_PHONE, PATIENT_DOB, PATIENT_GENDER, PATIENT_PASSWORD, PATIENT_ADDRESS)
  VALUES (
    :patientName, 
    :patientEmail, 
    :patientPhone, 
    TO_DATE(:patientDob, 'YYYY-MM-DD'), 
    :patientGender, 
    :patientPassword, 
    address_type(:patientDistrict, :patientRoadNum, :patientArea)  -- Using the object type for address
  )
`;

  const params = {
    patientName,
    patientEmail,
    patientPhone,
    patientDob,
    patientDistrict,
    patientRoadNum,
    patientArea,
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
  console.log("Logisdf", req.body);

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
  if (user[0].PATIENT_PASSWORD !== patientPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    let userInfo = {
      PatientId: user[0].PATIENT_ID,
      patientImage: user[0].PATIENT_IMAGE,
      usertype: "patient",
    };
    if (patientEmail === "admin@test.com") {
      userInfo.usertype = "admin";
    }
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

  // console.log(user);
  //Authenticate the password
  console.log(user[0].DOCTOR_PASSWORD);
  // console.log(doctorPassword);
  if (user[0].DOCTOR_PASSWORD !== doctorPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      doctorId: user[0].DOCTOR_ID,
      patientImage: user[0].DOCTOR_IMAGE,
      usertype: "doctor",
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
  if (user[0].SHOP_PASSWORD !== shopPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      ShopId: user[0].SHOP_ID,
      usertype: "shop",
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});

//-----------------------------------------------------Hospital Manager Signup route-------------------------------------------------

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
  const checkEmail = `SELECT * FROM HOSPITAL WHERE HOSPITAL_MAIL = :hospitalMail`;
  const checkEmailParams = { hospitalMail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "User already exists" });
  }

  //Insert the user into the database
  const query = `INSERT INTO HOSPITAL (HOSPITAL_NAME, HOSPITAL_MAIL, HOSPITAL_PHONE, HOSPITAL_DISTRICT, HOSPITAL_AREA, HOSPITAL_ROADNUMBER, HOSPITAL_LICENSE, HOSPITAL_PASSWORD) 
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

  console.log("eikhane", req.body);
  //Authenticate the eamil is a user
  const query = `SELECT * FROM HOSPITAL WHERE HOSPITAL_MAIL = :hospitalMail`;
  const params = { hospitalMail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  //Authenticate the password
  if (user[0].HOSPITAL_PASSWORD !== hospitalPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      HospitalId: user[0].HOSPITAL_ID,
      usertype: "hospital",
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});

// Delivery Agency Signup route
router.post("/deliverysignup", async (req, res) => {
  const {
    deliveryName,
    deliveryMail,
    deliveryPhone,
    deliveryDistrict,
    deliveryArea,
    deliveryRoadNum,
    deliveryLicense,
    deliveryPassword,
    deliveryCharge,
    deliveryType,
  } = req.body;

  console.log(req.body);
  //Authenticate the user is already exists
  const checkEmail = `SELECT * FROM DELIVERY_AGENCY WHERE DELIVERY_AGENCY_EMAIL = :deliveryMail`;
  const checkEmailParams = { deliveryMail };
  const emailExists = await run_query(checkEmail, checkEmailParams);
  if (emailExists.length > 0) {
    return res.status(409).json({ error: "User already exists" });
  }

  //Insert the user into the database
  const query = `INSERT INTO DELIVERY_AGENCY (DELIVERY_AGENCY_NAME, DELIVERY_AGENCY_EMAIL, DELIVERY_AGENCY_PHONE, DELIVERY_AGENCY_DISTRICT, DELIVERY_AGENCY_AREA, DELIVERY_AGENCY_ROADNUMBER, DELIVERY_AGENCY_LICENSE, DELIVERY_AGENCY_PASSWORD, DELIVERY_CHARGE, DELIVERY_AGENCY_STATUS) 
                 VALUES (:deliveryName, :deliveryMail, :deliveryPhone, :deliveryDistrict, :deliveryArea, :deliveryRoadNum, :deliveryLicense, :deliveryPassword, :deliveryCharge, :deliveryType)`;

  const params = {
    deliveryName,
    deliveryMail,
    deliveryPhone,
    deliveryDistrict,
    deliveryArea,
    deliveryRoadNum,
    deliveryLicense,
    deliveryPassword,
    deliveryCharge,
    deliveryType,
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

// Delivery Agency Login route
router.post("/deliverysignin", async (req, res) => {
  const { deliveryMail, deliveryPassword } = req.body;

  if (!deliveryMail || !deliveryPassword)
    return res.status(400).json({ error: "Please fill all the fields" });

  //Authenticate the eamil is a user
  const query = `SELECT * FROM DELIVERY_AGENCY WHERE DELIVERY_AGENCY_EMAIL = :deliveryMail`;
  const params = { deliveryMail };
  const user = await run_query(query, params);
  if (user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }

  //Authenticate the password
  if (user[0].DELIVERY_AGENCY_PASSWORD !== deliveryPassword) {
    return res.status(401).json({ error: "Invalid password" });
  } else {
    // i need to send all user data without password to the client
    const userInfo = {
      deliveryId: user[0].DELIVERY_AGENCY_ID,
      usertype: "delivery",
    };
    console.log(userInfo);
    res.status(200).json(userInfo);
  }
});

export default router;
