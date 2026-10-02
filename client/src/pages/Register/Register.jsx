import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  BriefcaseBusiness,
  UserPlus,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
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
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      navigate("/");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-wrapper">

        {/* Brand Section */}

        <section className="auth-brand">

          <div className="auth-brand-logo">
            <span className="auth-logo-icon">
              <BriefcaseBusiness size={24} />
            </span>

            <span>
              Hire<span>Hub</span>
            </span>
          </div>

          <div className="auth-brand-content">

            <span className="auth-brand-badge">
              Build your career with HireHub
            </span>

            <h1>
              Create your account.
              <span> Start your journey.</span>
            </h1>

            <p>
              Whether you're looking for your next opportunity or
              searching for talented people, HireHub helps you
              connect with the right people.
            </p>

          </div>

          <div className="auth-brand-footer">

            <div className="auth-brand-line"></div>

            <p>
              One account. New opportunities.
            </p>

          </div>

        </section>

        {/* Register Card */}

        <section className="auth-card">

          <div className="auth-card-header">

            <h2>Create your account</h2>

            <p>
              Join HireHub and get started today.
            </p>

          </div>

          {error && (
            <div className="form-error auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* Name */}

            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="auth-input-wrapper">

                <UserRound size={18} />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />

              </div>

            </div>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <Mail size={18} />

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Password */}

            <div className="form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />

              </div>

              <small className="auth-helper-text">
                Password must contain at least 6 characters.
              </small>

            </div>

            {/* Role */}

            <div className="form-group">

              <label htmlFor="role">
                I am a
              </label>

              <div className="auth-role-options">

                <label
                  className={`auth-role-option ${
                    formData.role === "jobseeker"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="jobseeker"
                    checked={formData.role === "jobseeker"}
                    onChange={handleChange}
                  />

                  <UserRound size={18} />

                  <span>
                    <strong>Job Seeker</strong>
                    <small>
                      Find jobs and apply
                    </small>
                  </span>

                </label>

                <label
                  className={`auth-role-option ${
                    formData.role === "recruiter"
                      ? "active"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === "recruiter"}
                    onChange={handleChange}
                  />

                  <BriefcaseBusiness size={18} />

                  <span>
                    <strong>Recruiter</strong>
                    <small>
                      Post jobs and hire talent
                    </small>
                  </span>

                </label>

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create HireHub Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Login to HireHub
          </Link>

          <p className="auth-terms">
            By creating an account, you agree to provide accurate
            information and use HireHub responsibly.
          </p>

        </section>

      </div>
    </main>
  );
};

export default Register;