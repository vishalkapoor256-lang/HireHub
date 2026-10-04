import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  Users,
  XCircle,
  Eye,
} from "lucide-react";

import api from "../../services/api.js";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("hirehub_token");

        const response = await api.get(
          "/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(
          response.data.applications || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const totalApplications =
    applications.length;

  const appliedCount = applications.filter(
    (application) =>
      application.status === "applied"
  ).length;

  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status === "shortlisted"
    ).length;

  const interviewCount =
    applications.filter(
      (application) =>
        application.status === "interview"
    ).length;

  const hiredCount =
    applications.filter(
      (application) =>
        application.status === "hired"
    ).length;

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

  const filteredApplications = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const jobTitle =
          application.job?.title
            ?.toLowerCase() || "";

        const company =
          application.job?.companyName
            ?.toLowerCase() || "";

        const matchesSearch =
          !search ||
          jobTitle.includes(search) ||
          company.includes(search);

        const matchesStatus =
          statusFilter === "all" ||
          application.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    searchTerm,
    statusFilter,
  ]);

  if (loading) {
    return (
      <main className="my-applications-page">
        <div className="my-applications-container">
          <div className="my-applications-loading">
            <div className="my-applications-spinner"></div>

            <p>
              Loading your applications...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-applications-page">
        <div className="my-applications-container">
          <div className="my-applications-error">
            <XCircle size={22} />

            <div>
              <h2>
                Unable to load applications
              </h2>

              <p>{error}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="my-applications-page">

      <div className="my-applications-container">

        {/* Header */}

        <section className="my-applications-header">

          <div>
            <span className="my-applications-eyebrow">
              Jobseeker Dashboard
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Track your applications and
              monitor your hiring progress.
            </p>
          </div>

          <Link
            to="/jobs"
            className="browse-jobs-button"
          >
            <BriefcaseBusiness size={17} />
            Browse Jobs
          </Link>

        </section>

        {/* Statistics */}

        <section className="my-applications-stats">

          <div className="my-application-stat-card">

            <div className="my-application-stat-icon blue">
              <Users size={19} />
            </div>

            <div>
              <span>Total</span>
              <strong>
                {totalApplications}
              </strong>
            </div>

          </div>

          <div className="my-application-stat-card">

            <div className="my-application-stat-icon orange">
              <Clock3 size={19} />
            </div>

            <div>
              <span>Applied</span>
              <strong>
                {appliedCount}
              </strong>
            </div>

          </div>

          <div className="my-application-stat-card">

            <div className="my-application-stat-icon purple">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>
                {shortlistedCount}
              </strong>
            </div>

          </div>

          <div className="my-application-stat-card">

            <div className="my-application-stat-icon green">
              <BriefcaseBusiness size={19} />
            </div>

            <div>
              <span>Interview</span>
              <strong>
                {interviewCount}
              </strong>
            </div>

          </div>

          <div className="my-application-stat-card">

            <div className="my-application-stat-icon success">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Hired</span>
              <strong>
                {hiredCount}
              </strong>
            </div>

          </div>

        </section>

        {/* Toolbar */}

        {applications.length > 0 && (
          <section className="my-applications-toolbar">

            <div className="my-applications-search">

              <Search size={17} />

              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              className="my-applications-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
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

        {/* Applications */}

        {applications.length === 0 ? (

          <div className="my-applications-empty">

            <div className="my-applications-empty-icon">
              <BriefcaseBusiness size={28} />
            </div>

            <h2>
              No Applications Yet
            </h2>

            <p>
              You haven't applied for any
              jobs yet. Explore available
              opportunities and submit your
              first application.
            </p>

            <Link
              to="/jobs"
              className="my-applications-empty-button"
            >
              Browse Jobs
            </Link>

          </div>

        ) : filteredApplications.length === 0 ? (

          <div className="my-applications-empty">

            <div className="my-applications-empty-icon">
              <Search size={27} />
            </div>

            <h2>
              No Matching Applications
            </h2>

            <p>
              Try changing your search or
              status filter.
            </p>

          </div>

        ) : (

          <div className="my-applications-list">

            {filteredApplications.map(
              (application) => {

                const job =
                  application.job;

                return (
                  <article
                    className="my-application-card"
                    key={application._id}
                  >

                    {/* Card Header */}

                    <div className="my-application-card-header">

                      <div className="my-application-job-info">

                        <div className="my-application-company-icon">
                          {job?.companyName
                            ?.charAt(0)
                            ?.toUpperCase() || (
                            <BriefcaseBusiness
                              size={20}
                            />
                          )}
                        </div>

                        <div>
                          <h2>
                            {job?.title ||
                              "Job no longer available"}
                          </h2>

                          <p>
                            {job?.companyName ||
                              "Company unavailable"}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`my-application-status status-${application.status}`}
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                    </div>

                    {/* Meta */}

                    <div className="my-application-meta">

                      <span>
                        <MapPin size={14} />
                        {job?.location ||
                          "Location unavailable"}
                      </span>

                      <span>
                        <CalendarDays size={14} />
                        Applied{" "}
                        {formatDate(
                          application.createdAt
                        )}
                      </span>

                    </div>

                    {/* Resume */}

                    {application.resumeUrl && (
                      <div className="my-application-resume">

                        <div>
                          <FileText size={17} />

                          <span>
                            Resume submitted
                          </span>
                        </div>

                        <a
                          href={
                            application.resumeUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>

                      </div>
                    )}

                    {/* Actions */}

                    <div className="my-application-actions">

                      {job?._id && (
                        <Link
                          to={`/jobs/${job._id}`}
                          className="my-application-view-job"
                        >
                          <Eye size={15} />
                          View Job
                        </Link>
                      )}

                    </div>

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

export default MyApplications;