import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import otpRoutes from "./routes/otpRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import savedJobRoutes from "./routes/savedJobRoutes.js"
import jobMatchingRoutes from "./routes/jobMatchingRoutes.js"
import resumeRoutes from "./routes/resumeRoutes.js"

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

//  Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/job-matching", jobMatchingRoutes);
app.use("/api/resume", resumeRoutes);


//Test route
app.get("/", (req, res)=>{
    res.json({
        success: true,
        message: "HireHub API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", ()=>{
   console.log(`HireHub API running on port ${PORT}`)
});