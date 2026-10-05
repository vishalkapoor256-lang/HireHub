import express from "express";

import {
  analyzeJobResume,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  authorizeRoles("jobseeker"),
  analyzeJobResume
);

export default router;
