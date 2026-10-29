import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLock, FaFish, FaNetworkWired, FaBug, FaKey, FaShieldAlt } from "react-icons/fa";
import api from "../../services/api";
import ArticleCard from "./ArticleCard";
import "./LatestArticles.css";

// Category icon helper
export const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "password security":
      return <FaLock />;
    case "phishing":
      return <FaFish />;
    case "network security":
      return <FaNetworkWired />;
    case "malware":
      return <FaBug />;
    case "authentication":
      return <FaKey />;
    default:
      return <FaShieldAlt />;
  }
};

function LatestArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getArticles()
      .then((data) => {
        setArticles(data.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to load latest articles:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="latest-articles">
      <div className="articles-heading">
        <span className="articles-badge">Knowledge Base</span>
        <h2>Latest Security Articles</h2>
        <p>Explore beginner-friendly and practical security research to safeguard your digital footprint.</p>
      </div>

      {loading ? (
        <div className="articles-loading">
          <div className="spinner"></div>
          <p>Loading security articles...</p>
        </div>
      ) : (
        <div className="articles-container">
          {articles.map((article) => (
            <ArticleCard
              key={article._id}
              id={article._id}
              icon={getCategoryIcon(article.category)}
              category={article.category}
              title={article.title}
              description={article.description}
              date={article.createdAt}
            />
          ))}
        </div>
      )}

      <div className="all-articles-btn-wrap">
        <Link to="/articles" className="all-articles-btn">
          <span>View All Security Articles</span>
          <FaArrowRight className="btn-arrow" />
        </Link>
      </div>
    </section>
  );
}

export default LatestArticles;