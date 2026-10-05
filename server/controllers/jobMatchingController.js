import User from "../models/User.js";
import Job from "../models/Job.js";

import {
    calculateJobMatch,
} from "../services/jobMatchingService.js";

export const getRecommendedJobs = async (
    req,
    res
) => {
    try {
        const user = await User.findById(
            req.userId
        ).select(
            "skills experience education"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const jobs = await Job.find({
            status: "published",
        }).sort({
            createdAt: -1,
        });

        const recommendations = jobs
            .map((job) => {
                const match =
                    calculateJobMatch(
                        user,
                        job
                    );

                return {
                    job,
                    matchScore:
                        match.matchScore,
                    matchedSkills:
                        match.matchedSkills,
                    missingSkills:
                        match.missingSkills,
                };
            })
            .filter(
                (item) =>
                    item.matchScore > 0
            )
            .sort(
                (a, b) =>
                    b.matchScore -
                    a.matchScore
            );

        return res.status(200).json({
            success: true,
            count: recommendations.length,
            recommendations,
        });
    } catch (error) {
        console.error(
            "Get recommended jobs error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error while generating job recommendations",
        });
    }
};