import Job from "../models/Job.js";

import {
  analyzeResume,
} from "../services/resumeAnalyzerService.js";

export const analyzeJobResume = async (
  req,
  res
) => {
  try {
    const { jobId, resumeText } = req.body;

    if (!jobId || !resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Job ID and resume text are required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "published") {
      return res.status(400).json({
        success: false,
        message:
          "Resume can only be analyzed against a published job",
      });
    }

    const analysis = analyzeResume(
      resumeText,
      job
    );

    return res.status(200).json({
      success: true,
      message:
        "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while analyzing resume",
    });
  }
};