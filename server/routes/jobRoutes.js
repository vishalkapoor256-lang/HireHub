import express from "express";
import { createJob, deleteJob, getAllJobs, getJobById, getMyJobs, updateJob } from "../controllers/jobControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

// Get all published jobs
router.get("/", getAllJobs);

router.get("/my", authMiddleware, authorizeRoles("recruiter"), getMyJobs);

// Get single published job
router.get("/:id", getJobById);

// Create job - recruiter only
router.post("/", authMiddleware, authorizeRoles("recruiter") ,createJob);

// Update job - owner recruiter only
router.put("/:id", authMiddleware, authorizeRoles("recruiter"), updateJob);

// Delete job
router.delete("/:id", authMiddleware, authorizeRoles("recruiter"), deleteJob);


export default router;