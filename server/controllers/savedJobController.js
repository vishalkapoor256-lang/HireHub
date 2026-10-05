import mongoose from "mongoose";

import SavedJob from "../models/SavedJob.js";
import Job from "../models/Job.js";

// SAVE A JOB
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID",
            });
        }

        const job = await Job.findOne({
            _id: jobId,
            status: "published",
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or no longer available",
            });
        }

        const existingSavedJob = await SavedJob.findOne({
            job: jobId,
            user: req.userId,
        });

        if (existingSavedJob) {
            return res.status(409).json({
                success: false,
                message: "Job is already saved",
            });
        }

        const savedJob = await SavedJob.create({
            job: jobId,
            user: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Job saved successfully",
            savedJob,
        });
    } catch (error) {
        console.error("Save job error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Job is already saved",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error while saving job",
        });
    }
};

// REMOVE A SAVED JOB
export const removeSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID",
            });
        }

        const savedJob = await SavedJob.findOneAndDelete({
            job: jobId,
            user: req.userId,
        });

        if (!savedJob) {
            return res.status(404).json({
                success: false,
                message: "Saved job not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job removed from saved jobs",
        });
    } catch (error) {
        console.error("Remove saved job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while removing saved job",
        });
    }
};

// GET MY SAVED JOBS
export const getMySavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({
            user: req.userId,
        })
            .populate(
                "job",
                "title companyName companyLogo location employmentType workplaceType category experienceLevel salaryMin salaryMax salaryCurrency status applicationDeadline"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: savedJobs.length,
            savedJobs,
        });
    } catch (error) {
        console.error("Get saved jobs error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching saved jobs",
        });
    }
};

// CHECK IF A JOB IS SAVED
export const checkSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID",
            });
        }

        const savedJob = await SavedJob.findOne({
            job: jobId,
            user: req.userId,
        });

        return res.status(200).json({
            success: true,
            saved: !!savedJob,
        });
    } catch (error) {
        console.error("Check saved job error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while checking saved job",
        });
    }
};