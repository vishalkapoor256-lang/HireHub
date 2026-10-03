import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  MapPin,
  Users,
  Wallet,
  X,
} from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

        {/* PAGE HEADER */}

        <div className="create-job-header">

          <button
            type="button"
            className="create-job-back"
            onClick={() => navigate("/recruiter/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="create-job-title-row">

            <div className="create-job-title-icon">
              <BriefcaseBusiness size={25} />
            </div>

            <div>
              <span className="create-job-eyebrow">
                Recruiter
              </span>

              <h1>Create a New Job</h1>

              <p>
                Add a job opportunity and start finding
                qualified candidates.
              </p>
            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="create-job-error">
            <X size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}

        <form
          className="create-job-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="create-job-section">

            <div className="create-job-section-header">

              <div className="create-job-section-icon">
                <Building2 size={19} />
              </div>

              <div>
                <h2>Basic Information</h2>
                <p>
                  Provide the main information about the
                  position.
                </p>
              </div>

            </div>

            <div className="create-job-fields">

              <div className="create-job-field full-width">

                <label htmlFor="title">
                  Job Title <span>*</span>
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

              </div>

              <div className="create-job-field">

                <label htmlFor="companyName">
                  Company Name <span>*</span>
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

              </div>

              <div className="create-job-field">

                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <div className="create-job-input-icon">
                  <MapPin size={17} />

                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="e.g. Shimla, Himachal Pradesh"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="create-job-field">

                <label htmlFor="employmentType">
                  Employment Type <span>*</span>
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

              </div>

              <div className="create-job-field">

                <label htmlFor="workplaceType">
                  Workplace Type <span>*</span>
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

              </div>

              <div className="create-job-field">

                <label htmlFor="category">
                  Category <span>*</span>
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

              </div>

              <div className="create-job-field">

                <label htmlFor="experienceLevel">
                  Experience Level <span>*</span>
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

              </div>

            </div>

          </section>

          {/* SALARY */}

          <section className="create-job-section">

            <div className="create-job-section-header">

              <div className="create-job-section-icon">
                <Wallet size={19} />
              </div>

              <div>
                <h2>Salary & Compensation</h2>
                <p>
                  Add the expected salary range for this position.
                </p>
              </div>

            </div>

            <div className="create-job-fields salary-fields">

              <div className="create-job-field">

                <label htmlFor="salaryMin">
                  Minimum Salary
                </label>

                <div className="salary-input-wrapper">

                  <span>₹</span>

                  <input
                    id="salaryMin"
                    type="number"
                    name="salaryMin"
                    placeholder="300000"
                    min="0"
                    value={formData.salaryMin}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="create-job-field">

                <label htmlFor="salaryMax">
                  Maximum Salary
                </label>

                <div className="salary-input-wrapper">

                  <span>₹</span>

                  <input
                    id="salaryMax"
                    type="number"
                    name="salaryMax"
                    placeholder="600000"
                    min="0"
                    value={formData.salaryMax}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="create-job-field">

                <label htmlFor="salaryCurrency">
                  Currency
                </label>

                <input
                  id="salaryCurrency"
                  type="text"
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  readOnly
                />

              </div>

            </div>

          </section>

          {/* JOB DESCRIPTION */}

          <section className="create-job-section">

            <div className="create-job-section-header">

              <div className="create-job-section-icon">
                <FileText size={19} />
              </div>

              <div>
                <h2>Job Details</h2>
                <p>
                  Describe the role, requirements and
                  responsibilities.
                </p>
              </div>

            </div>

            <div className="create-job-fields">

              <div className="create-job-field full-width">

                <label htmlFor="description">
                  Job Description <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="7"
                  placeholder="Describe the role, team, goals and what the candidate will be working on..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="create-job-field">

                <label htmlFor="requirements">
                  Requirements
                </label>

                <textarea
                  id="requirements"
                  name="requirements"
                  rows="7"
                  placeholder={
                    "Enter one requirement per line...\n\nBasic knowledge of React\nUnderstanding of JavaScript\nGit and GitHub knowledge"
                  }
                  value={formData.requirements}
                  onChange={handleChange}
                />

                <small>
                  Enter each requirement on a new line.
                </small>

              </div>

              <div className="create-job-field">

                <label htmlFor="responsibilities">
                  Responsibilities
                </label>

                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows="7"
                  placeholder={
                    "Enter one responsibility per line...\n\nBuild React components\nWork with backend APIs\nFix UI bugs"
                  }
                  value={formData.responsibilities}
                  onChange={handleChange}
                />

                <small>
                  Enter each responsibility on a new line.
                </small>

              </div>

              <div className="create-job-field full-width">

                <label htmlFor="skills">
                  Required Skills
                </label>

                <input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="JavaScript, React.js, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                />

                <small>
                  Separate skills with commas.
                </small>

              </div>

            </div>

          </section>

          {/* APPLICATION SETTINGS */}

          <section className="create-job-section">

            <div className="create-job-section-header">

              <div className="create-job-section-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <h2>Application Settings</h2>
                <p>
                  Configure how candidates can apply for
                  this position.
                </p>
              </div>

            </div>

            <div className="create-job-fields">

              <div className="create-job-field">

                <label htmlFor="applicationDeadline">
                  Application Deadline
                </label>

                <div className="create-job-input-icon">

                  <CalendarDays size={17} />

                  <input
                    id="applicationDeadline"
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="create-job-field">

                <label htmlFor="openings">
                  Number of Openings <span>*</span>
                </label>

                <div className="create-job-input-icon">

                  <Users size={17} />

                  <input
                    id="openings"
                    type="number"
                    name="openings"
                    min="1"
                    value={formData.openings}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="create-job-field">

                <label htmlFor="status">
                  Job Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="published">
                    Published
                  </option>

                  <option value="draft">
                    Draft
                  </option>
                </select>

              </div>

            </div>

          </section>

          {/* FORM ACTIONS */}

          <div className="create-job-actions">

            <button
              type="button"
              className="create-job-cancel"
              onClick={() =>
                navigate("/recruiter/dashboard")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-job-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="create-job-spinner"></span>
                  Creating Job...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Create Job
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
};

export default RecruiterCreateJob;