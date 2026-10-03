import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Plus,
  Users,
  CheckCircle2,
  Clock3,
  ArrowRight,
  MapPin,
  CalendarDays,
  Building2,
  Eye,
} from "lucide-react";

import api from "../../services/api.js";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("hirehub_token");

        const response = await api.get("/jobs/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error(
          "Failed to fetch recruiter jobs:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (job) => job.status === "published"
  ).length;

  const draftJobs = jobs.filter(
    (job) => job.status === "draft"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "closed"
  ).length;

  const formatText = (value) => {
    if (!value) return "N/A";

    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="recruiter-dashboard-page">
        <div className="recruiter-dashboard-container">
          <div className="recruiter-dashboard-loading">
            <div className="dashboard-loading-spinner"></div>
            <p>Loading your recruiter dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="recruiter-dashboard-page">

      <div className="recruiter-dashboard-container">

        {/* Header */}

        <section className="recruiter-dashboard-header">

          <div>
            <span className="recruiter-dashboard-eyebrow">
              Recruiter Dashboard
            </span>

            <h1>
              Manage your hiring.
            </h1>

            <p>
              Create jobs, manage applicants, and find the right
              talent for your team.
            </p>
          </div>

          <Link
            to="/recruiter/jobs/create"
            className="recruiter-create-button"
          >
            <Plus size={18} />
            Create Job
          </Link>

        </section>

        {/* Error */}

        {error && (
          <div className="recruiter-dashboard-error">
            {error}
          </div>
        )}

        {/* Statistics */}

        <section className="recruiter-dashboard-stats">

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon blue">
              <BriefcaseBusiness size={21} />
            </div>

            <div>
              <span>Total Jobs</span>
              <strong>{totalJobs}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Active Jobs</span>
              <strong>{activeJobs}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Draft Jobs</span>
              <strong>{draftJobs}</strong>
            </div>

          </div>

          <div className="recruiter-stat-card">

            <div className="recruiter-stat-icon purple">
              <Users size={21} />
            </div>

            <div>
              <span>Closed Jobs</span>
              <strong>{closedJobs}</strong>
            </div>

          </div>

        </section>

        {/* Main Content */}

        <section className="recruiter-jobs-section">

          <div className="recruiter-section-header">

            <div>
              <h2>My Jobs</h2>

              <p>
                Manage the jobs you have posted on HireHub.
              </p>
            </div>

            <Link
              to="/recruiter/jobs/create"
              className="recruiter-section-create"
            >
              <Plus size={16} />
              Create Job
            </Link>

          </div>

          {jobs.length === 0 ? (

            <div className="recruiter-empty-state">

              <div className="recruiter-empty-icon">
                <BriefcaseBusiness size={26} />
              </div>

              <h3>You haven't posted any jobs yet</h3>

              <p>
                Create your first job posting and start finding
                qualified candidates.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="recruiter-empty-button"
              >
                Create Your First Job
                <ArrowRight size={16} />
              </Link>

            </div>

          ) : (

            <div className="recruiter-jobs-grid">

              {jobs.map((job) => (

                <article
                  className="recruiter-job-card"
                  key={job._id}
                >

                  {/* Card Header */}

                  <div className="recruiter-job-card-header">

                    <div className="recruiter-company-logo">
                      {job.companyName
                        ?.charAt(0)
                        ?.toUpperCase() || (
                        <Building2 size={20} />
                      )}
                    </div>

                    <span
                      className={`recruiter-job-status status-${job.status}`}
                    >
                      {formatText(job.status)}
                    </span>

                  </div>

                  {/* Job Information */}

                  <div className="recruiter-job-content">

                    <h3>
                      {job.title}
                    </h3>

                    <p className="recruiter-company-name">
                      {job.companyName}
                    </p>

                    <div className="recruiter-job-meta">

                      <span>
                        <MapPin size={14} />
                        {job.location}
                      </span>

                      <span>
                        <BriefcaseBusiness size={14} />
                        {formatText(
                          job.employmentType
                        )}
                      </span>

                      <span>
                        <Building2 size={14} />
                        {formatText(
                          job.workplaceType
                        )}
                      </span>

                    </div>

                    <div className="recruiter-job-posted">

                      <CalendarDays size={14} />

                      Posted{" "}
                      {formatDate(job.createdAt)}

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="recruiter-job-actions">

                    <Link
                      to={`/jobs/${job._id}`}
                      className="recruiter-view-job"
                    >
                      <Eye size={15} />
                      View Job
                    </Link>

                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="recruiter-view-applicants"
                    >
                      <Users size={15} />
                      Applicants
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
};

export default RecruiterDashboard;