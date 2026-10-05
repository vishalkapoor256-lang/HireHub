const normalizeText = (value) => {
    if (!value || typeof value !== "string") {
        return "";
    }

    return value
        .toLowerCase()
        .trim();
};

const normalizeSkills = (skills = []) => {
    return skills
        .filter(
            (skill) =>
                typeof skill === "string" &&
                skill.trim()
        )
        .map((skill) =>
            normalizeText(skill)
        );
};

export const calculateJobMatch = (
    user,
    job
) => {
    const userSkills = normalizeSkills(
        user.skills
    );

    const jobSkills = normalizeSkills(
        job.skills
    );

    const jobRequirements =
        normalizeSkills(
            job.requirements
        );

    const requiredSkills = [
        ...new Set([
            ...jobSkills,
            ...jobRequirements,
        ]),
    ];

    const matchedSkills =
        requiredSkills.filter((skill) =>
            userSkills.includes(skill)
        );

    const missingSkills =
        requiredSkills.filter(
            (skill) =>
                !userSkills.includes(skill)
        );

    // --------------------------------
    // 1. Skill Score - 70%
    // --------------------------------

    let skillScore = 0;

    if (requiredSkills.length > 0) {
        skillScore =
            (matchedSkills.length /
                requiredSkills.length) *
            100;
    }

    // --------------------------------
    // 2. Experience Score - 15%
    // --------------------------------

    let experienceScore = 0;

    const userExperience =
        user.experience || [];

    if (userExperience.length > 0) {
        experienceScore = 100;
    }

    // --------------------------------
    // 3. Category Score - 10%
    // --------------------------------

    let categoryScore = 0;

    const userCategories = [];

    userExperience.forEach((experience) => {
        if (experience.jobTitle) {
            userCategories.push(
                normalizeText(
                    experience.jobTitle
                )
            );
        }
    });

    if (
        job.category &&
        userCategories.some((category) =>
            category.includes(
                normalizeText(job.category)
            )
        )
    ) {
        categoryScore = 100;
    }

    // --------------------------------
    // 4. Experience Level Score - 5%
    // --------------------------------

    let experienceLevelScore = 0;

    const experienceCount =
        userExperience.length;

    const jobLevel =
        normalizeText(
            job.experienceLevel
        );

    if (
        jobLevel === "entry" &&
        experienceCount === 0
    ) {
        experienceLevelScore = 100;
    } else if (
        jobLevel === "entry" &&
        experienceCount >= 1
    ) {
        experienceLevelScore = 100;
    } else if (
        jobLevel === "mid" &&
        experienceCount >= 1
    ) {
        experienceLevelScore = 100;
    } else if (
        jobLevel === "senior" &&
        experienceCount >= 2
    ) {
        experienceLevelScore = 100;
    } else if (
        jobLevel === "lead" &&
        experienceCount >= 3
    ) {
        experienceLevelScore = 100;
    }

    // --------------------------------
    // Final Weighted Score
    // --------------------------------

    const finalScore = Math.min(
        100,
        Math.round(
            skillScore * 0.70 +
            experienceScore * 0.15 +
            categoryScore * 0.10 +
            experienceLevelScore * 0.05
        )
    );

    return {
        matchScore: finalScore,
        matchedSkills,
        missingSkills,
    };
};