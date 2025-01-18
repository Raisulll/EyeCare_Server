# DBMS Project Server

This project is a server-side application built using Node.js and Express. It provides various functionalities for managing appointments, user authentication, profile editing, and more. The project also integrates with OracleDB, Supabase, and Cloudinary for database management, client interactions, and image handling respectively.

## Features

- User authentication and authorization
- Appointment management for doctors and patients
- Profile editing for users
- Image upload and management using Cloudinary
- Database interactions using OracleDB and Supabase
- Email notifications for password reset

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- OracleDB
- Supabase account
- Cloudinary account

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```
PORT=5000
USER=admin
PASSWORD=admin
CONNECTION_STRING=localhost:1521/orclpdb
EMAIL='eyecare.g10@gmail.com'
EMAIL_PASSWORD='angvowarudmxsagh'
Cloudinary_Api_Secret= '2CnXapWIP3lkqGT9nIeyizFVQjQ'
Cloudinary_Api_Key= 767758152499473
Cloudinary_Cloud_Name= 'dnn7v3kkw'
Supabase_Url=https://qgnjyqatltbinjtsdmrx.supabase.co
Supabase_Anon_Key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbmp5cWF0bHRiaW5qdHNkbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2OTQ0OTQsImV4cCI6MjA1MDI3MDQ5NH0.KccU8IVYH18_qaoiuRVHVqddeVJ-3v7qSnAwI6L9FR0
```

### Install Dependencies

Run the following command to install the required dependencies:

```
npm install
```

## Running the Project

To start the server, run the following command:

```
npm start
```

The server will start running on the port specified in the `.env` file (default is 5000).

## Usage Guidelines

### Available Routes

- **User Authentication**
  - `POST /auth/signup` - User signup
  - `POST /auth/login` - User login
  - `POST /auth/doctorsignup` - Doctor signup
  - `POST /auth/doctorsignin` - Doctor login
  - `POST /auth/shopsignup` - Shop owner signup
  - `POST /auth/shopsignin` - Shop owner login
  - `POST /auth/hospitalsignup` - Hospital manager signup
  - `POST /auth/hospitalsignin` - Hospital manager login
  - `POST /auth/deliverysignup` - Delivery agency signup
  - `POST /auth/deliverysignin` - Delivery agency login

- **Profile Editing**
  - `POST /edit/doctorprofile` - Update doctor profile
  - `POST /edit/patientProfileData` - Update patient profile
  - `POST /edit/doctorProfileData` - Update doctor profile

- **Appointment Management**
  - `GET /api/doctors` - Fetch all doctors
  - `GET /api/doctorsearch` - Search doctors
  - `GET /api/doctorstime` - Fetch time slots for a specific doctor
  - `GET /api/upcommingappointments` - Fetch upcoming appointments for a specific patient
  - `GET /api/previousappointments` - Fetch previous appointments for a specific patient
  - `POST /api/appointmentsdata` - Book a new appointment

- **Doctor Appointments**
  - `GET /api/senddoctorappointments` - Fetch appointments for a specific doctor

- **Fetch Information**
  - `GET /gets/doctordata` - Fetch doctor data
  - `GET /gets/patientdata` - Fetch patient data
  - `GET /gets/appointmentinfo` - Fetch appointment info
  - `GET /gets/senddoctortransactions` - Fetch doctor transactions
  - `GET /gets/sendpatienttransactions` - Fetch patient transactions
  - `GET /gets/hospitaldata` - Fetch hospital info
  - `GET /gets/hospitalSchedule` - Fetch schedule for a specific hospital
  - `GET /gets/prescriptionforpatient` - Fetch prescription for a specific appointment
  - `GET /gets/shopdata` - Fetch shop data
  - `GET /gets/allproducts` - Fetch all products
  - `GET /gets/products` - Fetch products
  - `GET /gets/productsearch` - Search products
  - `GET /gets/cartitems` - Fetch cart items
  - `GET /gets/deliveryagency` - Fetch all delivery agency information
  - `GET /gets/ordersforshop` - Fetch all orders which are not delivered
  - `GET /gets/deliverydata` - Fetch delivery data
  - `GET /gets/ordersfordeliveryagency` - Fetch all orders for a specific delivery agency
  - `GET /gets/prevorders` - Fetch all previous orders
  - `GET /gets/upcomingorders` - Fetch all upcoming orders
  - `GET /gets/ordersfordelivery` - Fetch all orders for a specific delivery agency

- **Set Information**
  - `POST /sets/setprescription` - Set prescription information
  - `POST /sets/addproduct` - Add product to inventory
  - `POST /sets/addtocart` - Add product to cart
  - `POST /sets/updatecartquantity` - Update cart quantity
  - `POST /sets/removefromcart` - Remove product from cart
  - `POST /sets/placeorder` - Place an order
  - `POST /sets/acceptorder` - Accept an order
  - `POST /sets/productstosupply` - Add product to supply
  - `POST /sets/done` - Confirm delivery
  - `POST /sets/updatehospital` - Update hospital information
  - `POST /sets/surgery` - Schedule a surgery

- **Password Reset**
  - `POST /auth/resetpassword` - Request password reset
  - `POST /auth/verifyotp` - Verify OTP for password reset
  - `POST /auth/updatepass` - Update password

- **Image Upload**
  - `POST /upload` - Upload an image

