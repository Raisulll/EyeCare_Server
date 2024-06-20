import express from "express";
import nodemailer from "nodemailer";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
};

// Send an email to the user with the OTP
const sendEmail = (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "EyeCare",
      address: process.env.EMAIL,
    },
    to: to,
    subject: "Password Reset",
    text: `Your OTP is ${otp}`,
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  sendMail(transporter, mailOptions);
};

router.post("/resetpassword", async (req, res) => {
  const { userType, email } = req.body;
  console.log("Received reset password request for:", userType, email);

  if (userType === "patient") {
    try {
      // Check if the email exists in the database
      const query = `SELECT * FROM PATIENT WHERE PATIENT_MAIL = :email`;
      const result = await run_query(query, { email });
      console.log("Database query result:", result);

      if (result.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Generate an OTP
      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      // Store the OTP in the database first check if the otp already exists in the database if exists update the otp else insert the otp
      const otpQuery = `SELECT OTP_MAIL FROM OTP WHERE OTP_MAIL = :email`;
      const otpResult = await run_query(otpQuery, { email });
      console.log("Database query result:", otpResult);

      if (otpResult.length === 0) {
        const insertQuery = `INSERT INTO OTP (OTP_MAIL, OTP_CODE) VALUES (:email, :otp)`;
        await run_query(insertQuery, { email, otp });
      } else {
        const updateQuery = `UPDATE OTP SET OTP_CODE = :otp WHERE OTP_MAIL = :email`;
        await run_query(updateQuery, { email, otp });
      }

      // Send the OTP to the user's email
      sendEmail(email, otp);
      console.log("OTP sent to email");

      // return a success response and user email as response
      return res.status(200).json({ email });
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    console.log("Invalid user type:", userType);
    return res.status(400).json({ message: "Invalid user type" });
  }
});

router.post("/verifyotp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("Received OTP verification request for:", email, otp);

  try {
    // Check if the OTP exists in the database
    const query = `SELECT * FROM OTP WHERE OTP_MAIL = :email AND OTP_CODE = :otp`;
    const result = await run_query(query, { email, otp });
    console.log("Database query result:", result);

    if (result.length === 0) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    // return a success response
    console.log("OTP verified successfully");
    // return a success response and user email as response
    return res.status(200).json({ email });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/updatepass", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received password update request for:", email);

  try {
    // Update the password in the database
    const query = `UPDATE PATIENT SET PATIENT_PASSWORD = :password WHERE PATIENT_MAIL = :email`;
    await run_query(query, { email, password });
    console.log("Password updated successfully");

    // Delete the OTP from the database
    const deleteQuery = `DELETE FROM OTP WHERE OTP_MAIL = :email`;
    await run_query(deleteQuery, { email });
    console.log("OTP deleted successfully");

    // return a success response
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
