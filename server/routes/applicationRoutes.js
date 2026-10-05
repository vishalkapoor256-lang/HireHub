import express from "express";

import { applyForJob, checkApplication, getJobApplicants, getMyApplications, updateApplicationStatus, } from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get("/my", authMiddleware, authorizeRoles("jobseeker"), getMyApplications);

router.get("/job/:jobId", authMiddleware, authorizeRoles("recruiter"), getJobApplicants);

router.get("/check/:jobId", authMiddleware, authorizeRoles("jobseeker"), checkApplication);

router.put("/:applicationId/status", authMiddleware, authorizeRoles("recruiter"), updateApplicationStatus)

router.post( "/:jobId", authMiddleware, authorizeRoles("jobseeker"), applyForJob);

export default router;