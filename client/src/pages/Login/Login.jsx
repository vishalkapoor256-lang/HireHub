import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // STEP 1: EMAIL + PASSWORD
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await login(
        formData.email,
        formData.password
      );

      // Login API should now return requiresOtp
      if (response?.requiresOtp) {
        setOtpSent(true);
        setSuccess(
          "OTP sent to your email. Please enter it below."
        );
        return;
      }

      // Fallback in case OTP is not required
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

  // ==========================================
  // STEP 2: VERIFY LOGIN OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-login-otp",
        {
          email: formData.email,
          otp,
        }
      );

      const {
        token,
        user,
      } = response.data;

      // Store JWT
      localStorage.setItem(
        "hirehub_token",
        token
      );

      // Refresh AuthContext user
      // by reloading the current authenticated state
      window.location.href = "/";

    } catch (error) {
      console.error(
        "OTP VERIFICATION ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setOtpLoading(true);

    try {
      await api.post("/otp/generate", {
        email: formData.email,
        purpose: "login",
      });

      setOtp("");

      setSuccess(
        "A new OTP has been sent to your email."
      );
    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBackToLogin = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setSuccess("");
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

          {!otpSent ? (

            <>
              {/* ==============================
                  LOGIN FORM
              ============================== */}

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

              {success && (
                <div
                  style={{
                    padding: "10px 12px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: "#ecfdf5",
                    color: "#047857",
                    fontSize: "14px",
                  }}
                >
                  {success}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="auth-form"
              >

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

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >

                    <label htmlFor="password">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      style={{
                        fontSize: "13px",
                        color: "var(--primary)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Forgot password?
                    </Link>

                  </div>

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
                    "Verifying..."
                  ) : (
                    <>
                      Continue to Login
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
            </>

          ) : (

            <>
              {/* ==============================
                  OTP VERIFICATION
              ============================== */}

              <div className="auth-card-header">

                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <ShieldCheck size={26} />
                </div>

                <h2>Verify your login</h2>

                <p>
                  We've sent a 6-digit OTP to
                </p>

                <p
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginTop: "4px",
                  }}
                >
                  {formData.email}
                </p>

              </div>

              {error && (
                <div className="form-error auth-error">
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    padding: "10px 12px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    background: "#ecfdf5",
                    color: "#047857",
                    fontSize: "14px",
                  }}
                >
                  {success}
                </div>
              )}

              <form
                onSubmit={handleVerifyOtp}
                className="auth-form"
              >

                {/* OTP */}
                <div className="form-group">

                  <label htmlFor="login-otp">
                    Enter OTP
                  </label>

                  <div className="auth-input-wrapper">

                    <ShieldCheck size={18} />

                    <input
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        const value =
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);

                        setOtp(value);
                        setError("");
                      }}
                      required
                      autoComplete="one-time-code"
                    />

                  </div>

                </div>

                {/* Verify */}
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={
                    otpLoading ||
                    otp.length !== 6
                  }
                >
                  {otpLoading ? (
                    "Verifying OTP..."
                  ) : (
                    <>
                      Verify & Login
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

              {/* Resend */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "18px",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                Didn't receive the OTP?{" "}

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={otpLoading}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    color: "var(--primary)",
                    fontWeight: "600",
                    cursor: otpLoading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  Resend OTP
                </button>
              </div>

              {/* Back */}
              <button
                type="button"
                onClick={handleBackToLogin}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "8px",
                }}
              >
                ← Back to login
              </button>

            </>
          )}

        </section>

      </div>
    </main>
  );
};

export default Login;