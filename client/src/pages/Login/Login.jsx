import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BriefcaseBusiness, LockKeyhole, Mail, ArrowRight } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await login(
        formData.email,
        formData.password
      );

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-wrapper">

        {/* Left Branding Section */}
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
              Find your next opportunity
            </span>

            <h1>
              Your next career move
              <span> starts here.</span>
            </h1>

            <p>
              Discover meaningful opportunities, connect with great
              companies, and take the next step in your career.
            </p>
          </div>

          <div className="auth-brand-footer">
            <div className="auth-brand-line"></div>

            <p>
              Trusted platform for job seekers and recruiters.
            </p>
          </div>
        </section>

        {/* Login Card */}
        <section className="auth-card">

          <div className="auth-card-header">
            <h2>Welcome back</h2>

            <p>
              Login to your HireHub account to continue.
            </p>
          </div>

          {error && (
            <div className="form-error auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">

            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
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

              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login to HireHub
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          <div className="auth-divider">
            <span>New to HireHub?</span>
          </div>

          <Link
            to="/register"
            className="auth-secondary-button"
          >
            Create an account
          </Link>

          <p className="auth-terms">
            By continuing, you agree to use HireHub responsibly
            and provide accurate account information.
          </p>

        </section>

      </div>
    </main>
  );
};

export default Login;