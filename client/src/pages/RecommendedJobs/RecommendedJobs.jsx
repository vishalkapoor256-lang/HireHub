import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Briefcase,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api.js";

import "./RecommendedJobs.css";

const RecommendedJobs = () => {
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("hirehub_token");

        const response = await api.get("/job-matching/recommended", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error("Failed to fetch recommended jobs:", error);

        setError(
          error.response?.data?.message || "Failed to load recommended jobs.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, []);

  if (loading) {
    return (
      <main className="recommended-jobs-page">
        <div className="recommended-jobs-container">
          <div className="recommended-loading">
            <div className="recommended-spinner"></div>

            <p>Finding the best jobs for you...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="recommended-jobs-page">
        <div className="recommended-jobs-container">
          <div className="recommended-error">
            <AlertCircle size={22} />

            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="recommended-jobs-page">
      <div className="recommended-jobs-container">
        <section className="recommended-header">
          <div>
            <div className="recommended-title-icon">
              <Sparkles size={22} />
            </div>

            <h1>Recommended Jobs</h1>

            <p>Jobs matched with your skills and experience.</p>
          </div>
        </section>

        {recommendations.length === 0 ? (
          <section className="recommended-empty">
            <div className="recommended-empty-icon">
              <Sparkles size={28} />
            </div>

            <h2>No matching jobs found</h2>

            <p>
              Add more skills to your profile or check back when new jobs are
              posted.
            </p>

            <Link to="/profile" className="recommended-profile-button">
              Update Profile
            </Link>
          </section>
        ) : (
          <section className="recommended-list">
            {recommendations.map((item) => {
              const job = item.job;

              return (
                <article className="recommended-card" key={job._id}>
                  <div className="recommended-card-main">
                    <div className="recommended-company-logo">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} />
                      ) : (
                        <span>{job.companyName?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>

                    <div className="recommended-job-info">
                      <h2>{job.title}</h2>

                      <p className="recommended-company">{job.companyName}</p>

                      <div className="recommended-meta">
                        {job.location && (
                          <span>
                            <MapPin size={16} />
                            {job.location}
                          </span>
                        )}

                        {job.employmentType && (
                          <span>
                            <Briefcase size={16} />
                            {job.employmentType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="match-score">
                      <span>Match</span>

                      <strong>{item.matchScore}%</strong>
                    </div>
                  </div>

                  <div className="recommended-card-bottom">
                    <div className="recommended-skills">
                      {item.matchedSkills?.length > 0 && (
                        <div className="skill-group">
                          <span className="skill-group-label">Matched:</span>

                          <div className="matched-skills">
                            {item.matchedSkills.slice(0, 5).map((skill) => (
                              <span key={skill}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.missingSkills?.length > 0 && (
                        <div className="skill-group">
                          <span className="skill-group-label missing-label">
                            Missing:
                          </span>

                          <div className="missing-skills">
                            {item.missingSkills.slice(0, 5).map((skill) => (
                              <span key={skill}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Link to={`/jobs/${job._id}`} className="view-job-button">
                      View Job
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
};

export default RecommendedJobs;
