import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes, FaUserAlt, FaSignOutAlt, FaTools, FaBookOpen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon-wrap">
            <FaShieldAlt className="logo-icon" />
          </div>
          <span className="logo-text">
            Cyber<span className="logo-highlight">Shield</span>
          </span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/articles" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                Articles
              </NavLink>
            </li>
            <li>
              <NavLink to="/tools" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                <FaTools className="nav-icon-inline" /> Security Tools
              </NavLink>
            </li>
            <li>
              <NavLink to="/awareness" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                <FaBookOpen className="nav-icon-inline" /> Awareness
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Authentication Actions */}
          <div className="auth-buttons">
            {isAuthenticated ? (
              <div className="user-nav-actions">
                <Link to="/dashboard" className="dashboard-nav-btn" onClick={closeMenu}>
                  <FaUserAlt className="user-icon-sm" />
                  <span>{user?.name?.split(" ")[0] || "Dashboard"}</span>
                </Link>
                <button className="logout-nav-btn" onClick={handleLogout} title="Log Out">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="login-btn" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="register-btn" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;