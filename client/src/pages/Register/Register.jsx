import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  BriefcaseBusiness,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await api.post("/otp/generate", {
        email: formData.email,
        purpose: "registration",
      });

      setOtpSent(true);

      setSuccess(
        response.data?.message ||
          "OTP sent successfully. Check your email."
      );
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otpSent) {
      setError(
        "Please verify your email with an OTP first."
      );
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        otp
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
              Whether you're looking for your next
              opportunity or searching for talented
              people, HireHub helps you connect with
              the right people.
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

          {/* Error */}

          {error && (
            <div className="form-error auth-error">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="form-success auth-success">
              {success}
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

              <div
                className="auth-input-wrapper"
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >

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

              {/* Send OTP button */}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  otpLoading ||
                  !formData.email
                }
                className="auth-secondary-button"
                style={{
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                {otpLoading
                  ? "Sending OTP..."
                  : otpSent
                  ? "Resend OTP"
                  : "Send OTP"}
              </button>

            </div>

            {/* OTP */}

            {otpSent && (
              <div className="form-group">

                <label htmlFor="register-otp">
                  Verification OTP
                </label>

                <div className="auth-input-wrapper">

                  <ShieldCheck size={18} />

                  <input
                    id="register-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                      setError("");
                    }}
                    required
                    autoComplete="one-time-code"
                  />

                </div>

                <small className="auth-helper-text">
                  Enter the OTP sent to your email.
                </small>

              </div>
            )}

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

                {/* Job Seeker */}

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
                    checked={
                      formData.role === "jobseeker"
                    }
                    onChange={handleChange}
                  />

                  <UserRound size={18} />

                  <span>
                    <strong>
                      Job Seeker
                    </strong>

                    <small>
                      Find jobs and apply
                    </small>
                  </span>

                </label>

                {/* Recruiter */}

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
                    checked={
                      formData.role === "recruiter"
                    }
                    onChange={handleChange}
                  />

                  <BriefcaseBusiness size={18} />

                  <span>
                    <strong>
                      Recruiter
                    </strong>

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
              disabled={
                loading ||
                !otpSent
              }
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
            <span>
              Already have an account?
            </span>
          </div>

          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Login to HireHub
          </Link>

          <p className="auth-terms">
            By creating an account, you agree to provide
            accurate information and use HireHub responsibly.
          </p>

        </section>

      </div>
    </main>
  );
};

export default Register;