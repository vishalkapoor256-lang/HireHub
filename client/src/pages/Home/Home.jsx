import {
  Search,
  ArrowRight,
  Briefcase,
  Users,
  Building2,
  CheckCircle2,
  UserPlus,
  FileSearch,
  Send,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const query = params.toString();

    navigate(query ? `/jobs?${query}` : "/jobs");
  };

  return (
    <main className="home-page">

      {/* =========================================
          HERO SECTION
      ========================================== */}

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            <CheckCircle2 size={15} />
            Find your next opportunity
          </span>

          <h1>
            Build your career.
            <br />
            Find your <span>dream job.</span>
          </h1>

          <p>
            Discover opportunities from growing companies and connect
            with jobs that match your skills, experience, and career goals.
          </p>

          <form
            className="hero-search"
            onSubmit={handleSearch}
          >

            <div>
              <Search size={20} />

              <input
                type="text"
                placeholder="Job title, skills or keywords"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit">
              Search Jobs
              <ArrowRight size={18} />
            </button>

          </form>

          <div className="hero-popular">
            <span>Popular:</span>

            <Link to="/jobs?search=React">
              React
            </Link>

            <Link to="/jobs?search=JavaScript">
              JavaScript
            </Link>

            <Link to="/jobs?search=Node.js">
              Node.js
            </Link>

            <Link to="/jobs?search=Python">
              Python
            </Link>
          </div>

        </div>
      </section>


      {/* =========================================
          STATS SECTION
      ========================================== */}

      <section className="stats">

        <div className="stat-card">
          <div className="stat-icon">
            <Briefcase size={24} />
          </div>

          <div>
            <h2>10K+</h2>
            <p>Active Jobs</p>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <Building2 size={24} />
          </div>

          <div>
            <h2>2K+</h2>
            <p>Companies</p>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>

          <div>
            <h2>50K+</h2>
            <p>Job Seekers</p>
          </div>
        </div>

      </section>


      {/* =========================================
          WHY HIREHUB
      ========================================== */}

      <section className="home-section">

        <div className="section-heading">
          <span>WHY HIREHUB</span>

          <h2>
            Everything you need to find
            <br />
            your next opportunity
          </h2>

          <p>
            HireHub makes job searching simple, organized, and
            focused on helping you move forward in your career.
          </p>
        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <Search size={24} />
            </div>

            <h3>Discover Opportunities</h3>

            <p>
              Search and filter jobs based on skills, location,
              workplace type, experience level, and employment type.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <Send size={24} />
            </div>

            <h3>Apply Easily</h3>

            <p>
              Submit applications directly through HireHub and
              keep track of your applications in one place.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <Users size={24} />
            </div>

            <h3>Connect With Recruiters</h3>

            <p>
              Help your profile get noticed by recruiters searching
              for candidates with the right skills.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================== */}

      <section className="how-it-works">

        <div className="section-heading">
          <span>HOW IT WORKS</span>

          <h2>
            Start your job search
            <br />
            in three simple steps
          </h2>
        </div>


        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <FileSearch size={24} />
            </div>

            <h3>Search Jobs</h3>

            <p>
              Explore jobs that match your skills,
              experience, and preferred location.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <Send size={24} />
            </div>

            <h3>Apply</h3>

            <p>
              Review job details and submit your
              application with your resume.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <UserPlus size={24} />
            </div>

            <h3>Get Connected</h3>

            <p>
              Recruiters can review your application
              and move you through their hiring process.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================
          RECRUITER CTA
      ========================================== */}

      <section className="recruiter-cta">

        <div>

          <span>FOR EMPLOYERS</span>

          <h2>
            Find talented people
            <br />
            for your team.
          </h2>

          <p>
            Create job openings, review applications,
            manage candidates, and organize your hiring
            process from one dashboard.
          </p>

        </div>

        <Link
          to="/register"
          className="cta-button"
        >
          Start Hiring
          <ArrowRight size={18} />
        </Link>

      </section>


      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="final-cta">

        <div>

          <h2>
            Your next opportunity
            <br />
            could be one search away.
          </h2>

          <p>
            Explore jobs and take the next step in your career.
          </p>

          <Link
            to="/jobs"
            className="final-cta-button"
          >
            Explore Jobs
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Home;