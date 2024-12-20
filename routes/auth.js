import express from "express";
import supabase from "../db/SupabaseClient.js";

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

  try {
    // Check if email already exists
    const { data: existingEmail, error: emailError } = await supabase
      .from("patient")
      .select("*")
      .eq("patient_mail", patientEmail);

    if (emailError) {
      console.error("Error checking email", emailError);
      return res.status(500).json({ error: "Error checking email" });
    }

    if (existingEmail && existingEmail.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Insert the user into the database
    const { data: insertData, error: insertError } = await supabase
      .from("patient")
      .insert([
        {
          patient_name: patientName,
          patient_mail: patientEmail,
          patient_phone: patientPhone,
          patient_dob: patientDob,
          patient_gender: patientGender,
          patient_password: patientPassword,
          patient_address:{
            patientDistrict,
            patientArea,
            patientRoadNum,
          },
        },
      ]);

    if (insertError) {
      console.error("Error creating user", insertError);
      return res.status(400).json({ error: "Error creating user" });
    }

    res
      .status(200)
      .json({ msg: "User created successfully", data: insertData });
  } catch (err) {
    console.error("Internal server error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Patient Login route
router.post("/login", async (req, res) => {
  const { patientEmail, patientPassword } = req.body;

  if (!patientEmail || !patientPassword) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    // Fetch user
    const { data: users, error: userError } = await supabase
      .from("patient")
      .select("*")
      .eq("patient_mail", patientEmail);

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Error during login." });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    //Authenticate the password
    if (user.patient_password !== patientPassword) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      // i need to send all user data without password to the client
      let userInfo = {
        patientId: user.patient_id,
        patientImage: user.patient_image,
        usertype: "patient",
      };
      if (patientEmail === "admin@test.com") {
        userInfo.usertype = "admin";
      }
      console.log(userInfo);
      res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
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

  try {
    //Authenticate the user is already exists
    const { data: emailExists, error: emailError } = await supabase
      .from("doctor")
      .select("*")
      .eq("doctor_mail", doctorEmail);

    if (emailError) {
      console.error("Error checking email", emailError);
      return res.status(500).json({ error: "Error checking email" });
    }
    if (emailExists && emailExists.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Insert the user into the database
    const { data: insertData, error: insertError } = await supabase
      .from("doctor")
      .insert([
        {
          doctor_name: doctorName,
          doctor_mail: doctorEmail,
          doctor_phone: doctorPhone,
          doctor_district: doctorDistrict,
          doctor_area: doctorArea,
          doctor_roadnumber: doctorRoadNum,
          doctor_gender: doctorGender,
          doctor_password: doctorPassword,
          doctor_license: doctorLicense,
          doctor_timeslot: timeSlot,
          doctor_speciality: experience,
        },
      ]);

    if (insertError) {
      console.error("Error creating user", insertError);
      return res.status(400).json({ error: "Error creating user" });
    }

    res.status(200).json({
      msg: "User createdf successfully",
      data: insertData,
    });
  } catch (err) {
    console.error("Internal server error", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Doctor Login route
router.post("/doctorsignin", async (req, res) => {
  const { doctorEmail, doctorPassword } = req.body;

  if (!doctorEmail || !doctorPassword) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    // Fetch user
    const { data: users, error: userError } = await supabase
      .from("doctor")
      .select("*")
      .eq("doctor_mail", doctorEmail);

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Error during login." });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    //Authenticate the password
    if (user.doctor_password !== doctorPassword) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      // i need to send all user data without password to the client
      const userInfo = {
        doctorId: user.doctor_id,
        patientImage: user.doctor_image,
        usertype: "doctor",
      };
      console.log(userInfo);
      res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
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
  try {
    //Authenticate the user is already exists
    const { data: emailExists, error: emailError } = await supabase
      .from("shop")
      .select("*")
      .eq("shop_mail", shopMail);

    if (emailError) {
      console.error("Error checking email", emailError);
      return res.status(500).json({ error: "Error checking email" });
    }

    if (emailExists && emailExists.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Insert the user into the database
    const { data: insertData, error: insertError } = await supabase
      .from("shop")
      .insert([
        {
          shop_name: shopName,
          shop_mail: shopMail,
          shop_phone: shopPhone,
          shop_district: shopDistrict,
          shop_area: shopArea,
          shop_roadnumber: shopRoadNum,
          shop_license: shopLicense,
          shop_password: shopPassword,
        },
      ]);
    if (insertError) {
      console.error("Error creating user", insertError);
      return res.status(400).json({ error: "Error creating user" });
    }
    res
      .status(200)
      .json({ msg: "User created successfully", data: insertData });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------------------------------------- Shop Owner Login Route --------------------------------------------------------
// Shop owner Login route
router.post("/shopsignin", async (req, res) => {
  const { shopMail, shopPassword } = req.body;

  if (!shopMail || !shopPassword) {
    return res.status(402).json({ error: "Please fill all the fields" });
  }
  try {
    //Authenticate the email is a user
    const { data: users, error: userError } = await supabase
      .from("shop")
      .select("*")
      .eq("shop_mail", shopMail);

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Error during login." });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = users[0];
    //Authenticate the password
    if (user.shop_password !== shopPassword) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      // i need to send all user data without password to the client
      const userInfo = {
        shopId: user.shop_id,
        usertype: "shop",
      };
      console.log(userInfo);
      res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
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
  try {
    //Authenticate the user is already exists
    const { data: emailExists, error: emailError } = await supabase
      .from("hospital")
      .select("*")
      .eq("hospital_mail", hospitalMail);

    if (emailError) {
      console.error("Error checking email", emailError);
      return res.status(500).json({ error: "Error checking email" });
    }

    if (emailExists && emailExists.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Insert the user into the database
    const { data: insertData, error: insertError } = await supabase
      .from("hospital")
      .insert([
        {
          hospital_name: hospitalName,
          hospital_mail: hospitalMail,
          hospital_phone: hospitalPhone,
          hospital_district: hospitalDistrict,
          hospital_area: hospitalArea,
          hospital_roadnumber: hospitalRoadNum,
          hospital_license: hospitalLicense,
          hospital_password: hospitalPassword,
        },
      ]);
    if (insertError) {
      console.error("Error creating user", insertError);
      return res.status(400).json({ error: "Error creating user" });
    }
    res.status(200).json({
      msg: "User created successfully",
      data: insertData,
    });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Hospital Manager Login route
router.post("/hospitalsignin", async (req, res) => {
  const { hospitalMail, hospitalPassword } = req.body;

  if (!hospitalMail || !hospitalPassword) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    //Authenticate the email is a user
    const { data: users, error: userError } = await supabase
      .from("hospital")
      .select("*")
      .eq("hospital_mail", hospitalMail);
    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Error during login." });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    //Authenticate the password
    if (user.hospital_password !== hospitalPassword) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      // i need to send all user data without password to the client
      const userInfo = {
        hospitalId: user.hospital_id,
        usertype: "hospital",
      };
      console.log(userInfo);
      res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
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
  try {
    //Authenticate the user is already exists
    const { data: emailExists, error: emailError } = await supabase
      .from("delivery_agency")
      .select("*")
      .eq("delivery_agency_email", deliveryMail);
    if (emailError) {
      console.error("Error checking email", emailError);
      return res.status(500).json({ error: "Error checking email" });
    }
    if (emailExists && emailExists.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    //Insert the user into the database
    const { data: insertData, error: insertError } = await supabase
      .from("delivery_agency")
      .insert([
        {
          delivery_agency_name: deliveryName,
          delivery_agency_email: deliveryMail,
          delivery_agency_phone: deliveryPhone,
          delivery_agency_district: deliveryDistrict,
          delivery_agency_area: deliveryArea,
          delivery_agency_roadnumber: deliveryRoadNum,
          delivery_agency_license: deliveryLicense,
          delivery_agency_password: deliveryPassword,
          delivery_charge: deliveryCharge,
          delivery_agency_status: deliveryType,
        },
      ]);
    if (insertError) {
      console.error("Error creating user", insertError);
      return res.status(400).json({ error: "Error creating user" });
    }
    res.status(200).json({
      msg: "User created successfully",
      data: insertData,
    });
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delivery Agency Login route
router.post("/deliverysignin", async (req, res) => {
  const { deliveryMail, deliveryPassword } = req.body;
  if (!deliveryMail || !deliveryPassword) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }
  try {
    //Authenticate the eamil is a user
    const { data: users, error: userError } = await supabase
      .from("delivery_agency")
      .select("*")
      .eq("delivery_agency_email", deliveryMail);

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Error during login." });
    }
    if (users && users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    //Authenticate the password
    if (user.delivery_agency_password !== deliveryPassword) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      // i need to send all user data without password to the client
      const userInfo = {
        deliveryId: user.delivery_agency_id,
        usertype: "delivery",
      };
      console.log(userInfo);
      res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
