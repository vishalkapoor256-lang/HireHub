const normalizeText = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.toLowerCase().trim();
};

const normalizeSkills = (skills = []) => {
  return skills
    .filter(
      (skill) =>
        typeof skill === "string" &&
        skill.trim()
    )
    .map((skill) => normalizeText(skill));
};

export const analyzeResume = (
  resumeText,
  job
) => {
  const text = normalizeText(resumeText);

  const jobSkills = normalizeSkills(
    job.skills
  );

  const jobRequirements = normalizeSkills(
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
      text.includes(skill)
    );

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !matchedSkills.includes(skill)
    );

  let matchScore = 0;

  if (requiredSkills.length > 0) {
    matchScore = Math.round(
      (matchedSkills.length /
        requiredSkills.length) *
        100
    );
  }

  const suggestions = [];

  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider adding experience or projects related to: ${missingSkills
        .slice(0, 5)
        .join(", ")}.`
    );
  }

  if (!text.includes("project")) {
    suggestions.push(
      "Add relevant projects to demonstrate your practical experience."
    );
  }

  if (!text.includes("experience")) {
    suggestions.push(
      "Add your relevant work or internship experience."
    );
  }

  if (!text.includes("education")) {
    suggestions.push(
      "Include your educational background."
    );
  }

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    suggestions,
  };
};