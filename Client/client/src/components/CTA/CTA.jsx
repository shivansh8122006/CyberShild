import { Link } from "react-router-dom";
import { FaTools, FaShieldAlt } from "react-icons/fa";
import "./CTA.css";

function CTA() {
  return (
    <section className="cta">
      <div className="cta-container">
        <div className="cta-content">
          <div className="cta-icon-wrap">
            <FaShieldAlt className="cta-shield" />
          </div>

          <h2>Ready to Level Up Your Cybersecurity Defense?</h2>

          <p>
            Test your password strength, generate high-entropy credentials, inspect suspicious links, and explore beginner-friendly defense modules today.
          </p>

          <div className="cta-buttons">
            <Link to="/tools" className="cta-btn primary">
              <FaTools className="btn-icon-left" />
              <span>Launch Security Tools</span>
            </Link>

            <Link to="/awareness" className="cta-btn secondary">
              <span>View Awareness Guides</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
