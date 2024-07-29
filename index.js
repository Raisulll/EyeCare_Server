import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import signupRoute from "./routes/auth.js";
import editProfileRoute from "./routes/editProfile.js";
import resetpasswordRoute from "./routes/resetPass.js";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", signupRoute);
app.use("/auth", resetpasswordRoute);
app.use("/edit", editProfileRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
