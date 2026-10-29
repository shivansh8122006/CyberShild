import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import "./ArticleCard.css";

function ArticleCard({ id, icon, category, title, description, date }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently Added";

  return (
    <article className="article-card">
      <div className="card-top">
        <div className="article-icon">{icon}</div>
        <span className="article-category">{category}</span>
      </div>

      <div className="card-meta">
        <FaCalendarAlt className="meta-icon" />
        <span>{formattedDate}</span>
      </div>

      <h3 className="article-title">{title}</h3>

      <p className="article-desc">{description}</p>

      <Link to={`/articles/${id}`} className="read-more-link">
        <span>Read Guide</span>
        <FaArrowRight className="arrow-icon" />
      </Link>
    </article>
  );
}

export default ArticleCard;