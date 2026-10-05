import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        // =========================
        // BASIC USER INFORMATION
        // =========================

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["jobseeker", "recruiter"],
            default: "jobseeker",
        },

        profileImage: {
            type: String,
            default: "",
        },

        phone: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        bio: {
            type: String,
            default: "",
            maxlength: 500,
        },

        // =========================
        // JOBSEEKER INFORMATION
        // =========================

        skills: {
            type: [String],
            default: [],
        },

        education: {
            type: [
                {
                    degree: {
                        type: String,
                        trim: true,
                    },

                    institution: {
                        type: String,
                        trim: true,
                    },

                    fieldOfStudy: {
                        type: String,
                        trim: true,
                    },

                    startYear: {
                        type: Number,
                    },

                    endYear: {
                        type: Number,
                    },

                    description: {
                        type: String,
                        trim: true,
                    },
                },
            ],
            default: [],
        },

        experience: {
            type: [
                {
                    jobTitle: {
                        type: String,
                        trim: true,
                    },

                    company: {
                        type: String,
                        trim: true,
                    },

                    location: {
                        type: String,
                        trim: true,
                    },

                    startDate: {
                        type: Date,
                    },

                    endDate: {
                        type: Date,
                    },

                    currentlyWorking: {
                        type: Boolean,
                        default: false,
                    },

                    description: {
                        type: String,
                        trim: true,
                    },
                },
            ],
            default: [],
        },

        resumeUrl: {
            type: String,
            default: "",
            trim: true,
        },

        // =========================
        // RECRUITER / COMPANY INFO
        // =========================

        companyName: {
            type: String,
            default: "",
            trim: true,
        },

        companyDescription: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },

        companyWebsite: {
            type: String,
            default: "",
            trim: true,
        },

        companyLogo: {
            type: String,
            default: "",
            trim: true,
        },

        // =========================
        // ACCOUNT STATUS
        // =========================

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;