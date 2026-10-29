import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEnvelope, FaLock, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <FaShieldAlt />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your CyberShield security dashboard and saved research.</p>
        </div>

        {error && (
          <div className="auth-error-alert">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrap">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrap">
              <FaLock className="field-icon" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Login to CyberShield"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account yet? <Link to="/register">Create Free Account</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
