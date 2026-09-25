import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

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