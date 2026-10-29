import { FaLock, FaFish, FaNetworkWired, FaShieldAlt } from "react-icons/fa";
import FeatureCard from "./FeaturesCard";
import "./Features.css";

function Features() {
  const features = [
    {
      icon: <FaLock />,
      title: "Password Security",
      description: "Master entropy principles, credential hygiene, and prevent brute-force attacks.",
    },
    {
      icon: <FaFish />,
      title: "Phishing Awareness",
      description: "Spot spoofed sender headers, deceptive domains, and fraudulent attachments.",
    },
    {
      icon: <FaNetworkWired />,
      title: "Network Security",
      description: "Understand packet filtering, firewalls, Wi-Fi risks, and VPN encryption.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Malware Protection",
      description: "Defend against ransomware, trojans, spyware, and zero-day vulnerabilities.",
    },
  ];

  return (
    <section className="features">
      <div className="features-header">
        <span className="features-badge">Core Pillars</span>
        <h2>Why Choose CyberShield?</h2>
        <p>
          We break down complex cybersecurity theories into intuitive, actionable, and visual learning modules designed for real-world defense.
        </p>
      </div>

      <div className="features-container">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;