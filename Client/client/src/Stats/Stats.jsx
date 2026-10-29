import { FaBookOpen, FaLightbulb, FaTools, FaUserShield } from "react-icons/fa";
import "./Stats.css";

function Stats() {
  const stats = [
    {
      icon: <FaBookOpen />,
      number: "100+",
      label: "Security Articles",
      desc: "Curated in-depth guides",
    },
    {
      icon: <FaLightbulb />,
      number: "50+",
      label: "Awareness Tips",
      desc: "Actionable defense tips",
    },
    {
      icon: <FaTools />,
      number: "4+",
      label: "Security Tools",
      desc: "Interactive educational utilities",
    },
    {
      icon: <FaUserShield />,
      number: "10K+",
      label: "Students Empowered",
      desc: "Learning digital safety",
    },
  ];

  return (
    <section className="stats">
      <div className="stats-container">
        <div className="stats-heading">
          <span className="stats-badge">Platform Metrics</span>
          <h2>CyberShield at a Glance</h2>
          <p>
            Equipping the next generation of digital citizens with open-source security intelligence and defense tools.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.number}</h3>
              <h4>{stat.label}</h4>
              <p>{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;