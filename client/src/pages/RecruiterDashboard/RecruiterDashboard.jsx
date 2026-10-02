import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        console.error("Failed to fetch recruiter jobs:", error);

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

  if (loading) {
    return (
      <main className="recruiter-dashboard">
        <h1>Recruiter Dashboard</h1>
        <p>Loading your jobs...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="recruiter-dashboard">
        <h1>Recruiter Dashboard</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="recruiter-dashboard">
      <h1>Recruiter Dashboard</h1>

      <p>
        Manage your jobs and applications from one place.
      </p>

      <section className="dashboard-stats">
        <div>
          <h2>{totalJobs}</h2>
          <p>Total Jobs</p>
        </div>

        <div>
          <h2>0</h2>
          <p>Total Applications</p>
        </div>

        <div>
          <h2>{activeJobs}</h2>
          <p>Active Jobs</p>
        </div>
      </section>

      <section className="my-jobs-section">
  <div className="section-header">
    <div>
      <h2>My Jobs</h2>
      <p>Manage the jobs you have posted.</p>
    </div>

    <Link
      to="/recruiter/jobs/create"
      className="create-job-button"
    >
      + Create Job
    </Link>
  </div>

        {jobs.length === 0 ? (
          <div>
            <p>You haven't posted any jobs yet.</p>

            <Link to="/recruiter/jobs/create">
              Create Your First Job
            </Link>
          </div>
        ) : (
          <div className="recruiter-jobs-list">
            {jobs.map((job) => (
              <div
                className="recruiter-job-card"
                key={job._id}
              >
                <h3>{job.title}</h3>

                <p>
                  <strong>Company:</strong>{" "}
                  {job.companyName}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {job.location}
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {job.employmentType}
                </p>

                <p>
                  <strong>Workplace:</strong>{" "}
                  {job.workplaceType}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {job.status}
                </p>

                <p>
                  <strong>Posted:</strong>{" "}
                  {new Date(
                    job.createdAt
                  ).toLocaleDateString()}
                </p>

                <div className="recruiter-job-actions">
  <Link to={`/jobs/${job._id}`}>
    View Job
  </Link>

  <Link to={`/recruiter/jobs/${job._id}/applicants`}>
    View Applicants
  </Link>
</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default RecruiterDashboard;