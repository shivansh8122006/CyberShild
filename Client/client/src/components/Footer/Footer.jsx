import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaEnvelope, FaTools, FaBookOpen } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand info */}
        <div className="footer-brand">
          <div className="footer-logo">
            <FaShieldAlt className="footer-shield" />
            <h2>CyberShield</h2>
          </div>
          <p>
            An interactive cybersecurity learning platform empowering students and beginners to understand digital threats, adopt defensive security habits, and utilize practical protection tools.
          </p>
          <div className="footer-badge">
            <FaLock className="badge-icon" /> Safe & Secure Educational Platform
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/articles">Articles</Link>
          <Link to="/tools">Security Tools</Link>
          <Link to="/awareness">Awareness Hub</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Learning Resources */}
        <div className="footer-links">
          <h3>Learning Resources</h3>
          <Link to="/articles">Password Security</Link>
          <Link to="/articles">Phishing Prevention</Link>
          <Link to="/articles">Network Protection</Link>
          <Link to="/articles">Malware & Ransomware</Link>
          <Link to="/tools">Password Generator</Link>
          <Link to="/tools">URL Risk Inspector</Link>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact & Inquiries</h3>
          <p className="footer-contact-item">
            <FaEnvelope className="contact-icon" />
            <a href="mailto:shivanshtiwari930@gmail.com">shivanshtiwari930@gmail.com</a>
          </p>
          <p className="footer-desc">
            Designed for BCA 3rd Year Full-Stack Project Presentation.
          </p>
          <div className="project-tag">
            <span>BCA Final Year Project</span>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CyberShield – Cybersecurity Awareness & Learning Platform. Built with React & Node.js.</p>
      </div>
    </footer>
  );
}

export default Footer;