import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const RecruiterCreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    employmentType: "",
    workplaceType: "",
    category: "",
    experienceLevel: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "INR",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: "",
    applicationDeadline: "",
    openings: 1,
    status: "published",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("hirehub_token");

      if (!token) {
        setError("You must be logged in as a recruiter.");
        return;
      }

      const payload = {
        title: formData.title.trim(),
        companyName: formData.companyName.trim(),
        location: formData.location.trim(),
        employmentType: formData.employmentType,
        workplaceType: formData.workplaceType,
        category: formData.category.trim(),
        experienceLevel: formData.experienceLevel,

        salaryMin:
          formData.salaryMin === ""
            ? null
            : Number(formData.salaryMin),

        salaryMax:
          formData.salaryMax === ""
            ? null
            : Number(formData.salaryMax),

        salaryCurrency: formData.salaryCurrency,

        description: formData.description.trim(),

        requirements: formData.requirements
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        responsibilities: formData.responsibilities
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        applicationDeadline:
          formData.applicationDeadline || null,

        openings: Number(formData.openings),

        status: formData.status,
      };

      await api.post("/jobs", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/recruiter/dashboard");
    } catch (error) {
      console.error("Create job error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-job-page">
      <div className="create-job-container">
        <h1>Create New Job</h1>

        <p>
          Add a new job opportunity to HireHub.
        </p>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* BASIC INFORMATION */}

          <section>
            <h2>Basic Information</h2>

            <label htmlFor="title">
              Job Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Frontend Developer"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="companyName">
              Company Name
            </label>

            <input
              id="companyName"
              type="text"
              name="companyName"
              placeholder="e.g. HireHub Technologies"
              value={formData.companyName}
              onChange={handleChange}
              required
            />

            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              name="location"
              placeholder="e.g. Shimla, Himachal Pradesh"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <label htmlFor="employmentType">
              Employment Type
            </label>

            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
            >
              <option value="">
                Select employment type
              </option>

              <option value="full-time">
                Full Time
              </option>

              <option value="part-time">
                Part Time
              </option>

              <option value="contract">
                Contract
              </option>

              <option value="internship">
                Internship
              </option>

              <option value="freelance">
                Freelance
              </option>
            </select>

            <label htmlFor="workplaceType">
              Workplace Type
            </label>

            <select
              id="workplaceType"
              name="workplaceType"
              value={formData.workplaceType}
              onChange={handleChange}
              required
            >
              <option value="">
                Select workplace type
              </option>

              <option value="onsite">
                Onsite
              </option>

              <option value="remote">
                Remote
              </option>

              <option value="hybrid">
                Hybrid
              </option>
            </select>

            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              type="text"
              name="category"
              placeholder="e.g. Web Development"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <label htmlFor="experienceLevel">
              Experience Level
            </label>

            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              required
            >
              <option value="">
                Select experience level
              </option>

              <option value="entry">
                Entry Level
              </option>

              <option value="mid">
                Mid Level
              </option>

              <option value="senior">
                Senior Level
              </option>

              <option value="lead">
                Lead
              </option>
            </select>
          </section>

          {/* SALARY */}

          <section>
            <h2>Salary</h2>

            <label htmlFor="salaryMin">
              Minimum Salary
            </label>

            <input
              id="salaryMin"
              type="number"
              name="salaryMin"
              placeholder="300000"
              min="0"
              value={formData.salaryMin}
              onChange={handleChange}
            />

            <label htmlFor="salaryMax">
              Maximum Salary
            </label>

            <input
              id="salaryMax"
              type="number"
              name="salaryMax"
              placeholder="600000"
              min="0"
              value={formData.salaryMax}
              onChange={handleChange}
            />

            <label htmlFor="salaryCurrency">
              Currency
            </label>

            <input
              id="salaryCurrency"
              type="text"
              name="salaryCurrency"
              value={formData.salaryCurrency}
              onChange={handleChange}
              readOnly
            />
          </section>

          {/* JOB DETAILS */}

          <section>
            <h2>Job Details</h2>

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="6"
              placeholder="Describe the job..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <label htmlFor="requirements">
              Requirements
            </label>

            <textarea
              id="requirements"
              name="requirements"
              rows="6"
              placeholder={
                "Enter one requirement per line...\n" +
                "Basic knowledge of React\n" +
                "Understanding of JavaScript\n" +
                "Git and GitHub knowledge"
              }
              value={formData.requirements}
              onChange={handleChange}
            />

            <label htmlFor="responsibilities">
              Responsibilities
            </label>

            <textarea
              id="responsibilities"
              name="responsibilities"
              rows="6"
              placeholder={
                "Enter one responsibility per line...\n" +
                "Build React components\n" +
                "Work with backend APIs\n" +
                "Fix UI bugs"
              }
              value={formData.responsibilities}
              onChange={handleChange}
            />

            <label htmlFor="skills">
              Skills
            </label>

            <input
              id="skills"
              type="text"
              name="skills"
              placeholder="JavaScript, React.js, Node.js"
              value={formData.skills}
              onChange={handleChange}
            />
          </section>

          {/* APPLICATION SETTINGS */}

          <section>
            <h2>Application Settings</h2>

            <label htmlFor="applicationDeadline">
              Application Deadline
            </label>

            <input
              id="applicationDeadline"
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
            />

            <label htmlFor="openings">
              Number of Openings
            </label>

            <input
              id="openings"
              type="number"
              name="openings"
              min="1"
              value={formData.openings}
              onChange={handleChange}
              required
            />

            <label htmlFor="status">
              Job Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </section>

          {/* BUTTONS */}

          <div className="create-job-actions">
            <button
              type="button"
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating Job..."
                : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RecruiterCreateJob;