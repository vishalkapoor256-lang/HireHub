import express from "express";

import {
  saveJob,
  removeSavedJob,
  getMySavedJobs,
  checkSavedJob,
} from "../controllers/savedJobController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

// Get all saved jobs
router.get("/my", authMiddleware, authorizeRoles("jobseeker"), getMySavedJobs);

// Check whether a job is saved
router.get(
  "/check/:jobId",
  authMiddleware,
  authorizeRoles("jobseeker"),
  checkSavedJob,
);

// Save a job
router.post("/:jobId", authMiddleware, authorizeRoles("jobseeker"), saveJob);

// Remove a saved job
router.delete(
  "/:jobId",
  authMiddleware,
  authorizeRoles("jobseeker"),
  removeSavedJob,
);

export default router;
