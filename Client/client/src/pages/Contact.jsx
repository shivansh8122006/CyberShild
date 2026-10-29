import { useState } from "react";
import { FaEnvelope, FaPhone, FaShieldAlt, FaPaperPlane, FaCheckCircle, FaUser, FaCommentAlt } from "react-icons/fa";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      {/* Hero Header */}
      <section className="contact-hero">
        <div className="contact-badge">
          <FaShieldAlt />
          <span>Support & Community Inquiries</span>
        </div>
        <h1>Get in Touch with CyberShield</h1>
        <p>
          Have questions about our cybersecurity curriculum, security tool feedback, or academic collaborations? Send us a message and our team will get back to you promptly.
        </p>
      </section>

      {/* Main Grid */}
      <section className="contact-section">
        {/* Left Column: Details */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p className="contact-lead">
            CyberShield is developed as an open-access platform to advance digital literacy and practical threat defense among undergraduate students.
          </p>

          <div className="contact-cards-list">
            <div className="contact-card-item">
              <div className="contact-card-icon">
                <FaEnvelope />
              </div>
              <div>
                <h4>Direct Email</h4>
                <a href="mailto:shivanshtiwari930@gmail.com">shivanshtiwari930@gmail.com</a>
                <span>Average response time: 24 hours</span>
              </div>
            </div>

            <div className="contact-card-item">
              <div className="contact-card-icon">
                <FaPhone />
              </div>
              <div>
                <h4>Phone / WhatsApp</h4>
                <p>+91 96878 20805</p>
                <span>Academic & Project Inquiries</span>
              </div>
            </div>

            <div className="contact-card-item">
              <div className="contact-card-icon">
                <FaShieldAlt />
              </div>
              <div>
                <h4>Platform Leadership</h4>
                <p>Shivansh Tiwari</p>
                <span>Creator & Full-Stack Developer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success-state">
              <div className="success-icon-box">
                <FaCheckCircle />
              </div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out to CyberShield. We have received your inquiry and will respond to {formData.email} soon.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send a Direct Message</h3>

              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <div className="input-with-icon">
                  <FaUser className="form-field-icon" />
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email Address</label>
                <div className="input-with-icon">
                  <FaEnvelope className="form-field-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject / Inquiry Type</label>
                <select
                  id="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Security Tool Feedback">Security Tool Feedback</option>
                  <option value="Article Suggestion">Article Suggestion</option>
                  <option value="Academic Project Question">Academic Project Question</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <div className="input-with-icon textarea-wrap">
                  <FaCommentAlt className="form-field-icon textarea-icon" />
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Write your question, suggestion, or feedback here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="contact-btn">
                <FaPaperPlane />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Contact;