import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"
import otpRoutes from "./routes/otpRoutes.js"

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

//Test route
app.get("/", (req, res)=>{
    res.json({
        success: true,
        message: "HireHub API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
   console.log(`Server running on port ${PORT}`)
});