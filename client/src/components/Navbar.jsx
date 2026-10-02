import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Search,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">
            <BriefcaseBusiness size={21} />
          </span>

          <span className="navbar-logo-text">
            Hire<span>Hub</span>
          </span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search jobs..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/jobs?search=${e.target.value}`);
              }
            }}
          />
        </div>

        {/* Navigation */}
        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Find Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {/* Job Seeker */}
              {user?.role === "jobseeker" && (
                <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/my-applications">
                  My Applications
                </Link>
                </>
              )}

              {/* Recruiter */}
              {user?.role === "recruiter" && (
                <Link
                  to="/recruiter/dashboard"
                  className="navbar-dashboard-link"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              {/* User */}
              <div className="navbar-user">
                <span className="navbar-user-icon">
                  <User size={16} />
                </span>

                <span className="navbar-user-name">
                  {user?.name || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-login">
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;