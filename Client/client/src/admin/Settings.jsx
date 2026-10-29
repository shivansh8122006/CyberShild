import { useState } from "react";
import {
  FaUserShield,
  FaKey,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaShieldAlt,
  FaSave,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

function AdminSettings() {
  const { user, logout, updateUserState } = useAuth();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState({ text: "", type: "" });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({ text: "", type: "" });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileFeedback({ text: "", type: "" });

    if (!profileData.name || !profileData.email) {
      setProfileFeedback({ text: "Name and email are required.", type: "error" });
      return;
    }

    setProfileSaving(true);
    try {
      const response = await api.updateAdminProfile(profileData);
      updateUserState(response.user || profileData);
      setProfileFeedback({ text: "Administrator profile updated successfully!", type: "success" });
    } catch (err) {
      setProfileFeedback({ text: err.message || "Failed to update profile.", type: "error" });
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileFeedback({ text: "", type: "" }), 3500);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFeedback({ text: "", type: "" });

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordFeedback({ text: "All password fields are required.", type: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordFeedback({ text: "New password must be at least 6 characters long.", type: "error" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({ text: "New password and confirmation do not match.", type: "error" });
      return;
    }

    setPasswordSaving(true);
    try {
      await api.changeAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordFeedback({ text: "Administrator password updated successfully!", type: "success" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordFeedback({ text: err.message || "Failed to update password.", type: "error" });
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordFeedback({ text: "", type: "" }), 3500);
    }
  };

  return (
    <div className="admin-settings-container">
      {/* Top Banner */}
      <div className="settings-header-bar">
        <div>
          <h2>Administrator Settings</h2>
          <p>Manage root administrative credentials, session tokens, and security profile preferences.</p>
        </div>
        <button className="settings-logout-btn" onClick={logout}>
          <FaSignOutAlt />
          <span>Terminate Session</span>
        </button>
      </div>

      <div className="settings-grid">
        {/* Left Column: Admin Identity Card */}
        <div className="settings-card identity-card">
          <div className="identity-badge-wrap">
            <div className="identity-avatar">
              <FaUserShield />
            </div>
            <div>
              <h3>{user?.name || "System Administrator"}</h3>
              <span className="identity-role-badge">ROOT ACCESS</span>
            </div>
          </div>

          <div className="identity-details-list">
            <div className="identity-row">
              <span className="row-label">Admin Email:</span>
              <span className="row-val">{user?.email || "admin@cybershield.com"}</span>
            </div>
            <div className="identity-row">
              <span className="row-label">Access Level:</span>
              <span className="row-val text-cyan">Full Control (Tier 1)</span>
            </div>
            <div className="identity-row">
              <span className="row-label">JWT Token Mode:</span>
              <span className="row-val">Bearer (7-Day TTL)</span>
            </div>
            <div className="identity-row">
              <span className="row-label">Account Security:</span>
              <span className="row-val text-emerald">Active & Hardened</span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Profile & Change Password Forms */}
        <div className="settings-forms-col">
          {/* Edit Profile Form */}
          <div className="settings-card">
            <div className="card-title-wrap">
              <FaEnvelope className="card-icon cyan" />
              <h3>Update Administrator Profile</h3>
            </div>

            {profileFeedback.text && (
              <div className={`settings-feedback ${profileFeedback.type}`}>
                {profileFeedback.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
                <span>{profileFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="settings-form">
              <div className="form-group">
                <label>Administrator Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="e.g. System Administrator"
                  required
                />
              </div>

              <div className="form-group">
                <label>Administrator Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="admin@cybershield.com"
                  required
                />
              </div>

              <button type="submit" className="settings-btn-primary" disabled={profileSaving}>
                <FaSave />
                <span>{profileSaving ? "Saving..." : "Save Profile Details"}</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="settings-card">
            <div className="card-title-wrap">
              <FaKey className="card-icon emerald" />
              <h3>Change Master Password</h3>
            </div>

            {passwordFeedback.text && (
              <div className={`settings-feedback ${passwordFeedback.type}`}>
                {passwordFeedback.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="settings-form">
              <div className="form-group">
                <label>Current Master Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="settings-btn-primary emerald" disabled={passwordSaving}>
                <FaShieldAlt />
                <span>{passwordSaving ? "Updating..." : "Update Master Key"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
