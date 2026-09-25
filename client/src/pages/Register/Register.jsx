import { Link } from "react-router-dom";

const Register = () => {
  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Join HireHub and find your next opportunity.</p>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>I am a</label>

          <select>
            <option value="jobseeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button type="submit">
            Create Account
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </main>
  );
};

export default Register;