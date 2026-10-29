import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both administrator email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await adminLogin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-shield-icon">
            <FaUserShield />
          </div>
          <h1>CyberShield Admin Portal</h1>
          <p>Restricted Access: Authorized Cybersecurity Administrators Only</p>
        </div>

        {error && (
          <div className="admin-error-banner">
            <FaExclamationTriangle className="err-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Administrator Email</label>
            <div className="admin-input-wrap">
              <FaEnvelope className="field-icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="admin@cybershield.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Master Key / Password</label>
            <div className="admin-input-wrap">
              <FaLock className="field-icon" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={submitting}>
            {submitting ? (
              <span className="btn-loading-text">Verifying Credentials...</span>
            ) : (
              <>
                <span>Access Command Center</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <div className="admin-credentials-hint">
            <span>Default Seed Admin:</span>
            <code>admin@cybershield.com / admin123</code>
          </div>
          <Link to="/" className="back-to-site-link">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
