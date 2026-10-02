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

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <BriefcaseBusiness size={28} />
          <span>HireHub</span>
        </Link>

        {/* Search */}
        <div className="navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search jobs..."
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

          {/* Logged-in user */}
          {isAuthenticated ? (
            <>
              {/* Job Seeker */}
              {user?.role === "jobseeker" && (
                <Link to="/my-applications">
                  My Applications
                </Link>
              )}

              {/* Recruiter */}
              {user?.role === "recruiter" && (
                <Link to="/recruiter/dashboard">
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
              )}

              {/* User info */}
              <span className="navbar-user">
                <User size={17} />

                <span>
                  {user?.name || "User"}
                </span>
              </span>

              {/* Logout */}
              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Guest */}
              <Link to="/login">
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