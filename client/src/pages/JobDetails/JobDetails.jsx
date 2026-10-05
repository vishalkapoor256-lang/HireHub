import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  Send,
  Users,
  Bookmark,
} from "lucide-react";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);

  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState("");

  // Existing application check
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] =
    useState(false);

  // =========================================
  // FETCH JOB
  // =========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/jobs/${id}`);

        setJob(response.data.job);
      } catch (error) {
        console.error("Failed to fetch job:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // =========================================
  // CHECK EXISTING APPLICATION
  // =========================================

  useEffect(() => {
    const checkExistingApplication = async () => {
      // Only jobseekers need application checking
      if (!user || user.role !== "jobseeker") {
        setHasApplied(false);
        setCheckingApplication(false);
        return;
      }

      try {
        setCheckingApplication(true);

        const token =
          localStorage.getItem("hirehub_token");

        const response = await api.get(
          `/applications/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHasApplied(
          response.data.applied === true
        );
      } catch (error) {
        console.error(
          "Failed to check application:",
          error
        );

        // If the check fails, allow the form to remain available.
        setHasApplied(false);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [id, user]);

  useEffect(() => {
  const checkSavedJob = async () => {
    if (!user || user.role !== "jobseeker") {
      setIsSaved(false);
      setCheckingSaved(false);
      return;
    }

    try {
      setCheckingSaved(true);

      const token = localStorage.getItem("hirehub_token");

      const response = await api.get(
        `/saved-jobs/check/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(response.data.saved === true);
    } catch (error) {
      console.error(
        "Failed to check saved job:",
        error
      );

      setIsSaved(false);
    } finally {
      setCheckingSaved(false);
    }
  };

  checkSavedJob();
}, [id, user]);

  // =========================================
  // APPLY FOR JOB
  // =========================================

  const handleApply = async (e) => {
    e.preventDefault();

    setApplicationError("");
    setApplicationSuccess("");
    setApplying(true);

    try {
      const token =
        localStorage.getItem("hirehub_token");

      await api.post(
        `/applications/${id}`,
        {
          resumeUrl,
          coverLetter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicationSuccess(
        "Application submitted successfully!"
      );

      setResumeUrl("");
      setCoverLetter("");

      // Immediately update UI
      setHasApplied(true);
    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  // =========================================
  // FORMAT TEXT
  // =========================================

  const formatText = (value) => {
    if (!value) return "";

    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  // =========================================
  // FORMAT SALARY
  // =========================================

  const formatSalary = () => {
    if (
      job.salaryMin == null &&
      job.salaryMax == null
    ) {
      return "Salary not disclosed";
    }

    const currency =
      job.salaryCurrency === "INR"
        ? "₹"
        : job.salaryCurrency || "";

    const formatNumber = (number) =>
      new Intl.NumberFormat("en-IN").format(number);

    if (
      job.salaryMin != null &&
      job.salaryMax != null
    ) {
      return `${currency}${formatNumber(
        job.salaryMin
      )} - ${currency}${formatNumber(
        job.salaryMax
      )}`;
    }

    if (job.salaryMin != null) {
      return `From ${currency}${formatNumber(
        job.salaryMin
      )}`;
    }

    return `Up to ${currency}${formatNumber(
      job.salaryMax
    )}`;
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =========================================
  // CHECK DEADLINE
  // =========================================

  const isDeadlinePassed = () => {
    if (!job.applicationDeadline) {
      return false;
    }

    return (
      new Date(job.applicationDeadline) <
      new Date()
    );
  };

  const handleSaveJob = async () => {
  if (!user || user.role !== "jobseeker") {
    return;
  }

  try {
    const token =
      localStorage.getItem("hirehub_token");

    if (isSaved) {
      await api.delete(
        `/saved-jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(false);
    } else {
      await api.post(
        `/saved-jobs/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsSaved(true);
    }
  } catch (error) {
    console.error(
      "Failed to save/unsave job:",
      error
    );
  }
};

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <main className="job-details-page">
        <div className="job-details-loading">
          <div className="jobs-loader"></div>

          <h3>
            Loading job details...
          </h3>

          <p>
            Please wait while we load this opportunity.
          </p>
        </div>
      </main>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (error) {
    return (
      <main className="job-details-page">
        <div className="job-details-state">
          <div className="job-details-state-icon">
            <Briefcase size={25} />
          </div>

          <h2>
            Unable to load job
          </h2>

          <p>{error}</p>

          <Link
            to="/jobs"
            className="job-back-button"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  // =========================================
  // JOB NOT FOUND
  // =========================================

  if (!job) {
    return (
      <main className="job-details-page">
        <div className="job-details-state">
          <div className="job-details-state-icon">
            <Briefcase size={25} />
          </div>

          <h2>
            Job not found
          </h2>

          <p>
            This job may have been removed or is no longer
            available.
          </p>

          <Link
            to="/jobs"
            className="job-back-button"
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  const deadlinePassed =
    isDeadlinePassed();

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <main className="job-details-page">

      <div className="job-details-container">

        {/* Back */}

        <Link
          to="/jobs"
          className="job-details-back"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </Link>

        {/* Header */}

        <section className="job-details-header">

          <div className="job-details-company-logo">

            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={`${job.companyName} logo`}
              />
            ) : (
              <Building2 size={34} />
            )}

          </div>

          <div className="job-details-header-content">

            <div className="job-details-badges">

              <span className="job-details-badge">
                {formatText(
                  job.workplaceType
                )}
              </span>

              {job.status === "published" && (
                <span className="job-details-active-badge">
                  <CheckCircle2 size={13} />
                  Actively Hiring
                </span>
              )}

            </div>

            <h1>
              {job.title}
            </h1>

            <p className="job-details-company">
              {job.companyName}
            </p>

            <div className="job-details-location">

              <span>
                <MapPin size={16} />
                {job.location}
              </span>

              <span>
                <Briefcase size={16} />
                {formatText(
                  job.employmentType
                )}
              </span>

              <span>
                <Clock3 size={16} />
                {formatText(
                  job.experienceLevel
                )}
              </span>

            </div>

          </div>

        </section>

        {/* Main Layout */}

        <div className="job-details-layout">

          {/* LEFT */}

          <div className="job-details-main">

            {/* Quick Info */}

            <section className="job-info-grid">

              <div className="job-info-item">

                <div className="job-info-icon">
                  <IndianRupee size={18} />
                </div>

                <div>
                  <span>Salary</span>

                  <strong>
                    {formatSalary()}
                  </strong>
                </div>

              </div>

              <div className="job-info-item">

                <div className="job-info-icon">
                  <Briefcase size={18} />
                </div>

                <div>
                  <span>Job Type</span>

                  <strong>
                    {formatText(
                      job.employmentType
                    )}
                  </strong>
                </div>

              </div>

              <div className="job-info-item">

                <div className="job-info-icon">
                  <Users size={18} />
                </div>

                <div>
                  <span>Openings</span>

                  <strong>
                    {job.openings || 1}
                  </strong>
                </div>

              </div>

              <div className="job-info-item">

                <div className="job-info-icon">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <span>Deadline</span>

                  <strong>
                    {job.applicationDeadline
                      ? formatDate(
                          job.applicationDeadline
                        )
                      : "Not specified"}
                  </strong>
                </div>

              </div>

            </section>

            {/* Description */}

            <section className="job-details-section">

              <h2>
                About the Job
              </h2>

              <p className="job-description">
                {job.description}
              </p>

            </section>

            {/* Skills */}

            {job.skills?.length > 0 && (
              <section className="job-details-section">

                <h2>
                  Skills & Technologies
                </h2>

                <div className="job-details-skills">

                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </section>
            )}

            {/* Requirements */}

            {job.requirements?.length > 0 && (
              <section className="job-details-section">

                <h2>
                  Requirements
                </h2>

                <ul className="job-details-list">

                  {job.requirements.map(
                    (
                      requirement,
                      index
                    ) => (
                      <li key={index}>
                        <CheckCircle2 size={17} />

                        <span>
                          {requirement}
                        </span>
                      </li>
                    )
                  )}

                </ul>

              </section>
            )}

            {/* Responsibilities */}

            {job.responsibilities?.length > 0 && (
              <section className="job-details-section">

                <h2>
                  Responsibilities
                </h2>

                <ul className="job-details-list">

                  {job.responsibilities.map(
                    (
                      responsibility,
                      index
                    ) => (
                      <li key={index}>
                        <CheckCircle2 size={17} />

                        <span>
                          {responsibility}
                        </span>
                      </li>
                    )
                  )}

                </ul>

              </section>
            )}

          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="job-details-sidebar">

            {/* Jobseeker Application */}

            {user?.role === "jobseeker" && (
              <section className="job-apply-card">

                <div className="job-apply-card-header">

                  <h2>
                    Apply for this job
                  </h2>

                  <p>
                    Take the next step in your career.
                  </p>

                </div>

                {/* Checking */}

                {checkingApplication ? (
                  <div className="job-closed-message">

                    <Clock3 size={22} />

                    <strong>
                      Checking application status...
                    </strong>

                    <p>
                      Please wait while we check your
                      application.
                    </p>

                  </div>

                ) : hasApplied ? (

                  /* Already Applied */

                  <div className="job-already-applied">

                    <div className="job-already-applied-icon">
                      <CheckCircle2 size={28} />
                    </div>

                    <h3>
                      Already Applied
                    </h3>

                    <p>
                      You have already submitted an
                      application for this position.
                    </p>

                    <Link
                      to="/my-applications"
                      className="job-view-application-button"
                    >
                      View My Applications
                      <ArrowRight size={16} />
                    </Link>

                  </div>

                ) : deadlinePassed ? (

                  /* Deadline Passed */

                  <div className="job-closed-message">

                    <CalendarDays size={22} />

                    <strong>
                      Applications closed
                    </strong>

                    <p>
                      The application deadline for this
                      position has passed.
                    </p>

                  </div>

                ) : (

                  /* Application Form */

                  <form
                    className="job-application-form"
                    onSubmit={handleApply}
                  >

                    {applicationError && (
                      <div className="application-alert error">
                        {applicationError}
                      </div>
                    )}

                    {applicationSuccess && (
                      <div className="application-alert success">

                        <CheckCircle2 size={17} />

                        {applicationSuccess}

                      </div>
                    )}

                    <div className="form-field">

                      <label htmlFor="resumeUrl">
                        Resume URL
                      </label>

                      <input
                        id="resumeUrl"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={resumeUrl}
                        onChange={(e) =>
                          setResumeUrl(
                            e.target.value
                          )
                        }
                        required
                      />

                      <small>
                        Add a shareable link to your resume.
                      </small>

                    </div>

                    <div className="form-field">

                      <label htmlFor="coverLetter">
                        Cover Letter
                      </label>

                      <textarea
                        id="coverLetter"
                        rows="7"
                        placeholder="Tell the recruiter why you're a good fit..."
                        value={coverLetter}
                        onChange={(e) =>
                          setCoverLetter(
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                    <button
                      type="submit"
                      className="job-apply-button"
                      disabled={applying}
                    >

                      <Send size={17} />

                      {applying
                        ? "Submitting..."
                        : "Apply Now"}

                      {!applying && (
                        <ArrowRight size={17} />
                      )}

                    </button>

                    {user?.role === "jobseeker" && (
  <button
    type="button"
    className={`save-job-button ${
      isSaved ? "saved" : ""
    }`}
    onClick={handleSaveJob}
    disabled={checkingSaved}
  >
    <Bookmark
      size={18}
      fill={isSaved ? "currentColor" : "none"}
    />

    <span>
      {checkingSaved
        ? "Checking..."
        : isSaved
        ? "Saved"
        : "Save Job"}
    </span>
  </button>
)}

                  </form>

                )}

              </section>
            )}

            {/* Recruiter */}

            {user?.role === "recruiter" && (
              <section className="job-side-info">

                <div className="job-side-info-icon">
                  <Briefcase size={22} />
                </div>

                <h3>
                  Recruiter Account
                </h3>

                <p>
                  Recruiter accounts cannot apply for jobs.
                </p>

                <Link to="/recruiter/dashboard">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>

              </section>
            )}

            {/* Job Summary */}

            <section className="job-summary-card">

              <h3>
                Job Summary
              </h3>

              <div className="job-summary-item">

                <MapPin size={17} />

                <div>
                  <span>Location</span>

                  <strong>
                    {job.location}
                  </strong>
                </div>

              </div>

              <div className="job-summary-item">

                <Briefcase size={17} />

                <div>
                  <span>Experience</span>

                  <strong>
                    {formatText(
                      job.experienceLevel
                    )}
                  </strong>
                </div>

              </div>

              <div className="job-summary-item">

                <Building2 size={17} />

                <div>
                  <span>Workplace</span>

                  <strong>
                    {formatText(
                      job.workplaceType
                    )}
                  </strong>
                </div>

              </div>

              {job.applicationDeadline && (
                <div className="job-summary-item">

                  <CalendarDays size={17} />

                  <div>
                    <span>
                      Apply Before
                    </span>

                    <strong>
                      {formatDate(
                        job.applicationDeadline
                      )}
                    </strong>
                  </div>

                </div>
              )}

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
};

export default JobDetails;