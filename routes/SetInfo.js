import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

//set information in prescription
router.post("/setprescription", async (req, res) => {
  const {
    appointmentId,
    patientIssue,
    medicine,
    glassDetails,
    surgeryDetails,
  } = req.body;

  try {
    let query = `
      INSERT INTO PRESCRIPTION(
        PRESCRIPTION_DATE,  
        APPOINTMENT_ID,
        PATIENT_ISSUE,
        MEDICINE,
        GLASS,
        SURGERY
      ) VALUES (
        (SELECT APPOINTMENT_DATE FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        :appointmentId,
        :patientIssue,
        :medicine,
        :glassDetails,
        :surgeryDetails
      )`;

    let params = {
      appointmentId,
      patientIssue,
      medicine,
      glassDetails,
      surgeryDetails,
    };

    await run_query(query, params);

    // Updating appointment status
    try {
      const query = `
    UPDATE APPOINTMENT 
    SET 
      APPOINTMENT_STATUS = 'Completed', 
      PRESCRIPTION_ID = (
        SELECT PRESCRIPTION_ID 
        FROM PRESCRIPTION 
        WHERE APPOINTMENT_ID = :appointmentId
      )
    WHERE APPOINTMENT_ID = :appointmentId
  `;
      await run_query(query, { appointmentId });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      return res
        .status(500)
        .json({ error: "Failed to update appointment status" });
    }

    // Inserting into TRANSACTION
    try {
      query = `INSERT INTO TRANSACTION (
        TRANSACTION_DATE,
        TRANSACTION_AMOUNT,
        PATIENT_ID,
        DOCTOR_ID,
        PAYMENT_TO
      ) VALUES (
        (SELECT APPOINTMENT_DATE FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        (SELECT DOCTOR_PAYMENT FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId)),
        (SELECT PATIENT_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        (SELECT DOCTOR_NAME FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId))
      )`;
      await run_query(query, { appointmentId });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return res.status(500).json({ error: "Failed to update transaction" });
    }

    // If everything is successful
    res.status(200).json({ message: "Prescription set successfully" });
  } catch (error) {
    console.error("Error setting prescription:", error);
    res.status(500).json({ error: "Failed to set prescription" });
  }
});

// add product
router.post("/addproduct", async (req, res) => {
  const {
    shopId,
    productId,
    quantity
  } = req.body;
  console.log(shopId, productId, quantity);
  try {
    const query = `
      SELECT * FROM INVENTORY
      WHERE SHOP_ID=:shopId AND 
      PRODUCT_ID=:productId`
    const params = {
      shopId,
      productId
    }
    const result = await run_query(query, params);
    console.log(result);
    if (result.length > 0) {
      const query = `
        UPDATE INVENTORY
        SET QUANTITY = QUANTITY + :quantity
        WHERE SHOP_ID=:shopId AND 
        PRODUCT_ID=:productId`
      const params = {
        shopId,
        productId,
        quantity
      }
      await run_query(query, params);
    } else {
      const query = `
        INSERT INTO INVENTORY(SHOP_ID, PRODUCT_ID, QUANTITY)
        VALUES(:shopId, :productId, :quantity)`
      const params = {
        shopId,
        productId,
        quantity
      }
      await run_query(query, params);
    }
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) { 
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
})

export default router;
