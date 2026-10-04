import OTP from "../models/OTP.js";

import {
  generateOTP,
  hashOTP,
  getOTPExpiry,
} from "../utils/otp.js";

import { sendOtpEmail } from "../services/emailService.js";


// =========================================================
// GENERATE OTP
// =========================================================

export const generateOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    // Validate required fields
    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP purpose are required",
      });
    }

    // Allowed OTP purposes
    const allowedPurposes = [
      "registration",
      "forgot-password",
      "login",
    ];

    if (!allowedPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Remove any existing OTP
    // for this email and purpose
    await OTP.deleteMany({
      email: normalizedEmail,
      purpose,
    });

    // Generate new OTP
    const otp = generateOTP();

    // Hash OTP before storing it
    const otpHash = hashOTP(otp);

    // OTP expires after 5 minutes
    const expiresAt = getOTPExpiry();

    // Store OTP in database
    await OTP.create({
      email: normalizedEmail,
      otpHash,
      purpose,
      expiresAt,
    });

    // Send OTP to user's email
    await sendOtpEmail({
      email: normalizedEmail,
      otp,
      purpose,
    });

    // Never return the actual OTP in production
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      expiresAt,
    });

  } catch (error) {
    console.error("Generate OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate OTP",
    });
  }
};


// =========================================================
// VERIFY OTP
// =========================================================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    // Validate required fields
    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and purpose are required",
      });
    }

    // Validate OTP purpose
    const allowedPurposes = [
      "registration",
      "forgot-password",
      "login",
    ];

    if (!allowedPurposes.includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose,
    });

    // OTP doesn't exist
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Maximum 5 attempts
    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Check expiration
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({
        _id: otpRecord._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "OTP has expired. Please request a new OTP.",
      });
    }

    // Hash submitted OTP
    const submittedOtpHash = hashOTP(
      otp.toString().trim()
    );

    // Compare hashes
    if (submittedOtpHash !== otpRecord.otpHash) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        attemptsRemaining:
          5 - otpRecord.attempts,
      });
    }

    // OTP is valid
    // Delete immediately so it cannot be reused
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};