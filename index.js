import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import signupRoute from "./routes/auth.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", signupRoute); 

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
