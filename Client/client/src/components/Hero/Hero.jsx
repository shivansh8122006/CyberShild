import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowRight, FaTools, FaLock, FaUserCheck } from "react-icons/fa";
import heroImg from "../../assets/hero.png";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Column: Headline & Action Buttons */}
        <div className="hero-left">
          <div className="hero-badge">
            <FaShieldAlt className="badge-shield" />
            <span>Next-Gen Cybersecurity Learning</span>
          </div>

          <h1>
            Stay Safe in the <br />
            <span className="gradient-text">Digital World</span>
          </h1>

          <p>
            CyberShield is an open learning platform built to help students, beginners, and professionals master cybersecurity fundamentals through interactive tools, realistic awareness guides, and practical defenses.
          </p>

          <div className="hero-buttons">
            <Link to="/articles" className="primary-btn">
              <span>Explore Guides</span>
              <FaArrowRight className="btn-icon" />
            </Link>

            <Link to="/tools" className="secondary-btn">
              <FaTools className="btn-icon-left" />
              <span>Try Security Tools</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-highlights">
            <div className="highlight-item">
              <FaLock className="hl-icon" />
              <span>100% Free & Open</span>
            </div>
            <div className="highlight-divider">•</div>
            <div className="highlight-item">
              <FaUserCheck className="hl-icon" />
              <span>Beginner Friendly</span>
            </div>
            <div className="highlight-divider">•</div>
            <div className="highlight-item">
              <FaShieldAlt className="hl-icon" />
              <span>Practical Defense</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Graphic Banner */}
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <div className="glow-effect"></div>
            <img src={heroImg} alt="CyberShield Security Shield Illustration" className="hero-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;