import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  verifyLoginOtp,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// AUTH ROUTES
// ==========================================

// Register
// POST /api/auth/register
router.post("/register", registerUser);

// Login
// POST /api/auth/login
router.post("/login", loginUser);

router.post("/verify-login-otp", verifyLoginOtp);

// Get current logged-in user
// GET /api/auth/me
router.get("/me", authMiddleware, getMe);

// Forgot password
// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// Reset password
// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

export default router;
