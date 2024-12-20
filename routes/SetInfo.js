import express from "express";
import cloudinary from "../cloudenary.js";
import supabase from "../db/SupabaseClient.js";

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
    // Fetch appointment date, doctor payment, patient ID, doctor ID
    const { data: appointmentData, error: appointmentError } = await supabase
      .from("appointment")
      .select("appointment_date, doctor_id, patient_id")
      .eq("appointment_id", appointmentId)
      .single();

    if (appointmentError) {
      console.error("Error fetching appointment data:", appointmentError);
      return res
        .status(500)
        .json({ error: "Failed to fetch appointment data" });
    }

    const { data: doctorData, error: doctorError } = await supabase
      .from("doctor")
      .select("doctor_payment")
      .eq("doctor_id", appointmentData.doctor_id)
      .single();

    if (doctorError) {
      console.error("Error fetching doctor data:", doctorError);
      return res.status(500).json({ error: "Failed to fetch doctor data" });
    }
    // Insert into PRESCRIPTION
    const { error: prescriptionError } = await supabase
      .from("prescription")
      .insert([
        {
          prescription_date: appointmentData.appointment_date,
          appointment_id: appointmentId,
          patient_issue: patientIssue,
          medicine: medicine,
          glass: glassDetails,
          surgery: surgeryDetails,
        },
      ]);
    if (prescriptionError) {
      console.error("Error setting prescription:", prescriptionError);
      return res.status(500).json({ error: "Failed to set prescription" });
    }
    // Update appointment status and set prescription ID
    const { data: prescriptionId, error: updateAppointmentError } =
      await supabase
        .from("prescription")
        .select("prescription_id")
        .eq("appointment_id", appointmentId)
        .single();

    if (updateAppointmentError) {
      console.error("Error setting prescription id:", updateAppointmentError);
      return res
        .status(500)
        .json({ error: "Failed to update appointment status" });
    }
    const { error: appointmentStatusError } = await supabase
      .from("appointment")
      .update({
        appointment_status: "Completed",
        prescription_id: prescriptionId.prescription_id,
      })
      .eq("appointment_id", appointmentId);
    if (appointmentStatusError) {
      console.error(
        "Error updating appointment status:",
        appointmentStatusError
      );
      return res
        .status(500)
        .json({ error: "Failed to update appointment status" });
    }
    // Inserting into TRANSACTION
    const { error: transactionError } = await supabase
      .from("transaction")
      .insert([
        {
          transaction_date: appointmentData.appointment_date,
          transaction_amount: doctorData.doctor_payment,
          patient_id: appointmentData.patient_id,
          doctor_id: appointmentData.doctor_id,
          payment_to: `doctor for appopintment ${appointmentId}`,
        },
      ]);
    if (transactionError) {
      console.error("Error updating transaction:", transactionError);
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
  try {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .eq("shop_id", shopId)
      .eq("product_id", productId);

    if (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Failed to add product" });
    }
    if (data && data.length > 0) {
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: data[0].quantity + quantity })
        .eq("shop_id", shopId)
        .eq("product_id", productId);
      if (updateError) {
        console.error("Error updating product:", updateError);
        return res.status(500).json({ error: "Failed to update product" });
      }
    } else {
      const { error: insertError } = await supabase
        .from("inventory")
        .insert([
          { shop_id: shopId, product_id: productId, quantity: quantity },
        ]);
      if (insertError) {
        console.error("Error inserting product:", insertError);
        return res.status(500).json({ error: "Failed to insert product" });
      }
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
  try {
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("patient_id", userId)
      .eq("product_id", productId)
      .eq("shop_id", shopId);

    if (error) {
      console.error("Error checking cart:", error);
      return res.status(500).json({ error: "Failed to check cart" });
    }
    if (data && data.length > 0) {
      const { error: updateError } = await supabase
        .from("cart")
        .update({ cart_quantity: data[0].cart_quantity + 1 })
        .eq("patient_id", userId)
        .eq("product_id", productId)
        .eq("shop_id", shopId);
      if (updateError) {
        console.error("Error updating cart:", updateError);
        return res.status(500).json({ error: "Failed to update cart" });
      }
    } else {
      const { error: insertError } = await supabase.from("cart").insert([
        {
          patient_id: userId,
          product_id: productId,
          shop_id: shopId,
          cart_quantity: cartQuantity,
        },
      ]);
      if (insertError) {
        console.error("Error inserting into cart:", insertError);
        return res.status(500).json({ error: "Failed to insert into cart" });
      }
    }
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

// update cart quantity
router.post("/updatecartquantity", async (req, res) => {
  const { productId, quantity, patientId, shopId } = req.body;
  try {
    const { error } = await supabase
      .from("cart")
      .update({ cart_quantity: quantity })
      .eq("product_id", productId)
      .eq("patient_id", patientId)
      .eq("shop_id", shopId);

    if (error) {
      console.error("Error updating cart quantity:", error);
      return res.status(500).json({ error: "Failed to update cart quantity" });
    }
    res.status(200).json({ message: "Cart quantity updated successfully" });
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
});

// remove from cart
router.post("/removefromcart", async (req, res) => {
  const { productId, patientId, shopId } = req.body;
  try {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("product_id", productId)
      .eq("patient_id", patientId)
      .eq("shop_id", shopId);
    if (error) {
      console.error("Error removing product from cart:", error);
      return res
        .status(500)
        .json({ error: "Failed to remove product from cart" });
    }
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

// place order
router.post("/placeorder", async (req, res) => {
  const { patientId, deliveryAgencyId, amount } = req.body;
  let insertedOrder;

  try {
    // Inserting into ORDERS
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          patient_id: patientId,
          delivery_agency_id: deliveryAgencyId,
          order_total: amount,
        },
      ])
      .select("order_id")
      .single();
    if (error) {
      console.error("Error inserting into ORDERS:", error);
      return res.status(500).json({ error: "Failed to insert into ORDERS" });
    }
    insertedOrder = data;
    // fetch all the products in the cart for the given patient id
    const { data: productfromcart, error: cartError } = await supabase
      .from("cart")
      .select("product_id, shop_id, cart_quantity")
      .eq("patient_id", patientId);
    if (cartError) {
      console.error("Error fetching cart data:", cartError);
      return res.status(500).json({ error: "Failed to fetch cart data" });
    }

    for (let product of productfromcart) {
      const { data: productPrice, error: priceError } = await supabase
        .from("supply")
        .select("product_price")
        .eq("product_id", product.product_id)
        .single();
      if (priceError) {
        console.error("Error fetching product price:", priceError);
        return res.status(500).json({ error: "Failed to fetch product price" });
      }

      // Inserting into ORDERED_PRODUCTS
      const { error: orderedProductError } = await supabase
        .from("ordered_products")
        .insert([
          {
            order_id: insertedOrder.order_id,
            product_id: product.product_id,
            shop_id: product.shop_id,
            order_quantity: product.cart_quantity,
            order_price: productPrice.product_price * product.cart_quantity,
          },
        ]);

      if (orderedProductError) {
        console.error(
          "Error inserting into ORDERED_PRODUCTS:",
          orderedProductError
        );
        return res
          .status(500)
          .json({ error: "Failed to insert into ORDERED_PRODUCTS" });
      }
      // Updating inventory
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from("inventory")
        .select("quantity")
        .eq("product_id", product.product_id)
        .eq("shop_id", product.shop_id)
        .single();
      if (inventoryError) {
        console.error("Error fetching inventory data:", inventoryError);
        return res
          .status(500)
          .json({ error: "Failed to fetch inventory data" });
      }
      const { error: inventoryUpdateError } = await supabase
        .from("inventory")
        .update({ quantity: inventoryItem.quantity - product.cart_quantity })
        .eq("product_id", product.product_id)
        .eq("shop_id", product.shop_id);

      if (inventoryUpdateError) {
        console.error("Error updating inventory:", inventoryUpdateError);
        return res.status(500).json({ error: "Failed to update inventory" });
      }
    }
    // Deleting from CART
    const { error: cartDeleteError } = await supabase
      .from("cart")
      .delete()
      .eq("patient_id", patientId);
    if (cartDeleteError) {
      console.error("Error deleting from CART:", cartDeleteError);
      return res.status(500).json({ error: "Failed to delete from CART" });
    }
    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// accept order
router.post("/acceptorder", async (req, res) => {
  const { orderId } = req.body;
  try {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: "Accepted" })
      .eq("order_id", orderId);
    if (error) {
      console.error("Error accepting order:", error);
      return res.status(500).json({ error: "Failed to accept order" });
    }
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
    const { error } = await supabase.from("supply").insert([
      {
        product_name: productName,
        product_price: productPrice,
        product_description: productDescription,
        product_image: cloudinaryResponse.secure_url,
      },
    ]);
    if (error) {
      console.error("Error adding product to supply:", error);
      return res.status(500).json({ error: "Failed to add product to supply" });
    }
    res.status(200).json({
      message: "Product added successfully",
      url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error adding product to supply:", error);
    res.status(500).json({ error: "Failed to add product to supply" });
  }
});

// delivery confirmed
router.post("/done", async (req, res) => {
  const orderId = req.body.orderId;
  try {
    //updating the order status
    const { error: orderError } = await supabase
      .from("orders")
      .update({ order_status: "Delivered" })
      .eq("order_id", orderId);
    if (orderError) {
      console.error("Error delivering order:", orderError);
      return res.status(500).json({ error: "Failed to deliver order" });
    }
    //fetching the date and delivery charge for the transaction
    const { data: orderData, error: orderDataError } = await supabase
      .from("orders")
      .select("order_date, delivery_agency_id, patient_id")
      .eq("order_id", orderId)
      .single();
    if (orderDataError) {
      console.error("Error fetching order data:", orderDataError);
      return res.status(500).json({ error: "Failed to fetch order data" });
    }
    const { data: deliveryCharge, error: deliveryError } = await supabase
      .from("delivery_agency")
      .select("delivery_charge, delivery_agency_name")
      .eq("delivery_agency_id", orderData.delivery_agency_id)
      .single();

    if (deliveryError) {
      console.error("Error fetching delivery data:", deliveryError);
      return res.status(500).json({ error: "Failed to fetch delivery data" });
    }

    //fixing transaction for delivery
    const { error: transactionError } = await supabase
      .from("transaction")
      .insert([
        {
          transaction_date: orderData.order_date,
          transaction_amount: deliveryCharge.delivery_charge,
          patient_id: orderData.patient_id,
          delivery_agency_id: orderData.delivery_agency_id,
          payment_to: deliveryCharge.delivery_agency_name,
        },
      ]);
    if (transactionError) {
      console.error("Error inserting delivery transaction:", transactionError);
      return res
        .status(500)
        .json({ error: "Failed to insert delivery transaction" });
    }
    res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    console.error("Error delivering order:", error);
    res.status(500).json({ error: "Failed to deliver order" });
  }
});

router.post("/updatehospital", async (req, res) => {
  const {
    hospitalId,
    hospitalName,
    hospitalDistrict,
    hospitalArea,
    hospitalRoadnumber,
    hospitalPhone,
    hospitalEmail,
  } = req.body;
  try {
    const { error } = await supabase
      .from("hospital")
      .update({
        hospital_name: hospitalName,
        hospital_district: hospitalDistrict,
        hospital_area: hospitalArea,
        hospital_roadnumber: hospitalRoadnumber,
        hospital_phone: hospitalPhone,
        hospital_mail: hospitalEmail,
      })
      .eq("hospital_id", hospitalId);
    if (error) {
      console.error("Error updating hospital:", error);
      return res.status(500).json({ error: "Failed to update hospital" });
    }
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

  try {
    const { data, error } = await supabase
      .from("appointment")
      .select("patient_id, doctor_id, hospital_id")
      .eq("appointment_id", appointmentId)
      .single();
    if (error) {
      console.error("Error fetching appointment data:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch appointment data" });
    }
    const { error: surgeryError } = await supabase.from("surgery").insert([
      {
        surgery_name: surgeryname,
        surgery_date: surgeryDate,
        surgery_time: surgeryTime,
        surgery_status: surgerystatus,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        hospital_id: data.hospital_id,
      },
    ]);
    if (surgeryError) {
      console.error("Error scheduling surgery:", surgeryError);
      return res.status(500).json({ error: "Failed to schedule surgery" });
    }
    res.status(200).json({ message: "Surgery scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling surgery:", error);
    res.status(500).json({ error: "Failed to schedule surgery" });
  }
});

export default router;
