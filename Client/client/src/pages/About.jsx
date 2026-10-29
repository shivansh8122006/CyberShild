import { Link } from "react-router-dom";
import { FaShieldAlt, FaBookOpen, FaUserCheck, FaTools, FaLaptopCode, FaLock } from "react-icons/fa";
import "./About.css";

function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-badge">
          <FaShieldAlt />
          <span>About the Platform</span>
        </div>
        <h1>Empowering the Next Generation of Cyber Defenders</h1>
        <p>
          CyberShield is an open, modern cybersecurity awareness and learning platform designed specifically for students, beginners, and digital citizens.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="about-content">
        <div className="about-text">
          <h2>Why We Built CyberShield</h2>
          <p>
            Cybersecurity is frequently taught through dense theoretical textbooks or complex low-level tooling that discourages beginners. At the same time, cyber threats like phishing, credential leaks, ransomware, and social engineering are surging worldwide.
          </p>
          <p>
            CyberShield bridges this gap. We provide intuitive threat breakdowns, practical defense guidelines, and interactive cybersecurity tools—enabling users to understand their digital attack surface and secure their everyday technology.
          </p>
        </div>

        <div className="about-box">
          <div className="goal-icon">
            <FaLaptopCode />
          </div>
          <h3>Our Core Mission</h3>
          <p>
            Democratize digital security education by translating complex cryptographic and network security principles into actionable, accessible, and practical learning modules.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="about-values">
        <h2>What You Can Learn on CyberShield</h2>
        <div className="values-container">
          <div className="value-card">
            <div className="val-icon">
              <FaLock />
            </div>
            <h3>🔐 Password & Credential Defense</h3>
            <p>Master entropy metrics, passphrases, and password management to stop brute-force takeovers.</p>
          </div>

          <div className="value-card">
            <div className="val-icon">
              <FaBookOpen />
            </div>
            <h3>🎣 Social Engineering Awareness</h3>
            <p>Spot deceptive domain spoofing, spear phishing emails, and psychological manipulation tactics.</p>
          </div>

          <div className="value-card">
            <div className="val-icon">
              <FaTools />
            </div>
            <h3>🛡️ Interactive Security Tools</h3>
            <p>Test password strengths in real-time, generate high-entropy keys, and inspect malicious URLs.</p>
          </div>
        </div>

        <div className="about-cta-bar">
          <Link to="/articles" className="btn-primary">
            Explore Security Guides
          </Link>
          <Link to="/tools" className="btn-secondary">
            Launch Security Tools
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;