import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>Login to continue to HireHub.</p>

        <form>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </main>
  );
};

export default Login;