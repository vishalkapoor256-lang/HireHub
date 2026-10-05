import express from "express";

import {
    getMyProfile,
    updateMyProfile,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Get logged-in user's profile
router.get(
    "/me",
    authMiddleware,
    getMyProfile
);


// Update logged-in user's profile
router.put(
    "/me",
    authMiddleware,
    updateMyProfile
);


export default router;