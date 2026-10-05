import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowLeft,
} from "lucide-react";

import api from "../../services/api.js";

import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const [loadingJob, setLoadingJob] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysis, setAnalysis] =
    useState(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError("No job selected for analysis.");
        setLoadingJob(false);
        return;
      }

      try {
        setLoadingJob(true);
        setError("");

        const response = await api.get(
          `/jobs/${jobId}`
        );

        setJob(response.data.job);
      } catch (error) {
        console.error(
          "Failed to fetch job:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleAnalyze = async (event) => {
    event.preventDefault();

    if (!resumeText.trim()) {
      setError(
        "Please paste your resume content first."
      );
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const token =
        localStorage.getItem("hirehub_token");

      const response = await api.post(
        "/resume/analyze",
        {
          jobId,
          resumeText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(
        response.data.analysis
      );
    } catch (error) {
      console.error(
        "Resume analysis failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to analyze resume."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingJob) {
    return (
      <main className="resume-analyzer-page">
        <div className="resume-analyzer-container">
          <div className="resume-analyzer-loading">
            <div className="resume-analyzer-spinner"></div>

            <p>
              Loading job details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="resume-analyzer-page">
      <div className="resume-analyzer-container">

        <Link
          to={
            jobId
              ? `/jobs/${jobId}`
              : "/jobs"
          }
          className="resume-analyzer-back"
        >
          <ArrowLeft size={17} />
          Back to Job
        </Link>

        <section className="resume-analyzer-header">
          <div className="resume-analyzer-icon">
            <Sparkles size={24} />
          </div>

          <h1>
            AI Resume Analyzer
          </h1>

          <p>
            Analyze how well your resume
            matches this job and discover
            areas you can improve.
          </p>
        </section>

        {error && (
          <div className="resume-analyzer-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {job && (
          <section className="resume-job-card">
            <div className="resume-job-icon">
              <FileText size={22} />
            </div>

            <div>
              <span>
                Analyzing resume for
              </span>

              <h2>
                {job.title}
              </h2>

              <p>
                {job.companyName}
                {job.location
                  ? ` • ${job.location}`
                  : ""}
              </p>
            </div>
          </section>
        )}

        <section className="resume-analyzer-form-card">
          <div className="resume-form-heading">
            <h2>
              Paste Your Resume
            </h2>

            <p>
              Copy and paste the text from
              your resume below.
            </p>
          </div>

          <form
            onSubmit={handleAnalyze}
            className="resume-analyzer-form"
          >
            <textarea
              value={resumeText}
              onChange={(event) =>
                setResumeText(
                  event.target.value
                )
              }
              placeholder="Paste your resume content here...

Example:
BCA graduate with experience in React, Node.js, MongoDB...

Skills:
JavaScript, React, Node.js, MongoDB...

Projects:
Built a MERN stack job recruitment platform..."
              rows={16}
            />

            <div className="resume-form-footer">
              <span>
                {resumeText.length} characters
              </span>

              <button
                type="submit"
                disabled={
                  analyzing ||
                  !resumeText.trim()
                }
              >
                <Sparkles size={17} />

                {analyzing
                  ? "Analyzing..."
                  : "Analyze Resume"}
              </button>
            </div>
          </form>
        </section>

        {analysis && (
          <section className="resume-analysis-results">

            <div className="analysis-header">
              <div>
                <span>
                  Resume Analysis
                </span>

                <h2>
                  Your Resume Match
                </h2>
              </div>

              <div className="analysis-score">
  <strong>
    {analysis.matchScore}%
  </strong>

  <span>
    {analysis.matchScore >= 80
      ? "Excellent Match"
      : analysis.matchScore >= 60
      ? "Good Match"
      : analysis.matchScore >= 40
      ? "Moderate Match"
      : "Low Match"}
  </span>
</div>
            </div>

            <div className="analysis-grid">

              <div className="analysis-card">
                <div className="analysis-card-title">
                  <CheckCircle2 size={19} />

                  <h3>
                    Matched Skills
                  </h3>
                </div>

                {analysis.matchedSkills
                  ?.length > 0 ? (
                  <div className="analysis-skills matched">
                    {analysis.matchedSkills.map(
                      (skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="analysis-empty">
                    No matching skills found.
                  </p>
                )}
              </div>

              <div className="analysis-card">
                <div className="analysis-card-title missing">
                  <AlertCircle size={19} />

                  <h3>
                    Missing Skills
                  </h3>
                </div>

                {analysis.missingSkills
                  ?.length > 0 ? (
                  <div className="analysis-skills missing">
                    {analysis.missingSkills.map(
                      (skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="analysis-empty">
                    No missing skills detected.
                  </p>
                )}
              </div>

            </div>

            <div className="analysis-suggestions">
              <div className="suggestions-title">
                <Lightbulb size={20} />

                <h3>
                  Improvement Suggestions
                </h3>
              </div>

              {analysis.suggestions
                ?.length > 0 ? (
                <ul>
                  {analysis.suggestions.map(
                    (suggestion, index) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Your resume looks good
                  for this job.
                </p>
              )}
            </div>

          </section>
        )}

      </div>
    </main>
  );
};

export default ResumeAnalyzer;