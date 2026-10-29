import { useState, useEffect } from "react";
import {
  FaNewspaper,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaSyncAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import api from "../services/api";
import "./Articles.css";

const STANDARD_CATEGORIES = [
  "Password Security",
  "Phishing",
  "Network Security",
  "Malware",
  "Authentication",
  "Zero Trust",
  "Privacy",
  "Social Engineering",
];

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals & Forms
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | 'preview' | 'delete'
  const [activeArticle, setActiveArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Password Security",
    description: "",
    content: "",
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message || "Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: "",
      category: "Password Security",
      description: "",
      content: "",
    });
    setModalMode("create");
  };

  const openEditModal = (art) => {
    setActiveArticle(art);
    setFormData({
      title: art.title || "",
      category: art.category || "Password Security",
      description: art.description || "",
      content: art.content || "",
    });
    setModalMode("edit");
  };

  const openPreviewModal = (art) => {
    setActiveArticle(art);
    setModalMode("preview");
  };

  const openDeleteModal = (art) => {
    setActiveArticle(art);
    setModalMode("delete");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveArticle(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description || !formData.content) {
      setFeedback({ text: "Please fill out all required fields.", type: "error" });
      return;
    }

    setFormSubmitting(true);
    try {
      if (modalMode === "create") {
        await api.createArticle(formData);
        setFeedback({ text: "New cybersecurity article created successfully!", type: "success" });
      } else if (modalMode === "edit" && activeArticle) {
        await api.updateArticle(activeArticle._id, formData);
        setFeedback({ text: "Article updated successfully!", type: "success" });
      }
      closeModal();
      fetchArticles();
    } catch (err) {
      setFeedback({ text: err.message || "Operation failed.", type: "error" });
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setFeedback({ text: "", type: "" }), 3500);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!activeArticle) return;
    setFormSubmitting(true);
    try {
      await api.deleteArticle(activeArticle._id);
      setFeedback({ text: "Article permanently deleted.", type: "success" });
      closeModal();
      fetchArticles();
    } catch (err) {
      setFeedback({ text: err.message || "Failed to delete article.", type: "error" });
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setFeedback({ text: "", type: "" }), 3500);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === "All" ||
      art.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="admin-articles-container">
      {/* Top Banner */}
      <div className="articles-header-bar">
        <div>
          <h2>Cybersecurity Knowledgebase</h2>
          <p>Create, update, and manage educational security guides published across the platform.</p>
        </div>
        <div className="header-actions-group">
          <button className="create-article-btn" onClick={openCreateModal}>
            <FaPlus />
            <span>Create New Article</span>
          </button>
          <button className="articles-refresh-btn" onClick={fetchArticles} title="Refresh Articles">
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {feedback.text && (
        <div className={`articles-feedback-banner ${feedback.type}`}>
          {feedback.type === "success" ? <FaCheck /> : <FaExclamationTriangle />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="articles-controls-card">
        <div className="articles-search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search articles by title, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              ×
            </button>
          )}
        </div>

        <div className="articles-category-filter">
          <FaFilter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-dropdown"
          >
            <option value="All">All Categories ({articles.length})</option>
            {STANDARD_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="articles-table-card">
        {loading ? (
          <div className="articles-loading-box">
            <div className="admin-spinner"></div>
            <p>Querying Cybersecurity Articles...</p>
          </div>
        ) : error ? (
          <div className="articles-error-box">
            <FaExclamationTriangle className="err-icon" />
            <p>{error}</p>
            <button onClick={fetchArticles} className="retry-btn">
              Retry
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="articles-empty-box">
            <FaNewspaper className="empty-icon" />
            <h3>No Articles Found</h3>
            <p>No published articles matched your search filter.</p>
            <button className="create-article-btn sm" onClick={openCreateModal}>
              <FaPlus /> Create Your First Article
            </button>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Article Title & Summary</th>
                  <th>Security Domain</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((art) => (
                  <tr key={art._id}>
                    <td>
                      <div className="article-title-cell">
                        <span className="art-main-title">{art.title}</span>
                        <span className="art-desc-snippet">{art.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className="domain-pill">{art.category}</span>
                    </td>
                    <td className="table-date">
                      <div className="date-with-icon">
                        <FaCalendarAlt className="cal-icon" />
                        <span>
                          {art.createdAt
                            ? new Date(art.createdAt).toLocaleDateString()
                            : "Published"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="article-actions-cell">
                        <button
                          className="action-icon-btn view"
                          onClick={() => openPreviewModal(art)}
                          title="Preview Full Article"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="action-icon-btn edit"
                          onClick={() => openEditModal(art)}
                          title="Edit Article Content"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-icon-btn delete"
                          onClick={() => openDeleteModal(art)}
                          title="Delete Article"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE & EDIT ARTICLE MODAL */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalMode === "create" ? "Create Cybersecurity Article" : "Edit Article Content"}</h3>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="article-modal-form">
              <div className="modal-body-scrollable">
                <div className="modal-form-group">
                  <label htmlFor="art-title">Article Headline / Title *</label>
                  <input
                    id="art-title"
                    type="text"
                    placeholder="e.g. How to Identify and Avoid Phishing Attacks"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label htmlFor="art-category">Security Domain / Category *</label>
                    <select
                      id="art-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {STANDARD_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-form-group">
                    <label htmlFor="art-desc">Short Summary / Description *</label>
                    <input
                      id="art-desc"
                      type="text"
                      placeholder="Brief overview summarizing the core defensive topic..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="art-content">Full Markdown Guide Content *</label>
                  <textarea
                    id="art-content"
                    rows="10"
                    placeholder="Write detailed educational guide, attack vectors, and practical defense steps..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary" disabled={formSubmitting}>
                  {formSubmitting
                    ? "Saving Article..."
                    : modalMode === "create"
                    ? "Publish Article"
                    : "Update Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {modalMode === "preview" && activeArticle && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="domain-pill">{activeArticle.category}</span>
                <h3 style={{ marginTop: "6px" }}>{activeArticle.title}</h3>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-scrollable preview-body">
              <p className="preview-lead">{activeArticle.description}</p>
              <div className="preview-markdown-content">
                {activeArticle.content}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn-secondary"
                onClick={() => openEditModal(activeArticle)}
              >
                <FaEdit /> Edit This Guide
              </button>
              <button className="admin-btn-primary" onClick={closeModal}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {modalMode === "delete" && activeArticle && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-card danger" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="danger-title-wrap">
                <FaExclamationTriangle className="modal-danger-icon" />
                <h3>Confirm Article Deletion</h3>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete <strong>"{activeArticle.title}"</strong>?
              </p>
              <div className="danger-warning-box">
                This guide will be removed from the public website knowledgebase immediately.
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="admin-btn-danger" onClick={handleDeleteConfirm} disabled={formSubmitting}>
                {formSubmitting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
