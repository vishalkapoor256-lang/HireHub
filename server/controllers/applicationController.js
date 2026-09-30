import mongoose from "mongoose";

import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const { resumeUrl, coverLetter } = req.body;

    if (resumeUrl && typeof resumeUrl !== "string") {
  return res.status(400).json({
    success: false,
    message: "resumeUrl must be a string",
  });
}

if (coverLetter && typeof coverLetter !== "string") {
  return res.status(400).json({
    success: false,
    message: "coverLetter must be a string",
  });
}

if (coverLetter && coverLetter.trim().length > 2000) {
  return res.status(400).json({
    success: false,
    message: "Cover letter cannot exceed 2000 characters",
  });
}

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Check whether job exists and is published
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

    // Prevent recruiter from applying to their own job
    if (job.recruiter.toString() === req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Recruiters cannot apply to their own job",
      });
    }

    // Check for existing application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.userId,
      resumeUrl: resumeUrl || "",
      coverLetter: coverLetter || "",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply for job error:", error);

    // Handle duplicate database index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while applying for job",
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.userId,
    })
      .populate(
        "job",
        "title companyName companyLogo location employmentType workplaceType category experienceLevel salaryMin salaryMax salaryCurrency status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};

export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find the job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check job ownership
    if (job.recruiter.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view applicants for your own jobs",
      });
    }

    // Get applications
    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "applicant",
        "name email phone location bio profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get job applicants error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching applicants",
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, recruiterNote } = req.body;

    // Validate application ID
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    // Validate status
    const allowedStatuses = [
      "applied",
      "shortlisted",
      "interview",
      "hired",
      "rejected",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // Find application
    const application = await Application.findById(
      applicationId
    ).populate("job", "title companyName recruiter");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check job ownership
    if (
      application.job.recruiter.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update applications for your own jobs",
      });
    }

    // Update status
    application.status = status;

    // Update recruiter note if provided
    if (recruiterNote !== undefined) {
      if (typeof recruiterNote !== "string") {
        return res.status(400).json({
          success: false,
          message: "Recruiter note must be a string",
        });
      }

      if (recruiterNote.trim().length > 1000) {
        return res.status(400).json({
          success: false,
          message:
            "Recruiter note cannot exceed 1000 characters",
        });
      }

      application.recruiterNote = recruiterNote.trim();
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating application status",
    });
  }
};