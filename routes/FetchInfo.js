import express from "express";
import supabase from "../db/SupabaseClient.js";
import { Contact } from "lucide-react";

const router = express.Router();

// fetch doctor data
router.get("/doctordata", async (req, res) => {
  const doctorId = req.query.doctorId;
  try {
    const { data, error } = await supabase
      .from("doctor")
      .select(
        `
          doctor_name, 
          doctor_mail, 
          doctor_phone, 
          doctor_district, 
          doctor_area, 
          doctor_roadnumber, 
          doctor_image, 
          doctor_speciality,
          doctor_payment,
          doctor_timeslot,
          hospital(hospital_name)
        `
      )
      .eq("doctor_id", doctorId);
    if (error) {
      console.error("Error fetching doctor data:", error);
      return res.status(500).json({ message: "Failed to fetch doctor data" });
    }
    console.log(data);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch patient data
router.get("/patientdata", async (req, res) => {
  const patientId = req.query.patientid;
  console.log("patientId", patientId);
  if (!patientId) {
    return res.status(400).json({ message: "patientid not provided" });
  }
  if (isNaN(patientId)) {
    return res.status(400).json({ message: "patientid is not a number" });
  }
  const parsedPatientId = parseInt(patientId);
  try {
    const { data, error } = await supabase
      .from("patient")
      .select("*")
      .eq("patient_id", parsedPatientId);
    if (error) {
      console.error("Error fetching patient data:", error);
      return res.status(500).json({ message: "Failed to fetch patient data" });
    }
    console.log(data);
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch appointment info
router.get("/appointmentinfo", async (req, res) => {
  const appointmentId = req.query.appointmentId;
  try {
    const { data, error } = await supabase
      .from("appointment")
      .select(
        `
            doctor(doctor_name), 
            patient(patient_name), 
            appointment_date, 
            patient(patient_age)
          `
      )
      .eq("appointment_id", appointmentId);
    if (error) {
      console.error("Error fetching appointment info:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch appointment info" });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching appointment info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch doctor transaction for a specific doctor
router.get("/senddoctortransactions", async (req, res) => {
  const doctorId = req.query.doctorId;
  try {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        `
                  patient(patient_name), 
                  transaction_date, 
                  transaction_amount
              `
      )
      .eq("doctor_id", doctorId);
    if (error) {
      console.error("Error fetching doctor transactions:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch doctor transactions" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching doctor transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch patient transaction for a specific patient
router.get("/sendpatienttransactions", async (req, res) => {
  const patientId = req.query.patientId;
  try {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        `
            payment_to, 
            transaction_for, 
            transaction_date, 
            transaction_amount
          `
      )
      .eq("patient_id", patientId);
    if (error) {
      console.error("Error fetching patient transactions:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch patient transactions" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching patient transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// fetch hospital info
router.get("/hospitaldata", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  try {
    const { data, error } = await supabase
      .from("hospital")
      .select("*")
      .eq("hospital_id", hospitalId);
    if (error) {
      console.error("Error fetching hospital data:", error);
      return res.status(500).json({ message: "Failed to fetch hospital data" });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching hospital data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//fetch schedule for a specific hospital
router.get("/hospitalSchedule", async (req, res) => {
  const hospitalId = req.query.hospitalid;
  try {
    const { data, error } = await supabase
      .from("appointment")
      .select(
        `
            doctor(doctor_name), 
            patient(patient_name), 
            appointment_date, 
            appointment_time
            `
      )
      .eq("hospital_id", hospitalId);
    if (error) {
      console.error("Error fetching hospital schedule:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch hospital schedule" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching hospital schedule:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

//fetch prescription for a specific appointment
router.get("/prescriptionforpatient", async (req, res) => {
  const appointmentId = req.query.appointmentId;
  try {
    const { data, error } = await supabase
      .from("prescription")
      .select(
        `
            doctor(doctor_name), 
            appointment_date, 
            patient_issue, 
            medicine, 
            glass, 
            surgery
            `
      )
      .eq("appointment_id", appointmentId);
    if (error) {
      console.error("Error fetching prescription:", error);
      return res.status(500).json({ error: "Failed to fetch prescription" });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
});

//fetch shop data
router.get("/shopdata", async (req, res) => {
  const shopId = req.query.shopid;
  try {
    const { data, error } = await supabase
      .from("shop")
      .select("*")
      .eq("shop_id", shopId);
    if (error) {
      console.error("Error fetching shop data:", error);
      return res.status(500).json({ message: "Failed to fetch shop data" });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error fetching shop data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch all products
router.get("/allproducts", async (req, res) => {
  try {
    const { data, error } = await supabase.from("supply").select("*");
    if (error) {
      console.error("Error fetching all products:", error);
      return res.status(500).json({ message: "Failed to fetch all products" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch products
router.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("supply")
      .select(
        `
                inventory(product_id), 
                product_name, 
                product_description, 
                product_price, 
                product_image,
                inventory(quantity), 
                shop(shop_id), 
                shop(shop_name)
            `
      )
      .gt("inventory.quantity", 0);
    if (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//search products
router.get("/productsearch", async (req, res) => {
  const search = req.query.search;
  try {
    const { data, error } = await supabase
      .from("supply")
      .select(
        `
                inventory(product_id), 
                product_name, 
                product_description, 
                product_price, 
                product_image,
                inventory(quantity), 
                shop(shop_id), 
                shop(shop_name)
            `
      )
      .ilike("product_name", `%${search}%`)
      .gt("inventory.quantity", 0);
    if (error) {
      console.error("Error searching products:", error);
      return res.status(500).json({ message: "Failed to search products" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch cart items
router.get("/cartitems", async (req, res) => {
  const patientId = req.query.patientId;
  try {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
                supply(product_name), 
                supply(product_price),
                product_id, 
                quantity, 
                cart_quantity,
                supply(product_image), 
                shop(shop_name), 
                shop(shop_id)
            `
      )
      .eq("patient_id", patientId);
    if (error) {
      console.error("Error fetching cart items:", error);
      return res.status(500).json({ message: "Failed to fetch cart items" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch all delivery agency informatio
router.get("/deliveryagency", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("delivery_agency")
      .select(
        "delivery_agency_id, delivery_agency_name, delivery_agency_status,delivery_charge"
      );
    if (error) {
      console.error("Error fetching delivery agency:", error);
      return res.status(500).json({ error: "Failed to fetch delivery agency" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching delivery agency:", error);
    res.status(500).json({ error: "Failed to fetch delivery agency" });
  }
});

// fetch all orders which are not delivered
router.get("/ordersforshop", async (req, res) => {
  const shopId = req.query.shopId;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_id,
            ordered_products(product_name),
            order_quantity,
            patient(patient_name),
            order_date,
        delivery_agency(delivery_agency_name)
      `
      )
      .eq("shop_id", shopId)
      .eq("order_status", "Pending");
    if (error) {
      console.error("Error fetching orders for shop:", error);
      return res.status(500).json({ error: "Failed to fetch orders for shop" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching orders for shop:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// fetch delivery data
router.get("/deliverydata", async (req, res) => {
  const deliveryId = req.query.deliveryId;
  try {
    const { data, error } = await supabase
      .from("delivery_agency")
      .select("*")
      .eq("delivery_agency_id", deliveryId);
    if (error) {
      console.error("Error fetching delivery data:", error);
      return res.status(500).json({ error: "Failed to fetch delivery data" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching delivery data:", error);
    res.status(500).json({ error: "Failed to fetch delivery data" });
  }
});

// fetch all orders for a specific delivery agency
router.get("/ordersfordeliveryagency", async (req, res) => {
  const deliveryId = req.query.deliveryId;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
                    order_id,
                    order_status,
                    shop(shop_name),
                    patient(patient_name),
                    order_date,
                    patient(patient_roadnumber),
                    patient(patient_area),
                    patient(patient_district),
                    patient(patient_phone)
                `
      )
      .eq("delivery_agency_id", deliveryId)
      .eq("order_status", "Accepted");
    if (error) {
      console.error("Error fetching orders for delivery agency:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch orders for delivery agency" });
    }

    const uniqueOrders = [];
    const orderIds = new Set();
    data.forEach((order) => {
      if (!orderIds.has(order.order_id)) {
        uniqueOrders.push(order);
        orderIds.add(order.order_id);
      }
    });

    res.status(200).json(uniqueOrders);
  } catch (error) {
    console.error("Error fetching orders for delivery agency:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch orders for delivery agency" });
  }
});

// fetch all order
router.get("/prevorders", async (req, res) => {
  const patientId = req.query.patientId;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
            order_id, 
            order_date, 
            shop(shop_name), 
            ordered_products(product_name), 
            order_quantity,
              delivery_agency(delivery_agency_name)
          `
      )
      .eq("patient_id", patientId)
      .eq("order_status", "Delivered");
    if (error) {
      console.error("Error fetching previous orders:", error);
      return res.status(500).json({ error: "Failed to fetch previous orders" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching previous orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/upcomingorders", async (req, res) => {
  const patientId = req.query.patientId;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
              order_id, 
              order_date, 
              shop(shop_name), 
              ordered_products(product_name), 
              order_quantity,
              delivery_agency(delivery_agency_name)
          `
      )
      .eq("patient_id", patientId)
      .eq("order_status", "Accepted");
    if (error) {
      console.error("Error fetching upcoming orders:", error);
      return res.status(500).json({ error: "Failed to fetch upcoming orders" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching upcoming orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// fetch all orders for a specific delivery agency
router.get("/ordersfordelivery", async (req, res) => {
  const deliveryId = req.query.deliveryId;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
                    order_id, 
                    order_date, 
                    shop(shop_name), 
                    ordered_products(product_name), 
                    order_quantity,
                    patient(patient_name), 
                    patient(patient_phone), 
                    patient(patient_address)
            `
      )
      .eq("delivery_agency_id", deliveryId)
      .eq("order_status", "Accepted");
    if (error) {
      console.error("Error fetching orders for delivery:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch orders for delivery" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching orders for delivery:", error);
    res.status(500).json({ error: "Failed to fetch orders for delivery" });
  }
});

export default router;
