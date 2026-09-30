import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview",
        "hired",
        "rejected",
      ],
      default: "applied",
    },

    recruiterNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same jobseeker from applying
// to the same job more than once.
applicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  }
);

// Useful for recruiter/applicant queries.
applicationSchema.index({
  applicant: 1,
  createdAt: -1,
});

applicationSchema.index({
  job: 1,
  createdAt: -1,
});

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;