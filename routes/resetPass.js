import express from "express";
import nodemailer from "nodemailer";
import supabase from "../db/SupabaseClient.js";

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
      const { data: existingUser, error: userError } = await supabase
        .from("patient")
        .select("*")
        .eq("patient_mail", email);

      if (userError) {
        console.error("Error checking email:", userError);
        return res.status(500).json({ message: "Error checking email" });
      }

      if (!existingUser || existingUser.length === 0) {
        return res.status(404).json({ message: "Email not found" });
      }

      // Generate an OTP
      const otp = generateOTP();
      console.log("Generated OTP:", otp);

      // Store the OTP in the database first check if the otp already exists in the database if exists update the otp else insert the otp
      const { data: existingOTP, error: otpError } = await supabase
        .from("otp")
        .select("*")
        .eq("otp_mail", email);

      if (otpError) {
        console.error("Error checking OTP:", otpError);
        return res.status(500).json({ message: "Error checking OTP" });
      }
      if (!existingOTP || existingOTP.length === 0) {
        const { error: insertError } = await supabase
          .from("otp")
          .insert([{ otp_mail: email, otp_code: otp }]);
        if (insertError) {
          console.error("Error inserting OTP:", insertError);
          return res.status(500).json({ message: "Error inserting OTP" });
        }
      } else {
        const { error: updateError } = await supabase
          .from("otp")
          .update({ otp_code: otp })
          .eq("otp_mail", email);
        if (updateError) {
          console.error("Error updating OTP:", updateError);
          return res.status(500).json({ message: "Error updating OTP" });
        }
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
    const { data, error } = await supabase
      .from("otp")
      .select("*")
      .eq("otp_mail", email)
      .eq("otp_code", otp);

    if (error) {
      console.error("Error checking OTP:", error);
      return res.status(500).json({ message: "Error checking OTP" });
    }

    if (!data || data.length === 0) {
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
    const { error: updateError } = await supabase
      .from("patient")
      .update({ patient_password: password })
      .eq("patient_mail", email);
    if (updateError) {
      console.error("Error updating password:", updateError);
      return res.status(500).json({ message: "Error updating password" });
    }
    // Delete the OTP from the database
    const { error: deleteError } = await supabase
      .from("otp")
      .delete()
      .eq("otp_mail", email);
    if (deleteError) {
      console.error("Error deleting OTP:", deleteError);
      return res.status(500).json({ message: "Error deleting OTP" });
    }
    console.log("Password updated successfully");
    console.log("OTP deleted successfully");

    // return a success response
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
