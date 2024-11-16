import express from "express";
import cloudinary from "../cloudenary.js";
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
  const { shopId, productId, quantity } = req.body;
  console.log(shopId, productId, quantity);
  try {
    const query = `
      SELECT * FROM INVENTORY
      WHERE SHOP_ID=:shopId AND 
      PRODUCT_ID=:productId`;
    const params = {
      shopId,
      productId,
    };
    const result = await run_query(query, params);
    console.log(result);
    if (result.length > 0) {
      const query = `
        UPDATE INVENTORY
        SET QUANTITY = QUANTITY + :quantity
        WHERE SHOP_ID=:shopId AND 
        PRODUCT_ID=:productId`;
      const params = {
        shopId,
        productId,
        quantity,
      };
      await run_query(query, params);
    } else {
      const query = `
        INSERT INTO INVENTORY(SHOP_ID, PRODUCT_ID, QUANTITY)
        VALUES(:shopId, :productId, :quantity)`;
      const params = {
        shopId,
        productId,
        quantity,
      };
      await run_query(query, params);
    }
    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// add product to cart
router.post("/addtocart", async (req, res) => {
  const { userId, productId, shopId, cartQuantity } = req.body;
  console.log(userId, productId, shopId, cartQuantity);
  try {
    let query = `
      SELECT * FROM CART 
      WHERE PATIENT_ID=:userId AND
      PRODUCT_ID=:productId AND SHOP_ID=:shopId`;
    let params = {
      userId,
      productId,
      shopId,
    };
    const result = await run_query(query, params);
    console.log(result);
    if (result.length > 0) {
      query = `
        UPDATE CART
        SET CART_QUANTITY = CART_QUANTITY + 1
        WHERE PATIENT_ID=:userId AND
        PRODUCT_ID=:productId AND
        SHOP_ID=:shopId`;
      params = {
        userId,
        productId,
        shopId,
      };
      await run_query(query, params);
    } else {
      query = `
        INSERT INTO CART(PATIENT_ID, PRODUCT_ID, SHOP_ID, CART_QUANTITY)
        VALUES(:userId, :productId, :shopId, :cartQuantity)`;
      params = {
        userId,
        productId,
        shopId,
        cartQuantity,
      };
      await run_query(query, params);
    }
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (eror) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

// update cart quantity
router.post("/updatecartquantity", async (req, res) => {
  const { productId, quantity, patientId, shopId } = req.body;
  console.log("server", productId, quantity, patientId);
  try {
    const query = `
      UPDATE CART
      SET CART_QUANTITY = :quantity
      WHERE PRODUCT_ID=:productId AND
      PATIENT_ID=:patientId AND
      SHOP_ID=:shopId`;
    const params = {
      productId,
      quantity,
      patientId,
      shopId,
    };
    await run_query(query, params);
    res.status(200).json({ message: "Cart quantity updated successfully" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
});

// remove from cart
router.post("/removefromcart", async (req, res) => {
  const { productId, patientId, shopId } = req.body;
  console.log("server", productId, patientId);
  try {
    const query = `
      DELETE FROM CART
      WHERE PRODUCT_ID=:productId AND
      PATIENT_ID=:patientId AND
      SHOP_ID=:shopId`;
    const params = {
      productId,
      patientId,
      shopId,
    };
    await run_query(query, params);
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

// place order

router.post("/placeorder", async (req, res) => {
  const { patientId, deliveryAgencyId, amount } = req.body;
  console.log("data", patientId, deliveryAgencyId, amount);

  // Inserting into ORDERS
  try {
    let query = `INSERT INTO ORDERS( PATIENT_ID,
    DELIVERY_AGENCY_ID,ORDER_TOTAL) VALUES(:patientId, :deliveryAgencyId, :amount)`;
    let params = {
      patientId,
      deliveryAgencyId,
      amount,
    };
    await run_query(query, params);
  } catch (error) {
    console.error("Error inserting into ORDERS:", error);
    return res.status(500).json({ error: "Failed to insert into ORDERS" });
  }

  try {
    const productfromcart = await run_query(
      `SELECT PRODUCT_ID, SHOP_ID, CART_QUANTITY FROM CART WHERE PATIENT_ID=${patientId}`,
      {}
    );
    // console.log(productfromcart);
    for (let i = 0; i < productfromcart.length; i++) {
      const product = productfromcart[i];
      console.log("product", product);
      // Inserting into ORDERED_PRODUCTS
      try {
        let query = `
      INSERT INTO ORDERED_PRODUCTS(
        ORDER_ID,
        PRODUCT_ID,
        SHOP_ID,
        ORDER_QUANTITY,
        ORDER_PRICE)
        VALUES(
        (SELECT MAX(ORDER_ID) FROM ORDERS),
        :productId, :shopId, :orderQuantity, (SELECT PRODUCT_PRICE FROM SUPPLY WHERE PRODUCT_ID = :productId)*:orderQuantity)`;
        let params = {
          productId: product.PRODUCT_ID,
          shopId: product.SHOP_ID,
          orderQuantity: product.CART_QUANTITY,
        };
        await run_query(query, params);
      } catch (error) {
        console.error("Error inserting into ORDERED_PRODUCTS:", error);
        return res
          .status(500)
          .json({ error: "Failed to insert into ORDERED_PRODUCTS" });
      }

      // Updating inventory
      try {
        const query = `
        UPDATE INVENTORY
        SET QUANTITY = QUANTITY - :quantity
        WHERE PRODUCT_ID=:productId AND
        SHOP_ID=:shopId`;
        const params = {
          productId: product.PRODUCT_ID,
          shopId: product.SHOP_ID,
          quantity: product.CART_QUANTITY,
        };
        await run_query(query, params);
      } catch (error) {
        console.error("Error updating inventory:", error);
        return res.status(500).json({ error: "Failed to update inventory" });
      }
    }

    // Deleting from CART
    try {
      const query = `DELETE FROM CART WHERE PATIENT_ID=:patientId`;
      const params = {
        patientId,
      };
      await run_query(query, params);
    } catch (error) {
      console.error("Error deleting from CART:", error);
      return res.status(500).json({ error: "Failed to delete from CART" });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// accept order
router.post("/acceptorder", async (req, res) => {
  const { orderId } = req.body;
  console.log("server", orderId);
  try {
    const query = `
      UPDATE ORDERS
      SET ORDER_STATUS = 'Accepted'
      WHERE ORDER_ID=:orderId`;
    const params = {
      orderId,
    };
    await run_query(query, params);
    res.status(200).json({ message: "Order accepted successfully" });
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ error: "Failed to accept order" });
  }
});

// add product to supply
router.post("/productstosupply", async (req, res) => {
  const { productName, productPrice, productDescription, productImage } =
    req.body;
  console.log("Proudct name", productName);
  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(productImage, {
      folder: "EyeCare",
      unique_filename: true,
      timeout: 60000,
      transformation: [
        {
          width: 800,
          height: 600,
          crop: "limit",
        },
      ],
    });
    console.log(cloudinaryResponse);
    const query = await run_query(
      `INSERT INTO SUPPLY
      (PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_DESCRIPTION, PRODUCT_IMAGE)
      VALUES(:productName, :productPrice, :productDescription, :productImage)`,
      {
        productName,
        productPrice,
        productDescription,
        productImage: cloudinaryResponse.secure_url,
      }
    );
    res.status(200).json({
      message: "Product added successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// delivery confirmed
router.post("/done", async (req, res) => {
  const orderId = req.body.orderId;
  console.log("server", orderId);
  try {
    let query = `
    UPDATE ORDERS
    SET ORDER_STATUS = 'Delivered'
    WHERE ORDER_ID=:orderId`;
    const params = {
      orderId,
    };
    await run_query(query, params);

    // fixing transaction for delivery
    query = `INSERT INTO TRANSACTION(TRANSACTION_DATE, TRANSACTION_AMOUNT, PATIENT_ID, DELIVERY_AGENCY_ID, PAYMENT_TO)
    VALUES(SELECT ORDER_DATE FROM ORDERS WHERE ORDER_ID = :orderId, SELECT DELIVERY_CHARGE FROM DELIVERY_AGENCY WHERE DELIVERY_AGENCY_ID = (SELECT DELIVERY_AGENCY_ID FROM ORDERS WHERE ORDER_ID = :orderId), SELECT PATIENT_ID FROM ORDERS WHERE ORDER_ID = :orderId, SELECT DELIVERY_AGENCY_ID FROM ORDERS WHERE ORDER_ID = :orderId, SELECT DELIVERY_AGENCY_NAME FROM DELIVERY_AGENCY WHERE DELIVERY_AGENCY_ID = (SELECT DELIVERY_AGENCY_ID FROM ORDERS WHERE ORDER_ID = :orderId))`;
    await run_query(query, { orderId });

    //fix transaction for shop
    // query = `INSERT INTO TRANSACTION(TRANSACTION_DATE, TRANSACTION_AMOUNT, PATIENT_ID, SHOP_ID, PAYMENT_TO)
    //   VALUES(SELECT ORDER_DATE FROM ORDERS WHERE ORDER_ID = :orderId,
    //   SELECT)`
    res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    console.error("Error delivering order:", error);
    res.status(500).json({ error: "Failed to deliver order" });
  }
});

router.post("/updatehospital", async (req, res) => {
  const { hospitalId, hospitalName, hospitalDistrict, hospitalArea, hospitalRoadnumber, hospitalPhone, hospitalEmail } = req.body;
  console.log("server", hospitalRoadnumber);
  try {
    const query = `
      UPDATE HOSPITAL
      SET HOSPITAL_NAME = :hospitalName,
      HOSPITAL_DISTRICT = :hospitalDistrict,
      HOSPITAL_AREA = :hospitalArea,
      HOSPITAL_ROADNUMBER = :hospitalRoadnumber,
      HOSPITAL_PHONE = :hospitalPhone,
      HOSPITAL_MAIL = :hospitalEmail
      WHERE HOSPITAL_ID = :hospitalId`;
    const params = {
      hospitalId,
      hospitalName,
      hospitalDistrict,
      hospitalArea,
      hospitalRoadnumber,
      hospitalPhone,
      hospitalEmail
    };
    await run_query(query, params);
    res.status(200).json({ message: "Hospital updated successfully" });
  } catch (error) {
    console.error("Error updating hospital:", error);
    res.status(500).json({ error: "Failed to update hospital" });
  }
});

router.post("/surgery", async (req, res) => {
  const {
    surgeryname,
    appointmentId,
    surgeryDate,
    surgeryTime,
    surgerystatus,
  } = req.body;

  // Log the incoming parameters
  console.log("Server received data:", {
    surgeryname,
    appointmentId,
    surgeryDate,
    surgeryTime,
    surgerystatus,
  });

  try {
    const query = `
      INSERT INTO SURGERY (
        SURGERY_ID,
        SURGERY_NAME,
        SURGERY_DATE,
        SURGERY_TIME,
        SURGERY_STATUS,
        PATIENT_ID,
        DOCTOR_ID,
        HOSPITAL_ID
      ) 
      VALUES (
        SURGERY_ID_SEQ.NEXTVAL,
        :surgeryname,
        TO_DATE(:surgeryDate, 'YYYY-MM-DD'),
        :surgeryTime,
        :surgerystatus,
        (SELECT PATIENT_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId),
        (SELECT HOSPITAL_ID FROM DOCTOR WHERE DOCTOR_ID = (SELECT DOCTOR_ID FROM APPOINTMENT WHERE APPOINTMENT_ID = :appointmentId))
      )`;

    const params = {
      surgeryname, // Binds the surgery name
      surgeryDate, // Binds the surgery date in 'YYYY-MM-DD' format
      surgeryTime, // Binds the surgery time
      surgerystatus, // Binds the surgery status (e.g., 'Scheduled')
      appointmentId, // Binds the appointment ID
    };

    // Execute the query with the provided parameters
    await run_query(query, params);

    res.status(200).json({ message: "Surgery scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling surgery:", error);
    res.status(500).json({ error: "Failed to schedule surgery" });
  }
});


export default router;
