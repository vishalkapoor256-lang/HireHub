import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  MapPin,
  BriefcaseBusiness,
  Trash2,
} from "lucide-react";

import api from "../../services/api.js";
import "./SavedJobs.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("hirehub_token");

      const response = await api.get(
        "/saved-jobs/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs(
        response.data.savedJobs || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch saved jobs:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load saved jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const token =
        localStorage.getItem("hirehub_token");

      await api.delete(
        `/saved-jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs((prev) =>
        prev.filter(
          (savedJob) =>
            savedJob.job?._id !== jobId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove saved job:",
        error
      );
    }
  };

  if (loading) {
    return (
      <main className="saved-jobs-page">
        <div className="saved-jobs-container">
          <p className="saved-jobs-loading">
            Loading saved jobs...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="saved-jobs-page">
      <div className="saved-jobs-container">

        <div className="saved-jobs-header">
          <div>
            <span className="saved-jobs-eyebrow">
              YOUR JOBS
            </span>

            <h1>Saved Jobs</h1>

            <p>
              Jobs you've bookmarked for
              later.
            </p>
          </div>

          <div className="saved-jobs-count">
            <Bookmark size={18} />
            <span>
              {savedJobs.length} saved
            </span>
          </div>
        </div>

        {error && (
          <div className="saved-jobs-error">
            {error}
          </div>
        )}

        {!error && savedJobs.length === 0 && (
          <div className="saved-jobs-empty">
            <Bookmark size={42} />

            <h2>No saved jobs yet</h2>

            <p>
              Save interesting jobs and
              come back to them later.
            </p>

            <Link
              to="/jobs"
              className="saved-jobs-browse-button"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {savedJobs.length > 0 && (
          <div className="saved-jobs-list">
            {savedJobs.map((savedJob) => {
              const job = savedJob.job;

              if (!job) return null;

              return (
                <article
                  key={savedJob._id}
                  className="saved-job-card"
                >
                  <div className="saved-job-main">

                    <div className="saved-job-icon">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={`${job.companyName} logo`}
                        />
                      ) : (
                        <BriefcaseBusiness
                          size={24}
                        />
                      )}
                    </div>

                    <div className="saved-job-info">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="saved-job-title"
                      >
                        {job.title}
                      </Link>

                      <p className="saved-job-company">
                        {job.companyName}
                      </p>

                      <div className="saved-job-meta">
                        <span>
                          <MapPin size={15} />
                          {job.location ||
                            "Location not specified"}
                        </span>

                        <span>
                          <BriefcaseBusiness
                            size={15}
                          />
                          {job.employmentType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="saved-job-actions">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="saved-job-view-button"
                    >
                      View Job
                    </Link>

                    <button
                      type="button"
                      className="saved-job-remove-button"
                      onClick={() =>
                        handleRemoveSavedJob(
                          job._id
                        )
                      }
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedJobs;