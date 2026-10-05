import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Logout
  const handleLogout = () => {
    logout();

    setMobileMenuOpen(false);

    navigate("/");
  };

  // Search jobs
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const searchValue = e.target.value.trim();

      if (searchValue) {
        navigate(`/jobs?search=${encodeURIComponent(searchValue)}`);

        closeMobileMenu();
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* =========================================
            LOGO
        ========================================= */}

        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="navbar-logo-icon">
            <BriefcaseBusiness size={21} />
          </span>

          <span className="navbar-logo-text">
            Hire<span>Hub</span>
          </span>
        </Link>

        {/* =========================================
            SEARCH
        ========================================= */}

        <div className="navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search jobs..."
            onKeyDown={handleSearch}
          />
        </div>

        {/* =========================================
            MOBILE MENU BUTTON
        ========================================= */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        {/* =========================================
            NAVIGATION
        ========================================= */}

        <div className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
          {/* Home */}

          <Link to="/" onClick={closeMobileMenu}>
            Home
          </Link>

          {/* Find Jobs */}

          <Link to="/jobs" onClick={closeMobileMenu}>
            Find Jobs
          </Link>

          {/* =========================================
              AUTHENTICATED USER
          ========================================= */}

          {isAuthenticated ? (
            <>
              {/* =====================================
                  JOB SEEKER
              ===================================== */}

              {user?.role === "jobseeker" && (
                <>
                  <Link to="/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </Link>

                  <Link to="/my-applications" onClick={closeMobileMenu}>
                    My Applications
                  </Link>

                  <Link to="/saved-jobs" onClick={closeMobileMenu}>
                    Saved Jobs
                  </Link>
                </>
              )}

              {/* =====================================
                  RECRUITER
              ===================================== */}

              {user?.role === "recruiter" && (
                <Link
                  to="/recruiter/dashboard"
                  className="navbar-dashboard-link"
                  onClick={closeMobileMenu}
                >
                  <LayoutDashboard size={17} />

                  <span>Dashboard</span>
                </Link>
              )}

              {/* =====================================
                  USER
              ===================================== */}

              <Link
                to="/profile"
                className="navbar-user"
                onClick={closeMobileMenu}
              >
                <span className="navbar-user-icon">
                  <User size={16} />
                </span>

                <span className="navbar-user-name">{user?.name || "User"}</span>
              </Link>

              {/* =====================================
                  LOGOUT
              ===================================== */}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />

                <span>Logout</span>
              </button>
            </>
          ) : (
            /* =======================================
               LOGGED OUT USER
            ======================================= */

            <>
              {/* Login */}

              <Link
                to="/login"
                className="navbar-login"
                onClick={closeMobileMenu}
              >
                Login
              </Link>

              {/* Get Started */}

              <Link
                to="/register"
                className="navbar-register"
                onClick={closeMobileMenu}
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
