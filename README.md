# DBMS Project Server

This project is a server-side application built using Node.js and Express. It serves as the backend for a database management system (DBMS) project. The server handles various routes and operations related to user authentication, profile management, appointments, and more.

## Features

- User authentication and authorization
- Profile management for patients and doctors
- Appointment scheduling and management
- Integration with OracleDB for database operations
- Integration with Supabase for additional database functionalities
- Cloudinary integration for image uploads
- Email notifications using Nodemailer

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- OracleDB
- Supabase account
- Cloudinary account

### Environment Variables

Create a `.env` file in the root directory of the project and contact the admin to get more details.


For details on the environment variables, please contact the admin.

### Install Dependencies

Run the following command to install the project dependencies:

```
npm install
```

### Running the Project

To start the server, run the following command:

```
npm start
```

The server will start running on the port specified in the `.env` file (default is 5000).

## Usage Guidelines

### Available Routes

- **User Authentication**
  - `POST /auth/signup`: Sign up a new user
  - `POST /auth/login`: Log in an existing user
  - `POST /auth/doctorsignup`: Sign up a new doctor
  - `POST /auth/doctorsignin`: Log in an existing doctor
  - `POST /auth/shopsignup`: Sign up a new shop owner
  - `POST /auth/shopsignin`: Log in an existing shop owner
  - `POST /auth/hospitalsignup`: Sign up a new hospital manager
  - `POST /auth/hospitalsignin`: Log in an existing hospital manager
  - `POST /auth/deliverysignup`: Sign up a new delivery agency
  - `POST /auth/deliverysignin`: Log in an existing delivery agency

- **Profile Management**
  - `POST /edit/doctorprofile`: Update doctor's profile
  - `POST /edit/patientProfileData`: Update patient's profile
  - `POST /edit/doctorProfileData`: Update doctor's profile

- **Appointments**
  - `GET /api/doctors`: Fetch all doctors
  - `GET /api/doctorsearch`: Search doctors
  - `GET /api/doctorstime`: Fetch time slots for a specific doctor
  - `GET /api/upcommingappointments`: Fetch upcoming appointments for a specific patient
  - `GET /api/previousappointments`: Fetch previous appointments for a specific patient
  - `POST /api/appointmentsdata`: Book a new appointment

- **Doctor Appointments**
  - `GET /api/senddoctorappointments`: Fetch appointments for a specific doctor

- **Fetch Information**
  - `GET /gets/doctordata`: Fetch doctor data
  - `GET /gets/patientdata`: Fetch patient data
  - `GET /gets/appointmentinfo`: Fetch appointment info
  - `GET /gets/senddoctortransactions`: Fetch doctor transactions
  - `GET /gets/sendpatienttransactions`: Fetch patient transactions
  - `GET /gets/hospitaldata`: Fetch hospital data
  - `GET /gets/hospitalSchedule`: Fetch schedule for a specific hospital
  - `GET /gets/prescriptionforpatient`: Fetch prescription for a specific appointment
  - `GET /gets/shopdata`: Fetch shop data
  - `GET /gets/allproducts`: Fetch all products
  - `GET /gets/products`: Fetch products
  - `GET /gets/productsearch`: Search products
  - `GET /gets/cartitems`: Fetch cart items
  - `GET /gets/deliveryagency`: Fetch all delivery agency information
  - `GET /gets/ordersforshop`: Fetch all orders which are not delivered
  - `GET /gets/deliverydata`: Fetch delivery data
  - `GET /gets/ordersfordeliveryagency`: Fetch all orders for a specific delivery agency
  - `GET /gets/prevorders`: Fetch all previous orders for a specific patient
  - `GET /gets/upcomingorders`: Fetch all upcoming orders for a specific patient
  - `GET /gets/ordersfordelivery`: Fetch all orders for a specific delivery agency

- **Set Information**
  - `POST /sets/setprescription`: Set prescription information
  - `POST /sets/addproduct`: Add product to inventory
  - `POST /sets/addtocart`: Add product to cart
  - `POST /sets/updatecartquantity`: Update cart quantity
  - `POST /sets/removefromcart`: Remove product from cart
  - `POST /sets/placeorder`: Place an order
  - `POST /sets/acceptorder`: Accept an order
  - `POST /sets/productstosupply`: Add product to supply
  - `POST /sets/done`: Confirm delivery
  - `POST /sets/updatehospital`: Update hospital information
  - `POST /sets/surgery`: Schedule a surgery

- **Reset Password**
  - `POST /auth/resetpassword`: Reset password
  - `POST /auth/verifyotp`: Verify OTP
  - `POST /auth/updatepass`: Update password

- **Upload Image**
  - `POST /upload`: Upload an image

