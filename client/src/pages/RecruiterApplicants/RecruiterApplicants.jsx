import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api.js";

const RecruiterApplicants = () => {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  const [notes, setNotes] = useState({});

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

        // Load existing recruiter notes
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

  // Loading state
  if (loading) {
    return (
      <main className="recruiter-applicants-page">
        <p>Loading applicants...</p>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="recruiter-applicants-page">
        <Link to="/recruiter/dashboard">
          ← Back to Dashboard
        </Link>

        <h1>Applicants</h1>

        <p className="form-error">{error}</p>
      </main>
    );
  }

  return (
    <main className="recruiter-applicants-page">
      <Link to="/recruiter/dashboard">
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="applicants-header">
        <div>
          <h1>Job Applicants</h1>

          <p>
            Review and manage applicants for this job.
          </p>
        </div>

        <div className="applicants-count">
          <strong>{applicants.length}</strong>
          <span>Applicants</span>
        </div>
      </div>

      {/* Update Error */}
      {updateError && (
        <p className="form-error">
          {updateError}
        </p>
      )}

      {/* No Applicants */}
      {applicants.length === 0 ? (
        <div className="empty-applicants">
          <h2>No Applicants Yet</h2>

          <p>
            Nobody has applied for this job yet.
          </p>
        </div>
      ) : (
        <div className="applicants-list">
          {applicants.map((application) => (
            <div
              className="applicant-card"
              key={application._id}
            >
              {/* Applicant Information */}
              <div className="applicant-header">
                <div>
                  <h2>
                    {application.applicant?.name ||
                      "Unknown Applicant"}
                  </h2>

                  <p>
                    <strong>Email:</strong>{" "}
                    {application.applicant?.email ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* Application Date */}
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>

              {/* Resume */}
              {application.resumeUrl && (
                <div className="applicant-resume">
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}

              {/* Cover Letter */}
              {application.coverLetter && (
                <div className="cover-letter">
                  <h3>Cover Letter</h3>

                  <p>
                    {application.coverLetter}
                  </p>
                </div>
              )}

              {/* Recruiter Note */}
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
                    notes[application._id] ?? ""
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
                  {(
                    notes[application._id] || ""
                  ).length}/1000 characters
                </small>
              </div>

              {/* Application Status */}
              <div className="application-status-section">
                <label
                  htmlFor={`status-${application._id}`}
                >
                  Application Status
                </label>

                <select
                  id={`status-${application._id}`}
                  value={application.status}
                  disabled={
                    updatingId === application._id
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
              </div>

              {/* Save Note */}
              <div className="applicant-actions">
                <button
                  type="button"
                  disabled={
                    updatingId === application._id
                  }
                  onClick={() =>
                    handleUpdateApplication(
                      application._id,
                      application.status
                    )
                  }
                >
                  {updatingId === application._id
                    ? "Saving..."
                    : "Save Note"}
                </button>
              </div>

              {/* Updating Message */}
              {updatingId === application._id && (
                <p className="update-message">
                  Updating application...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default RecruiterApplicants;