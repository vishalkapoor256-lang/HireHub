import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  ArrowRight,
  CalendarDays,
  MapPin,
  Building2,
  UserRound,
} from "lucide-react";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const JobseekerDashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("hirehub_token");

        const response = await api.get("/applications/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(response.data.applications || []);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const totalApplications = applications.length;

  const shortlistedApplications = applications.filter(
    (application) => application.status === "shortlisted"
  ).length;

  const interviewApplications = applications.filter(
    (application) => application.status === "interview"
  ).length;

  const hiredApplications = applications.filter(
    (application) => application.status === "hired"
  ).length;

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0, 5);

  const getStatusLabel = (status) => {
    const labels = {
      applied: "Applied",
      shortlisted: "Shortlisted",
      interview: "Interview",
      hired: "Hired",
      rejected: "Rejected",
    };

    return labels[status] || status;
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
      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-loading">
            <div className="dashboard-loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* Header */}

        <section className="dashboard-header">

          <div>
            <span className="dashboard-eyebrow">
              Job Seeker Dashboard
            </span>

            <h1>
              Welcome back, {user?.name || "there"} 👋
            </h1>

            <p>
              Track your applications and discover your next
              career opportunity.
            </p>
          </div>

          <Link
            to="/jobs"
            className="dashboard-primary-action"
          >
            <Search size={18} />
            Find Jobs
          </Link>

        </section>

        {/* Error */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* Statistics */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon blue">
              <FileText size={21} />
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{totalApplications}</strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedApplications}</strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon purple">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Interviews</span>
              <strong>{interviewApplications}</strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Hired</span>
              <strong>{hiredApplications}</strong>
            </div>

          </div>

        </section>

        {/* Main Grid */}

        <div className="dashboard-content-grid">

          {/* Applications */}

          <section className="dashboard-section">

            <div className="dashboard-section-header">

              <div>
                <h2>Recent Applications</h2>

                <p>
                  Your latest job applications
                </p>
              </div>

              <Link
                to="/my-applications"
                className="dashboard-view-all"
              >
                View all
                <ArrowRight size={16} />
              </Link>

            </div>

            {recentApplications.length === 0 ? (

              <div className="dashboard-empty">

                <div className="dashboard-empty-icon">
                  <BriefcaseBusiness size={25} />
                </div>

                <h3>No applications yet</h3>

                <p>
                  Start exploring jobs and submit your first
                  application.
                </p>

                <Link
                  to="/jobs"
                  className="dashboard-empty-button"
                >
                  Browse Jobs
                  <ArrowRight size={16} />
                </Link>

              </div>

            ) : (

              <div className="dashboard-applications">

                {recentApplications.map((application) => (

                  <div
                    className="dashboard-application"
                    key={application._id}
                  >

                    <div className="dashboard-company-logo">

                      {application.job?.companyName
                        ?.charAt(0)
                        ?.toUpperCase() || (
                        <Building2 size={20} />
                      )}

                    </div>

                    <div className="dashboard-application-info">

                      <h3>
                        {application.job?.title ||
                          "Job no longer available"}
                      </h3>

                      <p className="dashboard-company">
                        {application.job?.companyName ||
                          "Unknown company"}
                      </p>

                      <div className="dashboard-application-meta">

                        <span>
                          <MapPin size={14} />
                          {application.job?.location ||
                            "N/A"}
                        </span>

                        <span>
                          <CalendarDays size={14} />
                          {formatDate(
                            application.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="dashboard-application-right">

                      <span
                        className={`status-badge status-${application.status}`}
                      >
                        {getStatusLabel(
                          application.status
                        )}
                      </span>

                      {application.job?._id && (
                        <Link
                          to={`/jobs/${application.job._id}`}
                        >
                          View Job
                        </Link>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* Sidebar */}

          <aside className="dashboard-sidebar">

            {/* Profile Card */}

            <section className="dashboard-profile-card">

              <div className="dashboard-profile-icon">
                <UserRound size={24} />
              </div>

              <h2>
                Complete your profile
              </h2>

              <p>
                A complete profile can help you present yourself
                better to recruiters.
              </p>

              <div className="dashboard-profile-progress">

                <div className="dashboard-progress-track">
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: "60%" }}
                  ></div>
                </div>

                <span>60% complete</span>

              </div>

              <button
                type="button"
                className="dashboard-profile-button"
                onClick={() =>
                  alert("Profile editing will be added soon.")
                }
              >
                Complete Profile
              </button>

            </section>

            {/* Quick Actions */}

            <section className="dashboard-quick-card">

              <h2>Quick Actions</h2>

              <Link to="/jobs">
                <span>
                  <Search size={17} />
                  Search Jobs
                </span>

                <ArrowRight size={16} />
              </Link>

              <Link to="/my-applications">
                <span>
                  <FileText size={17} />
                  My Applications
                </span>

                <ArrowRight size={16} />
              </Link>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
};

export default JobseekerDashboard;