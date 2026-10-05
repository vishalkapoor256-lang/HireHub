import express from "express";

import {
    getRecommendedJobs,
} from "../controllers/jobMatchingController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get(
    "/recommended",
    authMiddleware,
    authorizeRoles("jobseeker"),
    getRecommendedJobs
);

export default router;