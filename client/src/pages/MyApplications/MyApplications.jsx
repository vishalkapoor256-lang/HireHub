import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";

const MyApplications = () => {
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

  if (loading) {
    return (
      <main className="my-applications-page">
        <h1>My Applications</h1>
        <p>Loading applications...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-applications-page">
        <h1>My Applications</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="my-applications-page">
      <h1>My Applications</h1>

      <p>
        Track the jobs you have applied for and check your
        application status.
      </p>

      {applications.length === 0 ? (
        <div>
          <p>You haven't applied for any jobs yet.</p>

          <Link to="/jobs">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application._id}
            >
              <h2>
                {application.job?.title ||
                  "Job no longer available"}
              </h2>

              <p>
                <strong>Company:</strong>{" "}
                {application.job?.companyName || "N/A"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.job?.location || "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge status-${application.status}`}>
                    {application.status}
                </span>
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>

              {application.resumeUrl && (
                <p>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              )}

              {application.job?._id && (
                <Link
                  to={`/jobs/${application.job._id}`}
                >
                  View Job
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyApplications;