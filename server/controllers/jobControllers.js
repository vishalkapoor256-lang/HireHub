import mongoose from "mongoose";
import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const {
            title,
            companyName,
            companyLogo,
            location,
            employmentType,
            workplaceType,
            category,
            experienceLevel,
            salaryMin,
            salaryMax,
            salaryCurrency,
            description,
            requirements,
            responsibilities,
            skills,
            applicationDeadline,
            status,
            openings,
        } = req.body;

        // Basic validation
        if(
            !title ||
            !companyName ||
            !location ||
            !employmentType ||
            !workplaceType ||
            !category ||
            !experienceLevel ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required job fields",
            });
        }

        // Create job
        const job = await Job.create({
            recruiter: req.userId,
            title,
            companyName,
            companyLogo: companyLogo || "",
            location,
            employmentType,
            workplaceType,
            category,
            experienceLevel,
            salaryMin: salaryMin ?? null,
            salaryMax: salaryMax ?? null,
            salaryCurrency: salaryCurrency || "INR", 
            description,
            requirements: requirements || [],
            responsibilities: responsibilities || [],
            skills: skills || [],
            applicationDeadline: applicationDeadline || null,
            status: status || "published",
            openings: openings || 1,
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job,
        });

    } catch (error) {
        console.error("Created job error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
        
    }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      employmentType,
      workplaceType,
      category,
      experienceLevel,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: "published",
    };

    // Search
    if (search && search.trim()) {
      query.$text = {
        $search: search.trim(),
      };
    }

    // Location
    if (location && location.trim()) {
      query.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    // Employment type
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Workplace type
    if (workplaceType) {
      query.workplaceType = workplaceType;
    }

    // Category
    if (category && category.trim()) {
      query.category = {
        $regex: category.trim(),
        $options: "i",
      };
    }

    // Experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Minimum salary
    if (salaryMin) {
      query.salaryMin = {
        $gte: Number(salaryMin),
      };
    }

    // Maximum salary
    if (salaryMax) {
      query.salaryMax = {
        $lte: Number(salaryMax),
      };
    }

    // Pagination
    const currentPage = Math.max(Number(page) || 1, 1);
    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const skip = (currentPage - 1) * itemsPerPage;

    // Total matching jobs
    const totalJobs = await Job.countDocuments(query);

    // Get jobs for current page
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .populate("recruiter", "name email");

    const totalPages = Math.ceil(totalJobs / itemsPerPage);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage,
        itemsPerPage,
        totalJobs,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching jobs",
    });
  }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid job ID",
            });
        }

        const job = await Job.findOne({
            _id: id,
            status: "published",
        }).populate("recruiter", "name email");

        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        return res.status(200).json({
            success: true,
            job,
        });

    } catch (error) {
        console.error("Get job by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching job",
        });
    }
};

export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Check MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID",
            });
        }

        // Find the job
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Only the recruiter who created the job can update it
        if (job.recruiter.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own jobs",
            });
        }

        // Fields that are allowed to be updated
        const allowedFields = [
            "title",
            "companyName",
            "companyLogo",
            "location",
            "employmentType",
            "workplaceType",
            "category",
            "experienceLevel",
            "salaryMin",
            "salaryMax",
            "salaryCurrency",
            "description",
            "requirements",
            "responsibilities",
            "skills",
            "applicationDeadline",
            "status",
            "openings",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                job[field] = req.body[field];
            }
        });

        const updatedJob = await job.save();
        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Update job error:", error);

        return res.status(500).json({
            success: false,
            messages: "Server error while updating job",
        });
    }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find the job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only the recruiter who created the job can delete it
    if (job.recruiter.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs",
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting job",
    });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.userId,
    })
      .sort({ createdAt: -1 })
      .populate("recruiter", "name email");

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get my jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching your jobs",
    });
  }
};