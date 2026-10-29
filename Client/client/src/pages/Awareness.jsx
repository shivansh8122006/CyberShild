import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaFish,
  FaLock,
  FaBug,
  FaUserFriends,
  FaWifi,
  FaKey,
  FaSync,
  FaUserSecret,
  FaGlobe,
  FaDatabase,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
} from "react-icons/fa";
import "./Awareness.css";

const AWARENESS_MODULES = [
  {
    id: "phishing",
    icon: <FaFish />,
    title: "1. Phishing & Email Scams",
    badge: "High Risk Attack Vector",
    overview:
      "Phishing involves attackers impersonating trusted organizations (banks, schools, employers) via emails or messages to steal credentials and sensitive personal data.",
    howItWorks:
      "Attackers craft emails with urgent warnings (e.g. 'Your account has been suspended') containing links to cloned login portals that record your password.",
    dos: [
      "Inspect the exact sender email domain (@company.com vs @company-auth.co).",
      "Navigate directly to official sites rather than clicking email hyperlinks.",
      "Enable multi-factor authentication on all critical accounts.",
    ],
    donts: [
      "Never enter passwords on pages opened from unsolicited email links.",
      "Do not download attachments from unknown senders (.zip, .iso, .exe, .scr).",
      "Never share OTPs or recovery codes with anyone claiming to be support.",
    ],
  },
  {
    id: "passwords",
    icon: <FaLock />,
    title: "2. Password Security & Credential Hygiene",
    badge: "Core Identity Defense",
    overview:
      "Weak and reused passwords are the leading cause of account takeovers through automated credential stuffing and dictionary attacks.",
    howItWorks:
      "Attackers download breached credential lists from the dark web and run botnets to test username/password pairs across hundreds of top websites simultaneously.",
    dos: [
      "Use unique, long passphrases (16+ characters) for every service.",
      "Store and generate passwords using a dedicated password manager.",
      "Regularly check if your email has been compromised in known data breaches.",
    ],
    donts: [
      "Never reuse the same password across multiple platforms.",
      "Avoid predictable patterns like 'Password123!' or personal birthdates.",
      "Never write passwords on sticky notes or unencrypted text files.",
    ],
  },
  {
    id: "malware",
    icon: <FaBug />,
    title: "3. Malware & Ransomware Defense",
    badge: "Endpoint Threat",
    overview:
      "Malicious software damages, disables, or hijacks systems. Ransomware specifically encrypts files and demands extortion payments for decryption.",
    howItWorks:
      "Malware infects machines via pirated software, cracked game installers, drive-by downloads, or malicious macro-enabled documents.",
    dos: [
      "Keep Windows Defender or antivirus definitions updated daily.",
      "Maintain offline, immutable 3-2-1 backup copies of essential files.",
      "Download software exclusively from verified official vendor repositories.",
    ],
    donts: [
      "Never download pirated software, cracks, or torrented utilities.",
      "Do not enable macros on Office documents received from external sources.",
      "Never plug in unknown USB flash drives found in public areas.",
    ],
  },
  {
    id: "social-engineering",
    icon: <FaUserFriends />,
    title: "4. Social Engineering & Pretexting",
    badge: "Psychological Threat",
    overview:
      "Social engineering exploits human psychology rather than technical flaws, tricking individuals into handing over confidential access.",
    howItWorks:
      "Attackers use urgency, authority, or fear (e.g. impersonating the CEO or IT department) to bypass established security validation protocols.",
    dos: [
      "Always verify requests for money or credential resets via a second channel.",
      "Verify the caller identity when receiving unsolicited support phone calls.",
      "Report suspicious pretexting attempts to organizational administrators.",
    ],
    donts: [
      "Never bypass security protocols because of perceived urgency.",
      "Do not allow tailgating through secure building doors without badges.",
      "Never overshare internal infrastructure details on public social media.",
    ],
  },
  {
    id: "wifi",
    icon: <FaWifi />,
    title: "5. Public Wi-Fi & Network Hazards",
    badge: "Network Security",
    overview:
      "Open public Wi-Fi networks in airports, cafes, and hotels expose network traffic to eavesdropping and Man-in-the-Middle (MitM) attacks.",
    howItWorks:
      "Attackers configure rogue access points ('Evil Twins') mimicking legitimate cafe networks to intercept unencrypted traffic and harvest passwords.",
    dos: [
      "Use a reputable Virtual Private Network (VPN) when on public Wi-Fi.",
      "Verify all visited websites enforce valid HTTPS padlock certificates.",
      "Turn off automatic Wi-Fi connections when traveling in public spaces.",
    ],
    donts: [
      "Avoid logging into bank accounts or making purchases on public Wi-Fi.",
      "Never ignore browser SSL/TLS certificate mismatch warnings.",
      "Do not leave file-sharing or Bluetooth discovery turned on in public.",
    ],
  },
  {
    id: "2fa",
    icon: <FaKey />,
    title: "6. Two-Factor Authentication (2FA)",
    badge: "Essential Security Control",
    overview:
      "Two-Factor Authentication adds a critical secondary verification barrier, preventing unauthorized access even if your password is leaked.",
    howItWorks:
      "Logging in requires something you know (password) plus something you have (an authenticator app TOTP code or physical security key).",
    dos: [
      "Prioritize authenticator apps (Google Authenticator, Microsoft Auth) or YubiKeys.",
      "Store account recovery backup codes securely offline.",
      "Enable 2FA immediately on email, financial, and cloud accounts.",
    ],
    donts: [
      "Avoid relying on SMS OTPs when app-based TOTP is supported.",
      "Never approve push notifications you didn't initiate yourself (MFA fatigue attack).",
      "Do not store backup recovery codes in unencrypted notes apps.",
    ],
  },
  {
    id: "updates",
    icon: <FaSync />,
    title: "7. Software Updates & Patch Management",
    badge: "Vulnerability Defense",
    overview:
      "Software updates patch known security vulnerabilities that cybercriminals actively scan and exploit on unpatched systems.",
    howItWorks:
      "When software patches are published, attackers reverse-engineer the fixes to weaponize automated exploits targeting users who delay updating.",
    dos: [
      "Turn on automatic operating system and browser updates.",
      "Update home routers and IoT smart devices regularly.",
      "Uninstall legacy applications that are no longer supported by vendors.",
    ],
    donts: [
      "Do not postpone critical security patches for weeks or months.",
      "Never use deprecated operating systems (e.g. Windows 7/XP) connected to internet.",
      "Do not ignore firmware update notices on home networking equipment.",
    ],
  },
  {
    id: "privacy",
    icon: <FaUserSecret />,
    title: "8. Online Privacy & Digital Footprint",
    badge: "Privacy Protection",
    overview:
      "Your digital footprint—search history, tracking cookies, location data, and public posts—can be scraped for targeted spear-phishing.",
    howItWorks:
      "Data brokers and malicious actors assemble public data points from social media (birthdays, pet names, location) to answer security questions and guess passwords.",
    dos: [
      "Audit social media privacy settings to restrict public visibility.",
      "Use privacy-focused browsers or content blockers to reduce tracking.",
      "Use disposable email aliases for non-essential online signups.",
    ],
    donts: [
      "Do not post boarding passes, work badges, or sensitive paperwork online.",
      "Avoid using real answers for security questions (e.g. 'Mother's Maiden Name').",
      "Never grant smartphone applications unnecessary permissions (location/contacts).",
    ],
  },
  {
    id: "browsing",
    icon: <FaGlobe />,
    title: "9. Safe Browsing & SSL/TLS Certificates",
    badge: "Web Safety",
    overview:
      "Understanding browser warnings, padlock indicators, and malicious redirect tactics protects you from malicious websites and drive-by malware.",
    howItWorks:
      "Malicious ad networks ('malvertising') redirect legitimate traffic to fake virus scanner pages that trick users into downloading trojan utilities.",
    dos: [
      "Verify the exact URL spelling before entering login details.",
      "Use trusted ad blockers to shield against malvertising redirects.",
      "Keep browser security settings on 'Standard' or 'Enhanced' protection.",
    ],
    donts: [
      "Never call phone numbers on popups claiming 'Your Computer is Infected!'.",
      "Do not bypass browser warnings when navigating to suspicious websites.",
      "Never allow notifications from unknown websites.",
    ],
  },
  {
    id: "backup",
    icon: <FaDatabase />,
    title: "10. Data Backup & Ransomware Recovery",
    badge: "Disaster Recovery",
    overview:
      "Robust backups ensure you can restore your data without paying extortion fees or suffering permanent data loss in hardware failure or ransomware events.",
    howItWorks:
      "The 3-2-1 backup strategy ensures you have 3 copies of data on 2 different media types, with 1 copy stored securely off-site or offline.",
    dos: [
      "Follow the 3-2-1 backup rule (3 copies, 2 media types, 1 offsite/offline).",
      "Periodically test restoring data from your backups to verify integrity.",
      "Disconnect external backup drives after backups complete to prevent ransomware encryption.",
    ],
    donts: [
      "Never rely on a single local hard drive for irreplaceable data.",
      "Do not leave backup drives permanently connected and mounted to your PC.",
      "Never pay ransomware ransoms, as attackers frequently fail to provide working keys.",
    ],
  },
];

