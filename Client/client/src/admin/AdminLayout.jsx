import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShieldAlt,
  FaThLarge,
  FaUsers,
  FaNewspaper,
  FaLock,
  FaCogs,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaCircle,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "Command Center Dashboard";
      case "/admin/users":
        return "User Access Management";
      case "/admin/articles":
        return "Cybersecurity Knowledgebase";
      case "/admin/security":
        return "Security Domain Matrix";
      case "/admin/settings":
        return "Administrator Settings";
      default:
        return "Admin Portal";
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="admin-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-brand" onClick={() => setSidebarOpen(false)}>
            <div className="admin-logo-badge">
              <FaShieldAlt />
            </div>
            <div>
              <span className="admin-brand-title">CyberShield</span>
              <span className="admin-brand-sub">CONTROL PANEL</span>
            </div>
          </Link>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="admin-nav-menu">
          <span className="nav-group-label">OPERATIONS</span>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaThLarge className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers className="nav-icon" />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/articles"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaNewspaper className="nav-icon" />
            <span>Articles</span>
          </NavLink>

          <NavLink
            to="/admin/security"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaLock className="nav-icon" />
            <span>Security Domains</span>
          </NavLink>

          <span className="nav-group-label">SYSTEM</span>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FaCogs className="nav-icon" />
            <span>Settings</span>
          </NavLink>

          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link external-link">
            <FaExternalLinkAlt className="nav-icon" />
            <span>View Live Website</span>
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-avatar">
              <FaUserShield />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">{user?.name || "Administrator"}</span>
              <span className="admin-user-role">ROOT ADMIN</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout} title="Log Out Admin">
            <FaSignOutAlt />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Admin Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars />
            </button>
            <div className="admin-breadcrumbs">
              <span className="breadcrumb-root">CyberShield</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{getPageTitle()}</span>
            </div>
          </div>

          <div className="admin-header-right">
            <div className="system-status-indicator">
              <FaCircle className="pulse-dot" />
              <span>System Live</span>
            </div>
            <div className="admin-live-clock">{currentTime}</div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="admin-content-body">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
