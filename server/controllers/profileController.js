import User from "../models/User.js";

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================

export const getMyProfile = async (req, res) => {
    
    try {
        const user = await User.findById(req.userId).select(
            "-password"
        );

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
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching profile",
        });
    }
};


// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

export const updateMyProfile = async (req, res) => {
    try {
        const {
            name,
            profileImage,
            phone,
            location,
            bio,
            skills,
            education,
            experience,
            resumeUrl,
            companyName,
            companyDescription,
            companyWebsite,
            companyLogo,
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // =========================
        // BASIC INFORMATION
        // =========================

        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }

            user.name = name.trim();
        }

        if (profileImage !== undefined) {
            if (typeof profileImage !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Profile image must be a string",
                });
            }

            user.profileImage = profileImage.trim();
        }

        if (phone !== undefined) {
            if (typeof phone !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Phone must be a string",
                });
            }

            user.phone = phone.trim();
        }

        if (location !== undefined) {
            if (typeof location !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Location must be a string",
                });
            }

            user.location = location.trim();
        }

        if (bio !== undefined) {
            if (typeof bio !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Bio must be a string",
                });
            }

            if (bio.trim().length > 500) {
                return res.status(400).json({
                    success: false,
                    message: "Bio cannot exceed 500 characters",
                });
            }

            user.bio = bio.trim();
        }

        // =========================
        // JOBSEEKER INFORMATION
        // =========================

        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    success: false,
                    message: "Skills must be an array",
                });
            }

            user.skills = skills
                .filter(
                    (skill) =>
                        typeof skill === "string"
                )
                .map((skill) => skill.trim())
                .filter(Boolean);
        }

        if (education !== undefined) {
            if (!Array.isArray(education)) {
                return res.status(400).json({
                    success: false,
                    message: "Education must be an array",
                });
            }

            user.education = education;
        }

        if (experience !== undefined) {
            if (!Array.isArray(experience)) {
                return res.status(400).json({
                    success: false,
                    message: "Experience must be an array",
                });
            }

            user.experience = experience;
        }

        if (resumeUrl !== undefined) {
            if (typeof resumeUrl !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Resume URL must be a string",
                });
            }

            user.resumeUrl = resumeUrl.trim();
        }

        // =========================
        // RECRUITER INFORMATION
        // =========================

        if (companyName !== undefined) {
            if (typeof companyName !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Company name must be a string",
                });
            }

            user.companyName = companyName.trim();
        }

        if (companyDescription !== undefined) {
            if (typeof companyDescription !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company description must be a string",
                });
            }

            if (companyDescription.trim().length > 1000) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company description cannot exceed 1000 characters",
                });
            }

            user.companyDescription =
                companyDescription.trim();
        }

        if (companyWebsite !== undefined) {
            if (typeof companyWebsite !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company website must be a string",
                });
            }

            user.companyWebsite =
                companyWebsite.trim();
        }

        if (companyLogo !== undefined) {
            if (typeof companyLogo !== "string") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Company logo must be a string",
                });
            }

            user.companyLogo =
                companyLogo.trim();
        }

        await user.save();

        const updatedUser = await User.findById(
            req.userId
        ).select("-password");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating profile",
        });
    }
};