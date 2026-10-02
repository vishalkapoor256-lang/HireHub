import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <main className="jobs-page">

      <h1>Find Jobs</h1>

      <p>
        Discover opportunities that match your skills and career goals.
      </p>

      {/* Search and Filters */}

      <form onSubmit={handleSearch}>

        <input
          type="text"
          name="search"
          placeholder="Search jobs, skills or companies..."
          value={filters.search}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />

        <select
          name="employmentType"
          value={filters.employmentType}
          onChange={handleChange}
        >
          <option value="">All Employment Types</option>
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
          <option value="">All Workplace Types</option>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          name="experienceLevel"
          value={filters.experienceLevel}
          onChange={handleChange}
        >
          <option value="">All Experience Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead</option>
        </select>

        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={clearFilters}
        >
          Clear
        </button>

      </form>

      {/* Loading */}

      {loading && (
        <p>Loading jobs...</p>
      )}

      {/* Error */}

      {!loading && error && (
        <p>{error}</p>
      )}

      {/* Jobs */}

      {!loading && !error && (
        <>
          {jobs.length === 0 ? (
            <p>No jobs found matching your search.</p>
          ) : (
            <div className="jobs-list">

              {jobs.map((job) => (
                <div
                  className="job-card"
                  key={job._id}
                >

                  <h2>{job.title}</h2>

                  <p>{job.companyName}</p>

                  <p>{job.location}</p>

                  <p>
                    {job.employmentType} · {job.workplaceType}
                  </p>

                  <p>
                    {job.experienceLevel}
                  </p>

                  <Link to={`/jobs/${job._id}`}>
                    View Details
                  </Link>

                </div>
              ))}

            </div>
          )}
        </>
      )}

    </main>
  );
};

export default Jobs;