import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Clock3,
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  Building2,
  IndianRupee,
  Users,
  CalendarDays,
} from "lucide-react";

import api from "../../services/api.js";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    employmentType: "",
    workplaceType: "",
    experienceLevel: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.location.trim()) {
        params.location = filters.location.trim();
      }

      if (filters.employmentType) {
        params.employmentType = filters.employmentType;
      }

      if (filters.workplaceType) {
        params.workplaceType = filters.workplaceType;
      }

      if (filters.experienceLevel) {
        params.experienceLevel = filters.experienceLevel;
      }

      const response = await api.get("/jobs", {
        params,
      });

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = async () => {
    const emptyFilters = {
      search: "",
      location: "",
      employmentType: "",
      workplaceType: "",
      experienceLevel: "",
    };

    setFilters(emptyFilters);

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/jobs");

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatText = (value) => {
    if (!value) return "";

    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatSalary = (job) => {
    if (job.salaryMin == null && job.salaryMax == null) {
      return "Salary not disclosed";
    }

    const currency =
      job.salaryCurrency === "INR" ? "₹" : job.salaryCurrency || "";

    const formatNumber = (number) => {
      return new Intl.NumberFormat("en-IN").format(number);
    };

    if (job.salaryMin != null && job.salaryMax != null) {
      return `${currency}${formatNumber(job.salaryMin)} - ${currency}${formatNumber(
        job.salaryMax
      )}`;
    }

    if (job.salaryMin != null) {
      return `From ${currency}${formatNumber(job.salaryMin)}`;
    }

    return `Up to ${currency}${formatNumber(job.salaryMax)}`;
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;

    return new Date(deadline).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="jobs-page">

      {/* Header */}

      <section className="jobs-header">
        <div className="jobs-header-content">

          <span className="jobs-header-badge">
            <Briefcase size={15} />
            Career Opportunities
          </span>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p>
            Explore jobs from companies looking for talented people
            like you.
          </p>

        </div>
      </section>

      {/* Search */}

      <section className="jobs-search-section">

        <form
          className="jobs-search-form"
          onSubmit={handleSearch}
        >

          <div className="jobs-search-input">
            <Search size={19} />

            <input
              type="text"
              name="search"
              placeholder="Job title, skills or company"
              value={filters.search}
              onChange={handleChange}
            />
          </div>

          <div className="jobs-search-input">
            <MapPin size={19} />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="jobs-search-button"
          >
            <Search size={18} />
            Search Jobs
          </button>

        </form>

        {/* Filters */}

        <div className="jobs-filters">

          <div className="jobs-filter-label">
            <SlidersHorizontal size={17} />
            <span>Filters</span>
          </div>

          <select
            name="employmentType"
            value={filters.employmentType}
            onChange={handleChange}
          >
            <option value="">Employment Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>

          <select
            name="workplaceType"
            value={filters.workplaceType}
            onChange={handleChange}
          >
            <option value="">Workplace Type</option>
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleChange}
          >
            <option value="">Experience Level</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="lead">Lead</option>
          </select>

          <button
            type="button"
            className="jobs-clear-button"
            onClick={clearFilters}
          >
            <RotateCcw size={16} />
            Clear
          </button>

        </div>

      </section>

      {/* Results */}

      <section className="jobs-results-section">

        <div className="jobs-results-header">

          <div>
            <h2>Available Jobs</h2>

            {!loading && !error && (
              <p>
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
              </p>
            )}
          </div>

        </div>

        {/* Loading */}

        {loading && (
          <div className="jobs-state">

            <div className="jobs-loader"></div>

            <h3>Finding opportunities...</h3>

            <p>
              Please wait while we load the latest jobs.
            </p>

          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="jobs-state jobs-error-state">

            <div className="jobs-state-icon">
              <Briefcase size={24} />
            </div>

            <h3>Unable to load jobs</h3>

            <p>{error}</p>

            <button
              type="button"
              className="jobs-retry-button"
              onClick={fetchJobs}
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty */}

        {!loading && !error && jobs.length === 0 && (
          <div className="jobs-state">

            <div className="jobs-state-icon">
              <Search size={25} />
            </div>

            <h3>No jobs found</h3>

            <p>
              Try changing your search or removing some filters.
            </p>

            <button
              type="button"
              className="jobs-retry-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        )}

        {/* Jobs */}

        {!loading && !error && jobs.length > 0 && (
          <div className="jobs-grid">

            {jobs.map((job) => (
              <article
                className="job-card"
                key={job._id}
              >

                {/* Card Top */}

                <div className="job-card-top">

                  <div className="job-company-icon">

                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.companyName} logo`}
                      />
                    ) : (
                      <Building2 size={23} />
                    )}

                  </div>

                  <div className="job-card-badges">

                    <span className="job-workplace-badge">
                      {formatText(job.workplaceType)}
                    </span>

                    {job.category && (
                      <span className="job-category-badge">
                        {job.category}
                      </span>
                    )}

                  </div>

                </div>

                {/* Main Content */}

                <div className="job-card-content">

                  <h3>{job.title}</h3>

                  <p className="job-company-name">
                    {job.companyName}
                  </p>

                  <div className="job-meta">

                    <span>
                      <MapPin size={15} />
                      {job.location || "Location not specified"}
                    </span>

                    <span>
                      <Briefcase size={15} />
                      {formatText(job.employmentType)}
                    </span>

                    <span>
                      <Clock3 size={15} />
                      {formatText(job.experienceLevel)}
                    </span>

                  </div>

                  {/* Salary */}

                  <div className="job-salary">

                    <IndianRupee size={17} />

                    <span>
                      {formatSalary(job)}
                    </span>

                  </div>

                  {/* Skills */}

                  {job.skills?.length > 0 && (
                    <div className="job-skills">

                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span key={`${skill}-${index}`}>
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 4 && (
                        <span>
                          +{job.skills.length - 4}
                        </span>
                      )}

                    </div>
                  )}

                </div>

                {/* Additional Information */}

                <div className="job-card-info">

                  {job.openings && (
                    <span>
                      <Users size={15} />
                      {job.openings}{" "}
                      {job.openings === 1 ? "opening" : "openings"}
                    </span>
                  )}

                  {job.applicationDeadline && (
                    <span>
                      <CalendarDays size={15} />
                      Apply by {formatDeadline(job.applicationDeadline)}
                    </span>
                  )}

                </div>

                {/* Footer */}

                <div className="job-card-footer">

                  <Link
                    to={`/jobs/${job._id}`}
                    className="job-view-button"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
};

export default Jobs;