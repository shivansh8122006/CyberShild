import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaNewspaper,
  FaUserShield,
  FaShieldAlt,
  FaPlus,
  FaArrowRight,
  FaSyncAlt,
  FaCheckCircle,
  FaLock,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../services/api";
import "./Dashboard.css";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAdminDashboard();
      setData(response);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-state">
        <div className="admin-spinner"></div>
        <p>Loading Real-time Telemetry & Statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-card">
        <FaExclamationTriangle className="err-icon" />
        <h3>Failed to Load Dashboard Telemetry</h3>
        <p>{error}</p>
        <button className="admin-retry-btn" onClick={fetchDashboardData}>
          <FaSyncAlt /> Retry Query
        </button>
      </div>
    );
  }

  const { stats, recentUsers = [], recentArticles = [], categories = [] } = data || {};

  return (
    <div className="admin-dashboard-container">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="dashboard-top-banner">
        <div>
          <h2>Security Operations Center</h2>
          <p>Real-time platform metrics, user access distribution, and cybersecurity knowledge assets.</p>
        </div>
        <div className="top-banner-actions">
          <Link to="/admin/articles" className="admin-action-btn primary">
            <FaPlus />
            <span>New Article</span>
          </Link>
          <button className="admin-action-btn secondary" onClick={fetchDashboardData} title="Refresh Telemetry">
            <FaSyncAlt />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap cyan">
            <FaUsers />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Users</span>
            <div className="stat-number">{stats?.totalUsers ?? 0}</div>
            <span className="stat-sub">{stats?.activeUsers ?? 0} active accounts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap emerald">
            <FaNewspaper />
          </div>
          <div className="stat-content">
            <span className="stat-title">Published Articles</span>
            <div className="stat-number">{stats?.totalArticles ?? 0}</div>
            <span className="stat-sub">Across 8 security domains</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap purple">
            <FaUserShield />
          </div>
          <div className="stat-content">
            <span className="stat-title">System Admins</span>
            <div className="stat-number">{stats?.totalAdmins ?? 1}</div>
            <span className="stat-sub">Elevated access</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap blue">
            <FaShieldAlt />
          </div>
          <div className="stat-content">
            <span className="stat-title">Platform Defense</span>
            <div className="stat-number">100%</div>
            <span className="stat-sub">Telemetry normal</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Users & Recent Articles */}
      <div className="dashboard-tables-grid">
        {/* Recent Users Card */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div className="header-title-wrap">
              <FaUsers className="header-icon cyan" />
              <h3>Recent User Registrations</h3>
            </div>
            <Link to="/admin/users" className="panel-view-all">
              <span>Manage All</span>
              <FaArrowRight />
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">{u.name?.charAt(0) || "U"}</div>
                          <div>
                            <div className="user-name-text">{u.name}</div>
                            <div className="user-email-text">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${u.role === "admin" ? "admin" : "user"}`}>
                          {u.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${u.status === "suspended" ? "suspended" : "active"}`}>
                          {u.status === "suspended" ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="table-date">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-cell">
                      No user registrations recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Articles Card */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div className="header-title-wrap">
              <FaNewspaper className="header-icon emerald" />
              <h3>Recent Security Articles</h3>
            </div>
            <Link to="/admin/articles" className="panel-view-all">
              <span>Manage All</span>
              <FaArrowRight />
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.length > 0 ? (
                  recentArticles.map((art) => (
                    <tr key={art._id}>
                      <td>
                        <div className="article-title-text">{art.title}</div>
                        <div className="article-desc-preview">{art.description}</div>
                      </td>
                      <td>
                        <span className="category-pill">{art.category}</span>
                      </td>
                      <td className="table-date">
                        {art.createdAt ? new Date(art.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-cell">
                      No articles created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Category Distribution */}
      <div className="admin-panel-card" style={{ marginTop: "24px" }}>
        <div className="panel-card-header">
          <div className="header-title-wrap">
            <FaLock className="header-icon purple" />
            <h3>Knowledgebase Category Distribution</h3>
          </div>
          <Link to="/admin/security" className="panel-view-all">
            <span>Explore Security Domains</span>
            <FaArrowRight />
          </Link>
        </div>

        <div className="categories-distribution-grid">
          {categories.map((c, i) => (
            <div key={i} className="cat-dist-item">
              <div className="cat-dist-header">
                <span className="cat-dist-name">{c.category || "General Security"}</span>
                <span className="cat-dist-count">{c.count} {c.count === 1 ? "article" : "articles"}</span>
              </div>
              <div className="cat-dist-bar">
                <div
                  className="cat-dist-fill"
                  style={{ width: `${Math.min(100, c.count * 25)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
