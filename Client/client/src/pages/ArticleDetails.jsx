import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaShieldAlt, FaShareAlt, FaCheckCircle, FaBookmark } from "react-icons/fa";
import api from "../services/api";
import { getCategoryIcon } from "../components/LatestArticles/LatestArticles";
import "./ArticleDetails.css";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    api
      .getArticleById(id)
      .then((data) => {
        setArticle(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load article details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  if (loading) {
    return (
      <main className="article-details-page loading-view">
        <div className="spinner"></div>
        <p>Loading security guide...</p>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="article-details-page error-view">
        <div className="error-card">
          <h2>Article Not Found</h2>
          <p>{error || "The requested cybersecurity article does not exist or has been removed."}</p>
          <button onClick={() => navigate("/articles")} className="btn-back">
            <FaArrowLeft /> Back to Articles
          </button>
        </div>
      </main>
    );
  }

  // Calculate read time estimate (~200 words/min)
  const wordCount = (article.content || "").split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <main className="article-details-page">
      <div className="article-details-container">
        {/* Navigation Breadcrumb */}
        <div className="details-header-nav">
          <Link to="/articles" className="back-link">
            <FaArrowLeft /> Back to Articles
          </Link>
          <div className="article-action-buttons">
            <button
              className={`action-btn ${saved ? "saved" : ""}`}
              onClick={handleSave}
              title="Bookmark Article"
            >
              <FaBookmark />
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
            <button className="action-btn" onClick={handleShare} title="Share Link">
              <FaShareAlt />
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <article className="article-full">
          <header className="article-hero-header">
            <div className="article-badge-row">
              <span className="details-category-badge">
                {getCategoryIcon(article.category)} {article.category}
              </span>
              <span className="badge-status">
                <FaShieldAlt /> Verified Security Guide
              </span>
            </div>

            <h1 className="article-main-title">{article.title}</h1>

            <p className="article-lead-description">{article.description}</p>

            <div className="article-meta-bar">
              <div className="meta-item">
                <FaCalendarAlt className="meta-icon" />
                <span>
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Published recently"}
                </span>
              </div>
              <div className="meta-divider">•</div>
              <div className="meta-item">
                <FaClock className="meta-icon" />
                <span>{readTime} min read</span>
              </div>
              <div className="meta-divider">•</div>
              <div className="meta-item author-tag">
                <span>By CyberShield Intelligence Team</span>
              </div>
            </div>
          </header>

          {/* Key Takeaways Box */}
          <div className="key-takeaways-box">
            <div className="takeaway-header">
              <FaCheckCircle className="takeaway-icon" />
              <h3>Key Defense Takeaways</h3>
            </div>
            <ul>
              <li>Always verify source integrity before trusting input or communications.</li>
              <li>Implement defense-in-depth rather than relying on a single security control.</li>
              <li>Keep software, dependencies, and authentication mechanisms up to date.</li>
            </ul>
          </div>

          {/* Article Main Body Content */}
          <div className="article-body-content">
            {article.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} className="body-heading-3">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("## ")) {
                return (
                  <h2 key={idx} className="body-heading-2">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("- ") || block.startsWith("1. ")) {
                const items = block.split("\n");
                return (
                  <ul key={idx} className="body-list">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[-*]|\d+\.\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="body-paragraph">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Footer Callout */}
          <div className="article-footer-cta">
            <div className="footer-cta-text">
              <h3>Put this into practice</h3>
              <p>Test your defensive skills with our interactive security generators and risk inspectors.</p>
            </div>
            <Link to="/tools" className="btn-primary">
              Launch Security Tools
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

export default ArticleDetails;
