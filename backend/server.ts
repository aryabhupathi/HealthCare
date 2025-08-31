import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import loginRoutes from "./routes/LoginRoutes";
import patientRoutes from "./routes/PatientRoutes";
import doctorRoutes from "./routes/DoctorRoutes";
import express from "express";
dotenv.config();
const app = express();
app.use(express.json());
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
cors({
  origin: allowedOrigin,
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true,
})
);
mongoose
.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthcare")
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
app.use("/auth", loginRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.get("/", (req, res) => {
res.send("Backend is working!");
});
const PORT = process.env.PORT || 1111;
app.listen(PORT, () => {
console.log(`🚀 Server is live on port ${PORT}`);
});
export default app;
