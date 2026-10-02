import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState("");

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

  const handleApply = async (e) => {
    e.preventDefault();

    setApplicationError("");
    setApplicationSuccess("");
    setApplying(true);

    try {
      const token = localStorage.getItem("hirehub_token");

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
    } catch (error) {
      console.error("Application error:", error);

      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="job-details-page">
        <p>Loading job details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="job-details-page">
        <p>{error}</p>
        <Link to="/jobs">Back to Jobs</Link>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="job-details-page">
        <p>Job not found.</p>
        <Link to="/jobs">Back to Jobs</Link>
      </main>
    );
  }

  return (
    <main className="job-details-page">
      <Link to="/jobs">← Back to Jobs</Link>

      <section className="job-details-card">
        <h1>{job.title}</h1>

        <h2>{job.companyName}</h2>

        <p>📍 {job.location}</p>
        <p>💼 {job.employmentType}</p>
        <p>🏢 {job.workplaceType}</p>
        <p>📊 {job.experienceLevel}</p>

        {job.salaryMin !== null &&
          job.salaryMax !== null && (
            <p>
              💰 {job.salaryCurrency} {job.salaryMin} -{" "}
              {job.salaryMax}
            </p>
          )}

        <hr />

        <h2>Job Description</h2>
        <p>{job.description}</p>

        {job.skills?.length > 0 && (
          <>
            <h2>Skills</h2>

            <ul>
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </>
        )}

        {job.requirements?.length > 0 && (
          <>
            <h2>Requirements</h2>

            <ul>
              {job.requirements.map(
                (requirement, index) => (
                  <li key={index}>{requirement}</li>
                )
              )}
            </ul>
          </>
        )}

        {job.responsibilities?.length > 0 && (
          <>
            <h2>Responsibilities</h2>

            <ul>
              {job.responsibilities.map(
                (responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                )
              )}
            </ul>
          </>
        )}

        {job.applicationDeadline && (
          <p>
            <strong>Application Deadline:</strong>{" "}
            {new Date(
              job.applicationDeadline
            ).toLocaleDateString()}
          </p>
        )}

        {/* APPLICATION SECTION */}

        {user?.role === "jobseeker" && (
          <section className="application-section">
            <h2>Apply for this Job</h2>

            {applicationError && (
              <p className="form-error">
                {applicationError}
              </p>
            )}

            {applicationSuccess && (
              <p className="form-success">
                {applicationSuccess}
              </p>
            )}

            <form onSubmit={handleApply}>
              <label htmlFor="resumeUrl">
                Resume URL
              </label>

              <input
                id="resumeUrl"
                type="url"
                placeholder="https://drive.google.com/..."
                value={resumeUrl}
                onChange={(e) =>
                  setResumeUrl(e.target.value)
                }
              />

              <label htmlFor="coverLetter">
                Cover Letter
              </label>

              <textarea
                id="coverLetter"
                rows="6"
                placeholder="Write a short cover letter..."
                value={coverLetter}
                onChange={(e) =>
                  setCoverLetter(e.target.value)
                }
              />

              <button
                type="submit"
                disabled={applying}
              >
                {applying
                  ? "Submitting..."
                  : "Apply Now"}
              </button>
            </form>
          </section>
        )}

        {user?.role === "recruiter" && (
          <p>
            Recruiters cannot apply for jobs.
          </p>
        )}
      </section>
    </main>
  );
};

export default JobDetails;