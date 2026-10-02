import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        companyLogo: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        employmentType: {
            type: String,
            enum: [
                "full-time",
                "part-time",
                "contract",
                "internship",
                "freelance",
            ],
            required: true,
        },

        workplaceType: {
            type: String,
            enum: ["onsite", "remote", "hybrid"],
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        experienceLevel: {
            type: String,
            enum: ["entry", "mid", "senior", "lead"],
            required: true,
        },

        salaryMin: {
            type: Number,
            default: null,
        },

        salaryMax: {
            type: Number,
            default: null,
        },

        salaryCurrency: {
            type: String,
            default: "INR",
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        responsibilities: [
            {
                type: String,
                trim: true,
            },
        ],

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        applicationDeadline: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["draft", "published", "closed"],
            default: "published",
        },

        openings: {
            type: Number,
            default: 1,
            min: 1,
        },
    },
    {
        timestamps: true,
    }
);

// Text search
jobSchema.index({
    title: "text",
    description: "text",
    companyName: "text",
    skills: "text",
});

// Search optimization
jobSchema.index({
    location: 1,
    employmentType: 1,
    workplaceType: 1,
});

// Recruiter jobs
jobSchema.index({
    recruiter: 1,
    createdAt: -1,
});

const Job =mongoose.model("Job", jobSchema);

export default Job;