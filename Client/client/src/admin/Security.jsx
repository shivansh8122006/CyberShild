import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaFish,
  FaNetworkWired,
  FaBug,
  FaKey,
  FaShieldAlt,
  FaUserSecret,
  FaUserFriends,
  FaSyncAlt,
  FaExclamationTriangle,
  FaArrowRight,
  FaBookOpen,
} from "react-icons/fa";
import api from "../services/api";
import "./Security.css";

const ICONS_MAP = {
  FaLock: <FaLock />,
  FaFish: <FaFish />,
  FaNetworkWired: <FaNetworkWired />,
  FaBug: <FaBug />,
  FaKey: <FaKey />,
  FaShieldAlt: <FaShieldAlt />,
  FaUserSecret: <FaUserSecret />,
  FaUserFriends: <FaUserFriends />,
};

function AdminSecurity() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSecurityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminSecurity();
      setDomains(data);
    } catch (err) {
      setError(err.message || "Failed to load security domains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  return (
    <div className="admin-security-container">
      {/* Top Banner */}
      <div className="security-header-bar">
        <div>
          <h2>Security Domain Matrix</h2>
          <p>Supervise cybersecurity educational curriculum, threat classification, and content coverage.</p>
        </div>
        <button className="security-refresh-btn" onClick={fetchSecurityData} title="Refresh Security Overview">
          <FaSyncAlt />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="security-loading-box">
          <div className="admin-spinner"></div>
          <p>Auditing Security Domains & Curriculum...</p>
        </div>
      ) : error ? (
        <div className="security-error-box">
          <FaExclamationTriangle className="err-icon" />
          <p>{error}</p>
          <button onClick={fetchSecurityData} className="retry-btn">
            Retry
          </button>
        </div>
      ) : (
        <div className="security-domains-grid">
          {domains.map((dom, index) => {
            const icon = ICONS_MAP[dom.icon] || <FaShieldAlt />;
            return (
              <div key={index} className="security-domain-card">
                <div className="domain-card-header">
                  <div className="domain-icon-box">{icon}</div>
                  <span className={`threat-badge ${dom.threatLevel.toLowerCase()}`}>
                    {dom.threatLevel} Threat
                  </span>
                </div>

                <div className="domain-card-body">
                  <h3>{dom.name}</h3>
                  <p>{dom.description}</p>
                </div>

                <div className="domain-card-footer">
                  <div className="coverage-meta">
                    <FaBookOpen className="cov-icon" />
                    <span>
                      <strong>{dom.articlesCount}</strong> {dom.articlesCount === 1 ? "Guide Published" : "Guides Published"}
                    </span>
                  </div>
                  <Link to="/admin/articles" className="manage-domain-btn">
                    <span>Manage</span>
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminSecurity;
