//fetch info for doctor profile

import express from "express";
import { run_query } from "../db/connectiondb.js";

const router = express.Router();

// fetch doctor data
router.get("/doctordata", async (req, res) => {
  const doctorId = req.query.doctorId;
  try {
    const doctorData = await run_query(
      `SELECT DOCTOR_NAME, DOCTOR_MAIL, DOCTOR_PHONE, DOCTOR_DISTRICT, DOCTOR_AREA, DOCTOR_ROADNUMBER, DOCTOR_IMAGE, DOCTOR_SPECIALITY,DOCTOR_PAYMENT,
      DOCTOR_TIMESLOT,HOSPITAL_NAME
      FROM DOCTOR D, HOSPITAL H
      WHERE
      DOCTOR_ID=${doctorId} AND
      D.HOSPITAL_ID = H.HOSPITAL_ID`,
      {}
    );
    console.log(doctorData);
    res.status(200).json(doctorData[0]);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch patient data
router.get("/patientdata", async (req, res) => {
  const patientId = req.query.patientid;
  // console.log(patientId);
  try {
    const patientData = await run_query(
      `SELECT * FROM PATIENT WHERE PATIENT_ID=${patientId}`,
      {}
    );
    // console.log(patientData);
    res.status(200).json(patientData[0]);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch appointment info
router.get("/appointmentinfo", async (req, res) => {
  const appointmentId = req.query.appointmentId;
  // console.log(appointmentId);
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
    // console.log(appointmentInfo);
    res.status(200).json(appointmentInfo[0]);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch doctor transaction for a specific doctor

router.get("/senddoctortransactions", async (req, res) => {
  const doctorId = req.query.doctorId;
  // console.log(doctorId);
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
    // console.log("All okay", transaction);
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch patient transaction for a specific patient
router.get("/sendpatienttransactions", async (req, res) => {
  const patientId = req.query.patientId;
  // console.log(patientId);
  try {
    const transaction = await run_query(
      `
      SELECT PAYMENT_TO, TRANSACTION_FOR, TRANSACTION_DATE, TRANSACTION_AMOUNT
      FROM TRANSACTION
      WHERE PATIENT_ID=${patientId}
      `,
      {}
    );
    // console.log("All okay", transaction);
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch hospital info
router.get("/hospitaldata", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  // console.log("Hospital Id",hospitalId);
  try {
    const hospitalData = await run_query(
      `SELECT * FROM HOSPITAL WHERE HOSPITAL_ID=${hospitalId}`,
      {}
    );
    // console.log(hospitalData);
    res.status(200).json(hospitalData[0]);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch schedule for a specific hospital
router.get("/hospitalSchedule", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  // console.log(hospitalId);
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
    // console.log("All okay", schedule);
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
    const prescriptioninfo = await run_query(
      `SELECT * FROM PRESCRIPTION WHERE APPOINTMENT_ID=${appointmentId}`,
      {}
    );
    // console.log(prescriptioninfo);
    res.status(200).json(prescriptioninfo[0]);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
});

//fetch shop data
router.get("/shopdata", async (req, res) => {
  const shopId = req.query.shopid;
  // console.log(shopId);
  try {
    const shopData = await run_query(
      `SELECT * FROM SHOP WHERE SHOP_ID=${shopId}`,
      {}
    );
    // console.log(shopData);
    res.status(200).json(shopData[0]);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch all products
router.get("/allproducts", async (req, res) => {
  try {
    const allProducts = await run_query(`SELECT * FROM SUPPLY`, {});
    // console.log(allProducts);
    res.status(200).json(allProducts);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch products
router.get("/products", async (req, res) => {
  console.log("eikhane asche");
  // fetch all products from INVENTORY
  const userId = req.query.userId;
  try {
    const products = await run_query(
      `SELECT I.PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_IMAGE,QUANTITY, SH.SHOP_ID, SH.SHOP_NAME
      FROM SUPPLY S, INVENTORY I, SHOP SH
      WHERE
      I.SHOP_ID = SH.SHOP_ID AND
      S.PRODUCT_ID = I.PRODUCT_ID AND
      QUANTITY > 0`,
      {}
    );
    // console.log(products);1
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//search products
router.get("/productsearch", async (req, res) => {
  const search = req.query.search;
  console.log(search);
  try {
    const products = await run_query(
      `SELECT I.PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_IMAGE,QUANTITY, SH.SHOP_ID, SH.SHOP_NAME
      FROM SUPPLY S, INVENTORY I, SHOP SH
      WHERE
      I.SHOP_ID = SH.SHOP_ID AND
      S.PRODUCT_ID = I.PRODUCT_ID AND
      QUANTITY > 0 AND
      LOWER(PRODUCT_NAME) LIKE '%${search}%'`,
      {}
    );
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch cart items
router.get("/cartitems", async (req, res) => {
  const patientId = req.query.patientId;
  console.log(patientId);
  try {
    const cartItems = await run_query(
      `SELECT PRODUCT_NAME, PRODUCT_PRICE,C.PRODUCT_ID, QUANTITY, CART_QUANTITY,PRODUCT_IMAGE, SHOP_NAME, SH.SHOP_ID
      FROM CART C, SUPPLY S, INVENTORY I, SHOP SH
      WHERE
      C.PRODUCT_ID = S.PRODUCT_ID AND
      S.PRODUCT_ID = I.PRODUCT_ID AND
      C.SHOP_ID = I.SHOP_ID AND
      C.SHOP_ID = SH.SHOP_ID AND
      C.PATIENT_ID=${patientId}`,
      {}
    );
    // console.log(cartItems);
    res.status(200).json(cartItems);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch all delivery agency informatio
router.get("/deliveryagency", async (req, res) => {
  try {
    const deliveryagency = `SELECT DELIVERY_AGENCY_ID, DELIVERY_AGENCY_NAME, DELIVERY_AGENCY_STATUS,DELIVERY_CHARGE FROM DELIVERY_AGENCY`;
    const deliveryagencyInfo = await run_query(deliveryagency, {});
    // console.log(deliveryagencyInfo);
    res.status(200).json(deliveryagencyInfo);
  } catch (error) {
    console.error("Error fetching delivery agency:", error);
    res.status(500).json({ error: "Failed to fetch delivery agency" });
  }
});

// fetch all orders which are not delivered
router.get("/orders", async (req, res) => {
  const shopId = req.query.shopId;
  try {
    const orders = await run_query(
      `SELECT
        O.ORDER_ID,
        PRODUCT_NAME,
        ORDER_QUANTITY,
        PATIENT_NAME,
        ORDER_DATE
      FROM
        ORDERS           O,
        ORDERED_PRODUCTS OP,
        SUPPLY           S,
        PATIENT          P
      WHERE
        O.ORDER_ID = OP.ORDER_ID
        AND OP.PRODUCT_ID = S.PRODUCT_ID
        AND O.PATIENT_ID = P.PATIENT_ID
        AND SHOP_ID = ${shopId}
        AND ORDER_STATUS = 'Pending'`,
      {}
    );
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// fetch delivery data
router.get("/deliverydata", async (req, res) => {
  const deliveryId = req.query.deliveryId;
  try {
    const deliverydata = await run_query(
      `SELECT * FROM  DELIVERY_AGENCY WHERE DELIVERY_AGENCY_ID=${deliveryId}`,
      {}
    );
    console.log(deliverydata);
    res.status(200).json(deliverydata);
  } catch (error) {
    console.error("Error fetching delivery data:", error);
    res.status(500).json({ error: "Failed to fetch delivery data" });
  }
});

// fetch all orders for a specific delivery agency
router.get("/ordersfordeliveryagency", async (req, res) => {
  const deliveryId = req.query.deliveryId;
  try {
    const orders = await run_query(
      `SELECT O.ORDER_ID,ORDER_STATUS, SHOP_NAME,PATIENT_NAME, ORDER_DATE, PATIENT_ROADNUMBER,PATIENT_AREA, PATIENT_DISTRICT, PATIENT_PHONE
      FROM ORDERS O, ORDERED_PRODUCTS OP, SHOP S, PATIENT P
      WHERE 
      O.ORDER_ID = OP.ORDER_ID AND
      OP.SHOP_ID = S.SHOP_ID AND
      O.DELIVERY_AGENCY_ID = ${deliveryId} AND
      O.PATIENT_ID = P.PATIENT_ID AND
      O.ORDER_STATUS = 'Accepted'
      `,
      {}
    );

    const uniqueOrders = [];
    const orderIds = new Set();
    orders.forEach((order) => {
      if (!orderIds.has(order.ORDER_ID)) {
        uniqueOrders.push(order);
        orderIds.add(order.ORDER_ID);
      }
    });
    console.log(uniqueOrders);
    res.status(200).json(uniqueOrders);
  } catch (error) {
    console.error("Error fetching orders for delivery agency:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch orders for delivery agency" });
  }
});



export default router;
