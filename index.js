import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import signupRoute from "./routes/auth.js";
import editProfileRoute from "./routes/editProfile.js";
import resetpasswordRoute from "./routes/resetPass.js";
import appointment from "./routes/appointment.js";
import DoctorAppointment from "./routes/DoctorAppointment.js";
import FetchInfo from "./routes/FetchInfo.js";
import SetInfo from "./routes/SetInfo.js";
import UploadImage from "./routes/UploadImage.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use(cors());

app.use("/auth", signupRoute);
app.use("/auth", resetpasswordRoute);
app.use("/edit", editProfileRoute);
app.use("/api", appointment);
app.use("/api", DoctorAppointment);
app.use("/gets", FetchInfo);
app.use("/sets", SetInfo);
app.use("/upload", UploadImage);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
