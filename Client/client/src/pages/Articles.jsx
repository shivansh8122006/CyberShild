import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaRedo, FaBookOpen, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import api from "../services/api";
import { getCategoryIcon } from "../components/LatestArticles/LatestArticles";
import "./Articles.css";

const CATEGORIES = [
  "All",
  "Password Security",
  "Phishing",
  "Network Security",
  "Malware",
  "Authentication",
  "Zero Trust",
  "Privacy",
  "Social Engineering",
];

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchArticles = () => {
    setLoading(true);
    setError(null);
    api
      .getArticles()
      .then((data) => {
        setArticles(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load articles.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter logic
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" ||
      article.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="articles-page">
      {/* Page Header */}
      <section className="articles-hero">
        <div className="articles-hero-badge">
          <FaBookOpen />
          <span>Knowledge & Research Library</span>
        </div>
        <h1>Cybersecurity Articles</h1>
        <p>
          Explore structured security guides, threat breakdowns, and defense strategies to protect your digital accounts and infrastructure.
        </p>
      </section>

      <section className="articles-main-content">
        <div className="articles-controls">
          {/* Search Bar */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search articles by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                ×
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="category-filters">
            <span className="filter-label">
              <FaFilter /> Category:
            </span>
            <div className="filter-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-header">
          <p className="results-count">
            Showing <strong>{filteredArticles.length}</strong> {filteredArticles.length === 1 ? "article" : "articles"}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="articles-state-box">
            <div className="spinner"></div>
            <p>Loading cybersecurity articles from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="articles-state-box error">
            <h3>Unable to Load Articles</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchArticles}>
              <FaRedo /> Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="articles-state-box empty">
            <h3>No Articles Found</h3>
            <p>No articles matched your search term "{searchQuery}". Try different keywords or reset category filters.</p>
            <button
              className="reset-filter-btn"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <article className="full-article-card" key={article._id}>
                <div className="article-card-header">
                  <div className="full-article-icon">{getCategoryIcon(article.category)}</div>
                  <span className="article-category">{article.category}</span>
                </div>

                <div className="card-date">
                  <FaCalendarAlt className="date-icon" />
                  <span>
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>

                <h2>{article.title}</h2>
                <p>{article.description}</p>

                <Link to={`/articles/${article._id}`} className="read-article-btn">
                  <span>Read Complete Guide</span>
                  <FaArrowRight className="read-icon" />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Articles;