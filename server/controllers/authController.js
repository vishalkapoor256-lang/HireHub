import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { generateOTP ,hashOTP, getOTPExpiry, } from "../utils/otp.js";
import { sendOtpEmail } from "../services/emailService.js"

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            otp,
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email, password and OTP are required",
            });
        }

        // Normalize email
        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User with this email already exists",
            });
        }

        // ==========================================
        // FIND REGISTRATION OTP
        // ==========================================

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "registration",
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or expired. Please request a new OTP.",
            });
        }

        // ==========================================
        // CHECK OTP ATTEMPTS
        // ==========================================

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

        // ==========================================
        // CHECK OTP EXPIRY
        // ==========================================

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

        // ==========================================
        // HASH SUBMITTED OTP
        // ==========================================

        const submittedOtpHash = hashOTP(
            otp.toString().trim()
        );

        // ==========================================
        // VERIFY OTP
        // ==========================================

        if (
            submittedOtpHash !==
            otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                attemptsRemaining:
                    5 - otpRecord.attempts,
            });
        }

        // ==========================================
        // OTP VERIFIED
        // Delete OTP immediately
        // ==========================================

        await OTP.deleteOne({
            _id: otpRecord._id,
        });

        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // ==========================================
        // CREATE USER
        // ==========================================

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "jobseeker",
        });

        // ==========================================
        // GENERATE JWT
        // ==========================================

        const token = generateToken(user._id);

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,
            message:
                "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during registration",
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        // Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        // Normalize email
        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        // ==========================================
        // PASSWORD CORRECT → GENERATE LOGIN OTP
        // ==========================================

        // Delete any previous login OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            purpose: "login",
        });

        // Generate new OTP
        const otp = generateOTP();

        // Hash OTP before storing
        const otpHash = hashOTP(otp);

        // Set OTP expiry
        const expiresAt = getOTPExpiry();

        // Save OTP
        await OTP.create({
            email: normalizedEmail,
            otpHash,
            purpose: "login",
            expiresAt,
        });

        // Send OTP to email
        await sendOtpEmail({
            email: normalizedEmail,
            otp,
            purpose: "login",
        });

        // Do NOT generate JWT yet
        return res.status(200).json({
            success: true,
            requiresOtp: true,
            message:
                "Password verified. Login OTP sent to your email.",
            email: normalizedEmail,
            expiresAt,
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error during login",
        });
    }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        // Do not reveal whether an email exists
        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    "If an account exists with this email, an OTP has been sent.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Please request an OTP to reset your password.",
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while processing forgot password request",
        });
    }
};

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (req, res) => {
    try {
        const {
            email,
            newPassword,
            otp,
        } = req.body;

        if (
            !email ||
            !newPassword ||
            !otp
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Email, OTP and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters",
            });
        }

        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // Check user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid password reset request",
            });
        }

        // Find forgot-password OTP
        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "forgot-password",
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or expired. Please request a new OTP.",
            });
        }

        // Check attempts
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

        // Check expiry
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

        // Compare OTP
        if (
            submittedOtpHash !==
            otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                attemptsRemaining:
                    5 - otpRecord.attempts,
            });
        }

        // Hash new password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete OTP immediately
        await OTP.deleteOne({
            _id: otpRecord._id,
        });

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully",
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while resetting password",
        });
    }
};


// ==========================================
// GET CURRENT USER
// ==========================================

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(
            req.userId
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(
            "Get user error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while fetching user",
        });
    }
};

// ==========================================
// VERIFY LOGIN OTP
// ==========================================

export const verifyLoginOtp = async (req, res) => {
    try {
        const {
            email,
            otp,
        } = req.body;

        // Validate fields
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and OTP are required",
            });
        }

        // Normalize email
        const normalizedEmail = email
            .toLowerCase()
            .trim();

        // Find login OTP
        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "login",
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP not found or expired. Please login again.",
            });
        }

        // Check maximum attempts
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

        // Check expiry
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please login again.",
            });
        }

        // Hash submitted OTP
        const submittedOtpHash = hashOTP(
            otp.toString().trim()
        );

        // Compare OTP
        if (
            submittedOtpHash !==
            otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                attemptsRemaining:
                    5 - otpRecord.attempts,
            });
        }

        // OTP is correct → delete it
        await OTP.deleteOne({
            _id: otpRecord._id,
        });

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate JWT only after OTP verification
        const token = generateToken(
            user._id
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(
            "Verify login OTP error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while verifying login OTP",
        });
    }
};