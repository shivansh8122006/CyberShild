import { useState, useEffect } from "react";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaTrashAlt,
  FaUserShield,
  FaUser,
  FaBan,
  FaCheck,
  FaExclamationTriangle,
  FaSyncAlt,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Users.css";

function AdminUsers() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ text: "", type: "" });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers(searchQuery, roleFilter);
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleToggle = async (user) => {
    if (user._id === currentAdmin?.id) {
      setActionMessage({ text: "You cannot change your own administrator role.", type: "error" });
      return;
    }

    const newRole = user.role === "admin" ? "user" : "admin";
    setActionLoading(true);
    try {
      await api.updateUserRole(user._id, { role: newRole });
      setActionMessage({ text: `User role changed to ${newRole.toUpperCase()}.`, type: "success" });
      fetchUsers();
    } catch (err) {
      setActionMessage({ text: err.message || "Failed to update user role.", type: "error" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3500);
    }
  };

  const handleStatusToggle = async (user) => {
    if (user._id === currentAdmin?.id) {
      setActionMessage({ text: "You cannot suspend your own account.", type: "error" });
      return;
    }

    const newStatus = user.status === "suspended" ? "active" : "suspended";
    setActionLoading(true);
    try {
      await api.updateUserRole(user._id, { status: newStatus });
      setActionMessage({ text: `Account status updated to ${newStatus.toUpperCase()}.`, type: "success" });
      fetchUsers();
    } catch (err) {
      setActionMessage({ text: err.message || "Failed to update account status.", type: "error" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3500);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    if (userToDelete._id === currentAdmin?.id) {
      setActionMessage({ text: "You cannot delete your own active administrator account.", type: "error" });
      setUserToDelete(null);
      return;
    }

    setActionLoading(true);
    try {
      await api.deleteUser(userToDelete._id);
      setActionMessage({ text: "User account permanently removed.", type: "success" });
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      setActionMessage({ text: err.message || "Failed to delete user.", type: "error" });
    } finally {
      setActionLoading(false);
      setTimeout(() => setActionMessage({ text: "", type: "" }), 3500);
    }
  };

  return (
    <div className="admin-users-container">
      {/* Top Banner */}
      <div className="users-header-bar">
        <div>
          <h2>User Access Directory</h2>
          <p>Audit registered accounts, elevate administrator privileges, and enforce account state controls.</p>
        </div>
        <button className="users-refresh-btn" onClick={fetchUsers} title="Refresh User List">
          <FaSyncAlt />
          <span>Refresh</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionMessage.text && (
        <div className={`users-action-banner ${actionMessage.type}`}>
          {actionMessage.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="users-controls-card">
        <form onSubmit={handleSearchSubmit} className="users-search-form">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by full name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>

        <div className="users-filter-group">
          <FaFilter className="filter-icon" />
          <span className="filter-text">Role:</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${roleFilter === "all" ? "active" : ""}`}
              onClick={() => setRoleFilter("all")}
            >
              All Roles
            </button>
            <button
              className={`filter-btn ${roleFilter === "admin" ? "active" : ""}`}
              onClick={() => setRoleFilter("admin")}
            >
              Admins Only
            </button>
            <button
              className={`filter-btn ${roleFilter === "user" ? "active" : ""}`}
              onClick={() => setRoleFilter("user")}
            >
              Standard Users
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="users-table-card">
        {loading ? (
          <div className="users-loading-box">
            <div className="admin-spinner"></div>
            <p>Querying User Database...</p>
          </div>
        ) : error ? (
          <div className="users-error-box">
            <FaExclamationTriangle className="err-icon" />
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-btn">
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="users-empty-box">
            <FaUsers className="empty-icon" />
            <h3>No Users Found</h3>
            <p>No account records matched your search query "{searchQuery}".</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Registration Date</th>
                  <th style={{ textAlign: "right" }}>Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isCurrent = u._id === currentAdmin?.id;
                  return (
                    <tr key={u._id} className={isCurrent ? "current-user-row" : ""}>
                      <td>
                        <div className="user-cell">
                          <div className={`user-avatar-sm ${u.role === "admin" ? "admin" : ""}`}>
                            {u.role === "admin" ? <FaUserShield /> : u.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="user-name-text">
                              {u.name} {isCurrent && <span className="you-badge">(You)</span>}
                            </div>
                            <div className="user-email-text">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`role-toggle-btn ${u.role === "admin" ? "admin" : "user"}`}
                          onClick={() => handleRoleToggle(u)}
                          disabled={isCurrent || actionLoading}
                          title={isCurrent ? "Cannot change own role" : `Click to make ${u.role === "admin" ? "User" : "Admin"}`}
                        >
                          {u.role === "admin" ? <FaUserShield /> : <FaUser />}
                          <span>{u.role === "admin" ? "Admin" : "User"}</span>
                        </button>
                      </td>
                      <td>
                        <button
                          className={`status-toggle-btn ${u.status === "suspended" ? "suspended" : "active"}`}
                          onClick={() => handleStatusToggle(u)}
                          disabled={isCurrent || actionLoading}
                          title={isCurrent ? "Cannot suspend own account" : `Click to ${u.status === "suspended" ? "Activate" : "Suspend"}`}
                        >
                          {u.status === "suspended" ? <FaBan /> : <FaCheck />}
                          <span>{u.status === "suspended" ? "Suspended" : "Active"}</span>
                        </button>
                      </td>
                      <td className="table-date">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td>
                        <div className="user-actions-cell">
                          <button
                            className="action-icon-btn info"
                            onClick={() => setSelectedUser(u)}
                            title="View Full Profile Details"
                          >
                            <FaInfoCircle />
                          </button>
                          <button
                            className="action-icon-btn delete"
                            onClick={() => setUserToDelete(u)}
                            disabled={isCurrent || actionLoading}
                            title={isCurrent ? "Cannot delete own account" : "Delete User"}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>User Profile Details</h3>
              <button className="modal-close-btn" onClick={() => setSelectedUser(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-avatar-banner">
                <div className="modal-avatar">
                  {selectedUser.role === "admin" ? <FaUserShield /> : selectedUser.name?.charAt(0)}
                </div>
                <div>
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="modal-details-list">
                <div className="detail-item">
                  <span className="detail-label">User ID:</span>
                  <code className="detail-value">{selectedUser._id}</code>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Role:</span>
                  <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role?.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Status:</span>
                  <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status?.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registered Date:</span>
                  <span className="detail-value">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Dialog */}
      {userToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setUserToDelete(null)}>
          <div className="admin-modal-card danger" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="danger-title-wrap">
                <FaExclamationTriangle className="modal-danger-icon" />
                <h3>Confirm Account Deletion</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setUserToDelete(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete the account for <strong>{userToDelete.name}</strong> (
                <code>{userToDelete.email}</code>)?
              </p>
              <div className="danger-warning-box">
                This action is irreversible and will revoke all access credentials immediately.
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setUserToDelete(null)}>
                Cancel
              </button>
              <button className="admin-btn-danger" onClick={handleDeleteConfirm} disabled={actionLoading}>
                {actionLoading ? "Deleting..." : "Permanently Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