function Awareness() {
  const [expandedId, setExpandedId] = useState("phishing");

  const toggleModule = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="awareness-page">
      {/* Hero Header */}
      <section className="awareness-hero">
        <div className="awareness-badge">
          <FaBookOpen />
          <span>Security Education & Best Practices</span>
        </div>
        <h1>Cybersecurity Awareness Hub</h1>
        <p>
          Master the 10 essential digital safety domains. Learn how modern cyber attacks operate and adopt practical defense habits to keep your accounts, data, and devices secure.
        </p>
      </section>

      {/* Main Awareness Content */}
      <section className="awareness-container">
        <div className="awareness-intro-box">
          <div className="intro-icon">
            <FaLightbulb />
          </div>
          <div className="intro-text">
            <h3>The Human Firewall</h3>
            <p>
              Over 85% of all cybersecurity breaches involve human error or social engineering. Technical defenses like firewalls and antivirus are only as effective as the awareness of the person using the keyboard.
            </p>
          </div>
        </div>

        {/* 10 Awareness Modules */}
        <div className="modules-list">
          {AWARENESS_MODULES.map((module) => {
            const isExpanded = expandedId === module.id;
            return (
              <div key={module.id} className={`awareness-module-card ${isExpanded ? "open" : ""}`}>
                <div className="module-header" onClick={() => toggleModule(module.id)}>
                  <div className="module-title-wrap">
                    <div className="module-icon">{module.icon}</div>
                    <div>
                      <h2>{module.title}</h2>
                      <span className="module-tag">{module.badge}</span>
                    </div>
                  </div>
                  <button className="toggle-expand-btn">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="module-body">
                    <div className="overview-section">
                      <h4>Overview</h4>
                      <p>{module.overview}</p>
                    </div>

                    <div className="mechanism-section">
                      <h4>How Attackers Exploit It</h4>
                      <p>{module.howItWorks}</p>
                    </div>

                    <div className="dos-donts-grid">
                      <div className="dos-column">
                        <div className="column-title dos">
                          <FaCheckCircle />
                          <span>Defensive Best Practices (DOs)</span>
                        </div>
                        <ul>
                          {module.dos.map((item, idx) => (
                            <li key={idx}>
                              <FaCheckCircle className="bullet-icon do-icon" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="donts-column">
                        <div className="column-title donts">
                          <FaTimesCircle />
                          <span>Risky Behaviors (DON'Ts)</span>
                        </div>
                        <ul>
                          {module.donts.map((item, idx) => (
                            <li key={idx}>
                              <FaTimesCircle className="bullet-icon dont-icon" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="awareness-cta-card">
          <h3>Test Your Understanding</h3>
          <p>Put your security knowledge into practice with our password entropy analyzer and URL inspector.</p>
          <div className="cta-actions">
            <Link to="/tools" className="btn-primary">
              Launch Security Tools
            </Link>
            <Link to="/articles" className="btn-secondary">
              Read Security Guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Awareness;
