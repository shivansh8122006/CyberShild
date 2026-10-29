import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaShieldAlt,
  FaKey,
  FaLink,
  FaBookOpen,
  FaCheckCircle,
  FaLock,
  FaSignOutAlt,
  FaCalendarAlt,
  FaTrophy,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({
    mfa: true,
    pwdManager: true,
    backup: false,
    phishing: true,
    updates: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    api
      .getArticles()
      .then((data) => setRecentArticles(data.slice(0, 3)))
      .catch((err) => console.error("Dashboard articles load error:", err));
  }, [isAuthenticated, navigate]);

  const toggleTask = (key) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const tasksArray = Object.values(completedTasks);
  const passedCount = tasksArray.filter(Boolean).length;
  const scorePercent = Math.round((passedCount / tasksArray.length) * 100);

  if (!isAuthenticated) return null;

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <section className="dashboard-welcome-card">
          <div className="welcome-left">
            <div className="user-avatar-badge">
              <FaUserShield />
            </div>
            <div>
              <span className="welcome-tag">Security Command Center</span>
              <h1>Welcome, {user?.name || "Cyber Cadet"}</h1>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>

          <div className="welcome-right">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="btn-dashboard-logout"
            >
              <FaSignOutAlt />
              <span>Log Out</span>
            </button>
          </div>
        </section>

        {/* Top Grid: Security Score & Quick Toolkit */}
        <div className="dashboard-grid-top">
          {/* Readiness Score Card */}
          <div className="dashboard-card score-card">
            <div className="card-header-icon">
              <FaTrophy className="score-icon" />
              <h3>Cyber Defense Readiness</h3>
            </div>

            <div className="score-circle-display">
              <div className="score-number">{scorePercent}%</div>
              <p className="score-label">
                {scorePercent >= 80 ? "Hardened & Secure" : scorePercent >= 50 ? "Moderate Defense" : "Vulnerable"}
              </p>
            </div>

            <div className="score-progress-bar">
              <div
                className="score-fill"
                style={{
                  width: `${scorePercent}%`,
                  backgroundColor: scorePercent >= 80 ? "#10b981" : scorePercent >= 50 ? "#f59e0b" : "#ef4444",
                }}
              ></div>
            </div>

            <p className="score-subtext">
              Complete the security checklist tasks below to maximize your defense score.
            </p>
          </div>

          {/* Quick Tools Launchpad */}
          <div className="dashboard-card tools-launchpad">
            <h3>Quick Defense Utilities</h3>
            <p>Access your cybersecurity testing tools instantly.</p>

            <div className="launchpad-grid">
              <Link to="/tools" className="launch-item">
                <div className="launch-icon">
                  <FaLock />
                </div>
                <div>
                  <h4>Strength Analyzer</h4>
                  <span>Test password entropy</span>
                </div>
              </Link>

              <Link to="/tools" className="launch-item">
                <div className="launch-icon">
                  <FaKey />
                </div>
                <div>
                  <h4>Password Generator</h4>
                  <span>Create uncrackable keys</span>
                </div>
              </Link>

              <Link to="/tools" className="launch-item">
                <div className="launch-icon">
                  <FaLink />
                </div>
                <div>
                  <h4>URL Risk Inspector</h4>
                  <span>Detect phishing links</span>
                </div>
              </Link>

              <Link to="/awareness" className="launch-item">
                <div className="launch-icon">
                  <FaBookOpen />
                </div>
                <div>
                  <h4>Awareness Hub</h4>
                  <span>10 Security modules</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Security Readiness Checklist & Recommended Guides */}
        <div className="dashboard-grid-bottom">
          {/* Interactive Checklist */}
          <div className="dashboard-card checklist-card">
            <h3>Security Hygiene Checklist</h3>
            <p>Audit and check off your personal security measures.</p>

            <div className="checklist-items">
              <label
                className={`task-row ${completedTasks.mfa ? "done" : ""}`}
                onClick={() => toggleTask("mfa")}
              >
                <div className="task-check">
                  {completedTasks.mfa && <FaCheckCircle />}
                </div>
                <div>
                  <strong>Enable 2FA on Email & Banking</strong>
                  <span>Protect accounts from credential theft with an authenticator app</span>
                </div>
              </label>

              <label
                className={`task-row ${completedTasks.pwdManager ? "done" : ""}`}
                onClick={() => toggleTask("pwdManager")}
              >
                <div className="task-check">
                  {completedTasks.pwdManager && <FaCheckCircle />}
                </div>
                <div>
                  <strong>Adopt a Dedicated Password Manager</strong>
                  <span>Eliminate reused passwords across personal accounts</span>
                </div>
              </label>

              <label
                className={`task-row ${completedTasks.phishing ? "done" : ""}`}
                onClick={() => toggleTask("phishing")}
              >
                <div className="task-check">
                  {completedTasks.phishing && <FaCheckCircle />}
                </div>
                <div>
                  <strong>Review Phishing Identification Checklist</strong>
                  <span>Learn how to inspect sender headers and spoofed URLs</span>
                </div>
              </label>

              <label
                className={`task-row ${completedTasks.updates ? "done" : ""}`}
                onClick={() => toggleTask("updates")}
              >
                <div className="task-check">
                  {completedTasks.updates && <FaCheckCircle />}
                </div>
                <div>
                  <strong>Enable Automatic OS & Browser Updates</strong>
                  <span>Patch known Common Vulnerabilities and Exposures (CVEs)</span>
                </div>
              </label>

              <label
                className={`task-row ${completedTasks.backup ? "done" : ""}`}
                onClick={() => toggleTask("backup")}
              >
                <div className="task-check">
                  {completedTasks.backup && <FaCheckCircle />}
                </div>
                <div>
                  <strong>Configure 3-2-1 Offline Data Backup</strong>
                  <span>Ensure total immunity from ransomware extortion</span>
                </div>
              </label>
            </div>
          </div>

          {/* Recommended Articles */}
          <div className="dashboard-card articles-card">
            <div className="articles-card-header">
              <h3>Recommended Research</h3>
              <Link to="/articles" className="view-all-link">
                View All
              </Link>
            </div>

            <div className="recommended-list">
              {recentArticles.map((art) => (
                <Link to={`/articles/${art._id}`} key={art._id} className="rec-article-item">
                  <div className="rec-article-cat">{art.category}</div>
                  <h4>{art.title}</h4>
                  <div className="rec-meta">
                    <FaCalendarAlt className="meta-icon" />
                    <span>
                      {art.createdAt
                        ? new Date(art.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Guide"}
                    </span>
                    <FaArrowRight className="rec-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
