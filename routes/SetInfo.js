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
  const { userId, productId, shopId } = req.body;
  console.log(userId, productId, shopId);
  try {
    let query = `
      SELECT * FROM CART 
      WHERE PATIENT_ID=:userId AND
      PRODUCT_ID=:productId`;
    let params = {
      userId,
      productId,
    };
    const result = await run_query(query, params);
    console.log(result);
    if (result.length > 0) {
      query = `
        UPDATE CART
        SET CART_QUANTITY = CART_QUANTITY + 1
        WHERE PATIENT_ID=:userId AND
        PRODUCT_ID=:productId`;
      params = {
        userId,
        productId,
      };
      await run_query(query, params);
    } else {
      query = `
        INSERT INTO CART(PATIENT_ID, PRODUCT_ID, SHOP_ID, CART_QUANTITY)
        VALUES(:userId, :productId, :shopId, 1)`;
      params = {
        userId,
        productId,
        shopId,
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
  const { productId, quantity, patientId } = req.body;
  console.log("server", productId, quantity, patientId);
  try {
    const query = `
      UPDATE CART
      SET CART_QUANTITY = :quantity
      WHERE PRODUCT_ID=:productId AND
      PATIENT_ID=:patientId`;
    const params = {
      productId,
      quantity,
      patientId,
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
  const { productId, patientId } = req.body;
  console.log("server", productId, patientId);
  try {
    const query = `
      DELETE FROM CART
      WHERE PRODUCT_ID=:productId AND
      PATIENT_ID=:patientId`;
    const params = {
      productId,
      patientId,
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
  const { orderId, patientId, deliveryAgencyId } = req.body;
  console.log("data", orderId, patientId, deliveryAgencyId);

  // Inserting into ORDERS
  try {
    let query = `INSERT INTO ORDERS(ORDER_ID, PATIENT_ID,
    DELIVERY_AGENCY_ID) VALUES(:orderId, :patientId, :deliveryAgencyId)`;
    let params = {
      orderId,
      patientId,
      deliveryAgencyId,
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
        ORDER_QUANTITY)
        VALUES(:orderId, :productId, :shopId, :orderQuantity)`;
        let params = {
          orderId: orderId,
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

export default router;
