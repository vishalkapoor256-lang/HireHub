import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react";

import api from "../../services/api.js";

const RecruiterApplicants = () => {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  const [notes, setNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("hirehub_token");

        const response = await api.get(
          `/applications/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const applications =
          response.data.applications || [];

        setApplicants(applications);

        const existingNotes = {};

        applications.forEach((application) => {
          existingNotes[application._id] =
            application.recruiterNote || "";
        });

        setNotes(existingNotes);
      } catch (error) {
        console.error(
          "Failed to fetch applicants:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load applicants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // Update application status + recruiter note
  const handleUpdateApplication = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);
      setUpdateError("");

      const token = localStorage.getItem("hirehub_token");

      const response = await api.put(
        `/applications/${applicationId}/status`,
        {
          status: newStatus,
          recruiterNote:
            notes[applicationId] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedApplication =
        response.data.application;

      setApplicants((prevApplicants) =>
        prevApplicants.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status:
                  updatedApplication.status ||
                  newStatus,
                recruiterNote:
                  updatedApplication.recruiterNote ??
                  notes[applicationId] ??
                  "",
              }
            : application
        )
      );

      setNotes((prev) => ({
        ...prev,
        [applicationId]:
          updatedApplication.recruiterNote ??
          notes[applicationId] ??
          "",
      }));
    } catch (error) {
      console.error(
        "Failed to update application:",
        error
      );

      setUpdateError(
        error.response?.data?.message ||
          "Failed to update application."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary counts
  const totalApplicants = applicants.length;

  const appliedCount = applicants.filter(
    (application) =>
      application.status === "applied"
  ).length;

  const shortlistedCount = applicants.filter(
    (application) =>
      application.status === "shortlisted"
  ).length;

  const interviewCount = applicants.filter(
    (application) =>
      application.status === "interview"
  ).length;

  const hiredCount = applicants.filter(
    (application) =>
      application.status === "hired"
  ).length;

  const rejectedCount = applicants.filter(
    (application) =>
      application.status === "rejected"
  ).length;

  // Search + filter
  const filteredApplicants = useMemo(() => {
    const search = searchTerm
      .trim()
      .toLowerCase();

    return applicants.filter((application) => {
      const name =
        application.applicant?.name?.toLowerCase() ||
        "";

      const email =
        application.applicant?.email?.toLowerCase() ||
        "";

      const matchesSearch =
        !search ||
        name.includes(search) ||
        email.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, searchTerm, statusFilter]);

  const formatStatus = (status) => {
    if (!status) return "Applied";

    return status
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Loading
  if (loading) {
    return (
      <main className="recruiter-applicants-page">
        <div className="recruiter-applicants-container">
          <div className="applicants-loading">
            <div className="applicants-loading-spinner"></div>
            <p>Loading applicants...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <main className="recruiter-applicants-page">
        <div className="recruiter-applicants-container">

          <Link
            to="/recruiter/dashboard"
            className="applicants-back-link"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="applicants-page-error">
            <XCircle size={20} />
            <div>
              <h2>Unable to load applicants</h2>
              <p>{error}</p>
            </div>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="recruiter-applicants-page">

      <div className="recruiter-applicants-container">

        {/* HEADER */}

        <div className="applicants-page-header">

          <div>

            <Link
              to="/recruiter/dashboard"
              className="applicants-back-link"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <div className="applicants-title-row">

              <div className="applicants-title-icon">
                <Users size={25} />
              </div>

              <div>
                <span className="applicants-eyebrow">
                  Recruitment
                </span>

                <h1>Job Applicants</h1>

                <p>
                  Review candidates and manage their
                  application status.
                </p>
              </div>

            </div>

          </div>

          <div className="applicants-total-card">
            <strong>{totalApplicants}</strong>
            <span>Total Applicants</span>
          </div>

        </div>

        {/* STATS */}

        <section className="applicants-stats">

          <div className="applicant-stat-card">

            <div className="applicant-stat-icon blue">
              <Users size={19} />
            </div>

            <div>
              <span>Total</span>
              <strong>{totalApplicants}</strong>
            </div>

          </div>

          <div className="applicant-stat-card">

            <div className="applicant-stat-icon orange">
              <Clock3 size={19} />
            </div>

            <div>
              <span>Applied</span>
              <strong>{appliedCount}</strong>
            </div>

          </div>

          <div className="applicant-stat-card">

            <div className="applicant-stat-icon purple">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedCount}</strong>
            </div>

          </div>

          <div className="applicant-stat-card">

            <div className="applicant-stat-icon green">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <span>Interview</span>
              <strong>{interviewCount}</strong>
            </div>

          </div>

          <div className="applicant-stat-card">

            <div className="applicant-stat-icon success">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Hired</span>
              <strong>{hiredCount}</strong>
            </div>

          </div>

        </section>

        {/* UPDATE ERROR */}

        {updateError && (
          <div className="applicants-update-error">
            <XCircle size={17} />
            <span>{updateError}</span>
          </div>
        )}

        {/* TOOLBAR */}

        {applicants.length > 0 && (
          <section className="applicants-toolbar">

            <div className="applicants-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search applicant by name or email..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>

            <select
              className="applicants-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Statuses
              </option>

              <option value="applied">
                Applied
              </option>

              <option value="shortlisted">
                Shortlisted
              </option>

              <option value="interview">
                Interview
              </option>

              <option value="hired">
                Hired
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </section>
        )}

        {/* EMPTY */}

        {applicants.length === 0 ? (
          <div className="empty-applicants">

            <div className="empty-applicants-icon">
              <Users size={28} />
            </div>

            <h2>No Applicants Yet</h2>

            <p>
              Nobody has applied for this job yet.
              Applicants will appear here when they
              submit their applications.
            </p>

            <Link
              to="/recruiter/dashboard"
              className="empty-applicants-button"
            >
              Back to Dashboard
            </Link>

          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="empty-applicants">

            <div className="empty-applicants-icon">
              <Search size={27} />
            </div>

            <h2>No Matching Applicants</h2>

            <p>
              Try changing your search or status filter.
            </p>

          </div>
        ) : (
          <div className="applicants-list">

            {filteredApplicants.map(
              (application) => {

                const applicantName =
                  application.applicant?.name ||
                  "Unknown Applicant";

                const applicantEmail =
                  application.applicant?.email ||
                  "N/A";

                const initials =
                  applicantName
                    .split(" ")
                    .map((part) =>
                      part.charAt(0)
                    )
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                return (
                  <article
                    className="applicant-card"
                    key={application._id}
                  >

                    {/* Applicant header */}

                    <div className="applicant-card-header">

                      <div className="applicant-profile">

                        <div className="applicant-avatar">
                          {initials || (
                            <User size={20} />
                          )}
                        </div>

                        <div>
                          <h2>{applicantName}</h2>

                          <a
                            href={`mailto:${applicantEmail}`}
                            className="applicant-email"
                          >
                            <Mail size={14} />
                            {applicantEmail}
                          </a>
                        </div>

                      </div>

                      <span
                        className={`applicant-status status-${application.status}`}
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                    </div>

                    {/* Application metadata */}

                    <div className="applicant-meta">

                      <span>
                        <CalendarDays size={14} />
                        Applied {formatDate(
                          application.createdAt
                        )}
                      </span>

                      <span>
                        <BriefcaseBusiness size={14} />
                        Application
                      </span>

                    </div>

                    {/* Resume */}

                    {application.resumeUrl && (
                      <div className="applicant-resume-box">

                        <div className="applicant-resume-info">

                          <div className="resume-icon">
                            <FileText size={18} />
                          </div>

                          <div>
                            <strong>Resume</strong>
                            <span>
                              Candidate resume
                            </span>
                          </div>

                        </div>

                        <a
                          href={
                            application.resumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-button"
                        >
                          View Resume
                        </a>

                      </div>
                    )}

                    {/* Cover Letter */}

                    {application.coverLetter && (
                      <div className="cover-letter-box">

                        <div className="content-section-heading">
                          <FileText size={16} />
                          <h3>Cover Letter</h3>
                        </div>

                        <p>
                          {application.coverLetter}
                        </p>

                      </div>
                    )}

                    {/* Management area */}

                    <div className="applicant-management">

                      {/* Note */}

                      <div className="recruiter-note-section">

                        <label
                          htmlFor={`note-${application._id}`}
                        >
                          Recruiter Note
                        </label>

                        <textarea
                          id={`note-${application._id}`}
                          rows="4"
                          maxLength="1000"
                          placeholder="Add a private note about this applicant..."
                          value={
                            notes[
                              application._id
                            ] ?? ""
                          }
                          onChange={(e) =>
                            setNotes((prev) => ({
                              ...prev,
                              [application._id]:
                                e.target.value,
                            }))
                          }
                        />

                        <small>
                          {
                            (
                              notes[
                                application._id
                              ] || ""
                            ).length
                          }
                          /1000 characters
                        </small>

                      </div>

                      {/* Status */}

                      <div className="application-status-section">

                        <label
                          htmlFor={`status-${application._id}`}
                        >
                          Application Status
                        </label>

                        <select
                          id={`status-${application._id}`}
                          value={
                            application.status
                          }
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onChange={(e) =>
                            handleUpdateApplication(
                              application._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="applied">
                            Applied
                          </option>

                          <option value="shortlisted">
                            Shortlisted
                          </option>

                          <option value="interview">
                            Interview
                          </option>

                          <option value="hired">
                            Hired
                          </option>

                          <option value="rejected">
                            Rejected
                          </option>
                        </select>

                        <button
                          type="button"
                          className="save-note-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            handleUpdateApplication(
                              application._id,
                              application.status
                            )
                          }
                        >
                          {updatingId ===
                          application._id
                            ? "Saving..."
                            : "Save Note"}
                        </button>

                      </div>

                    </div>

                    {updatingId ===
                      application._id && (
                      <div className="update-message">
                        Updating application...
                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
};

export default RecruiterApplicants;