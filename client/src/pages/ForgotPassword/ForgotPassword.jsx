import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  BriefcaseBusiness,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import api from "../../services/api.js";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setOtpLoading(true);

    try {
      const response = await api.post(
        "/otp/generate",
        {
          email,
          purpose: "forgot-password",
        }
      );

      setOtpSent(true);

      setSuccess(
        response.data?.message ||
          "OTP sent successfully. Check your email."
      );
    } catch (error) {
      console.error(
        "FORGOT PASSWORD OTP ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setResetLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      setResetSuccess(true);

      setSuccess(
        response.data?.message ||
          "Password reset successfully."
      );

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setResetLoading(false);
    }
  };

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (resetSuccess) {
    return (
      <main className="auth-page">
        <div className="auth-wrapper">

          {/* Brand */}

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
                Account secured
              </span>

              <h1>
                Your password
                <span> has been updated.</span>
              </h1>

              <p>
                Your HireHub password has been
                successfully changed. You can now
                login using your new password.
              </p>

            </div>

          </section>

          {/* Success Card */}

          <section className="auth-card">

            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
              }}
            >

              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                }}
              >
                <CheckCircle2 size={34} />
              </div>

              <h2>
                Password reset successful
              </h2>

              <p
                style={{
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                  lineHeight: "1.6",
                }}
              >
                Your password has been changed
                successfully.
              </p>

            </div>

            <button
              type="button"
              className="auth-submit"
              onClick={() => navigate("/login")}
            >
              Continue to Login
              <ArrowRight size={18} />
            </button>

          </section>

        </div>
      </main>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

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
              Account recovery
            </span>

            <h1>
              Forgot your password?
              <span> We've got you covered.</span>
            </h1>

            <p>
              Verify your email address and create
              a new password to get back into your
              HireHub account.
            </p>

          </div>

          <div className="auth-brand-footer">

            <div className="auth-brand-line"></div>

            <p>
              Secure account recovery with email OTP.
            </p>

          </div>

        </section>

        {/* Forgot Password Card */}

        <section className="auth-card">

          <div className="auth-card-header">

            <h2>
              Reset your password
            </h2>

            <p>
              Enter your registered email address
              to continue.
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
            onSubmit={handleResetPassword}
            className="auth-form"
          >

            {/* Email */}

            <div className="form-group">

              <label htmlFor="forgot-email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <Mail size={18} />

                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  required
                  disabled={otpSent}
                  autoComplete="email"
                />

              </div>

            </div>

            {/* Send OTP */}

            {!otpSent && (
              <button
                type="button"
                className="auth-submit"
                onClick={handleSendOtp}
                disabled={otpLoading}
              >
                {otpLoading
                  ? "Sending OTP..."
                  : "Send OTP"}

                {!otpLoading && (
                  <ArrowRight size={18} />
                )}
              </button>
            )}

            {/* OTP + Password */}

            {otpSent && (
              <>

                {/* OTP */}

                <div className="form-group">

                  <label htmlFor="forgot-otp">
                    Verification OTP
                  </label>

                  <div className="auth-input-wrapper">

                    <ShieldCheck size={18} />

                    <input
                      id="forgot-otp"
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

                {/* New Password */}

                <div className="form-group">

                  <label htmlFor="new-password">
                    New password
                  </label>

                  <div className="auth-input-wrapper">

                    <LockKeyhole size={18} />

                    <input
                      id="new-password"
                      type="password"
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(
                          e.target.value
                        );
                        setError("");
                      }}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />

                  </div>

                  <small className="auth-helper-text">
                    Password must contain at least
                    6 characters.
                  </small>

                </div>

                {/* Reset */}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={
                    resetLoading ||
                    otp.length !== 6 ||
                    newPassword.length < 6
                  }
                >
                  {resetLoading
                    ? "Resetting password..."
                    : "Reset Password"}

                  {!resetLoading && (
                    <ArrowRight size={18} />
                  )}
                </button>

                {/* Resend */}

                <button
                  type="button"
                  className="auth-secondary-button"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                >
                  {otpLoading
                    ? "Sending OTP..."
                    : "Resend OTP"}
                </button>

              </>
            )}

          </form>

          <div className="auth-divider">
            <span>
              Remember your password?
            </span>
          </div>

          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Back to Login
          </Link>

          <p className="auth-terms">
            Your password is securely encrypted and
            your OTP can only be used for a limited
            time.
          </p>

        </section>

      </div>

    </main>
  );
};

export default ForgotPassword;