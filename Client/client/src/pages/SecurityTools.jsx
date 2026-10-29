import { useState, useEffect } from "react";
import {
  FaLock,
  FaKey,
  FaLink,
  FaHashtag,
  FaCopy,
  FaCheck,
  FaShieldAlt,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCheckCircle,
  FaInfoCircle,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "./SecurityTools.css";

function SecurityTools() {
  const [activeTab, setActiveTab] = useState("strength");

  // ==========================================
  // Tool 1: Password Strength Analyzer State
  // ==========================================
  const [strengthInput, setStrengthInput] = useState("");
  const [showStrengthPassword, setShowStrengthPassword] = useState(false);
  const [strengthResult, setStrengthResult] = useState({
    score: 0,
    label: "None",
    color: "#64748b",
    crackTime: "Instant",
    entropy: 0,
    checks: {
      length: false,
      upper: false,
      lower: false,
      numbers: false,
      symbols: false,
    },
  });

  useEffect(() => {
    evaluatePassword(strengthInput);
  }, [strengthInput]);

  const evaluatePassword = (pass) => {
    if (!pass) {
      setStrengthResult({
        score: 0,
        label: "None",
        color: "#64748b",
        crackTime: "Instant",
        entropy: 0,
        checks: {
          length: false,
          upper: false,
          lower: false,
          numbers: false,
          symbols: false,
        },
      });
      return;
    }

    const length = pass.length >= 12;
    const upper = /[A-Z]/.test(pass);
    const lower = /[a-z]/.test(pass);
    const numbers = /[0-9]/.test(pass);
    const symbols = /[^A-Za-z0-9]/.test(pass);

    let pool = 0;
    if (lower) pool += 26;
    if (upper) pool += 26;
    if (numbers) pool += 10;
    if (symbols) pool += 33;

    const entropy = pool > 0 ? Math.round(pass.length * Math.log2(pool)) : 0;

    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    if (upper && lower) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;

    let label = "Weak";
    let color = "#ef4444";
    let crackTime = "A few seconds";

    if (entropy < 28) {
      label = "Very Weak";
      color = "#ef4444";
      crackTime = "Instant (< 1 ms)";
    } else if (entropy < 45) {
      label = "Weak";
      color = "#f97316";
      crackTime = "A few minutes to hours";
    } else if (entropy < 65) {
      label = "Medium";
      color = "#eab308";
      crackTime = "Several months to years";
    } else if (entropy < 85) {
      label = "Strong";
      color = "#10b981";
      crackTime = "Centuries";
    } else {
      label = "Very Strong";
      color = "#00e5ff";
      crackTime = "Trillions of years (Uncrackable)";
    }

    setStrengthResult({
      score: Math.min(100, Math.round((entropy / 90) * 100)),
      label,
      color,
      crackTime,
      entropy,
      checks: { length, upper, lower, numbers, symbols },
    });
  };

  // ==========================================
  // Tool 2: Password Generator State
  // ==========================================
  const [genLength, setGenLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copiedGen, setCopiedGen] = useState(false);

  const generatePassword = () => {
    let chars = "";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

    let result = "";
    const array = new Uint32Array(genLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < genLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [genLength, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copyToClipboard = (text, setCopied) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // Tool 3: URL Phishing & Risk Inspector
  // ==========================================
  const [urlInput, setUrlInput] = useState("");
  const [urlAnalysis, setUrlAnalysis] = useState(null);

  const analyzeUrl = () => {
    if (!urlInput.trim()) return;

    let raw = urlInput.trim();
    if (!/^https?:\/\//i.test(raw)) {
      raw = "http://" + raw;
    }

    try {
      const parsed = new URL(raw);
      const isHttps = parsed.protocol === "https:";
      const hostname = parsed.hostname;

      // Checks
      const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      const suspiciousTLDs = [".zip", ".xyz", ".top", ".click", ".work", ".kim", ".country", ".gq", ".tk", ".ml"];
      const hasSuspiciousTLD = suspiciousTLDs.some((tld) => hostname.endsWith(tld));
      const subdomainCount = hostname.split(".").length - 2;
      const hasExcessiveSubdomains = subdomainCount >= 3;
      const containsSuspiciousKeywords = /(verify|secure|account|update|banking|paypal|login|free-gift|signin)/i.test(
        hostname
      );
      const hasPunycode = hostname.startsWith("xn--");

      let riskScore = 0;
      const flags = [];

      if (!isHttps) {
        riskScore += 30;
        flags.push({ level: "warning", text: "Unencrypted HTTP protocol detected (traffic can be intercepted)." });
      } else {
        flags.push({ level: "safe", text: "Valid HTTPS transport encryption protocol." });
      }

      if (isIpAddress) {
        riskScore += 45;
        flags.push({ level: "danger", text: "Host is a raw IP address rather than a legitimate domain name." });
      }

      if (hasSuspiciousTLD) {
        riskScore += 25;
        flags.push({ level: "warning", text: "Top-Level Domain (TLD) has a high statistical correlation with spam." });
      }

      if (hasExcessiveSubdomains) {
        riskScore += 30;
        flags.push({ level: "danger", text: "Excessive subdomain chaining often used in phishing disguise." });
      }

      if (containsSuspiciousKeywords && !hostname.includes("google.com") && !hostname.includes("microsoft.com")) {
        riskScore += 35;
        flags.push({
          level: "danger",
          text: "Deceptive brand or security keywords found in domain name (lookalike spoofing indicator).",
        });
      }

      if (hasPunycode) {
        riskScore += 40;
        flags.push({ level: "danger", text: "Punycode (IDN homograph) detected — characters may mimic standard letters." });
      }

      let verdict = "Safe / Low Risk";
      let verdictColor = "#10b981";

      if (riskScore >= 60) {
        verdict = "High Risk - Potential Phishing Threat";
        verdictColor = "#ef4444";
      } else if (riskScore >= 25) {
        verdict = "Moderate Suspicion - Exercise Caution";
        verdictColor = "#f59e0b";
      }

      setUrlAnalysis({
        rawUrl: raw,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        isHttps,
        isIpAddress,
        riskScore,
        verdict,
        verdictColor,
        flags,
      });
    } catch {
      setUrlAnalysis({
        invalid: true,
        message: "Invalid URL format. Please provide a standard URL (e.g. example.com or https://site.org).",
      });
    }
  };

  // ==========================================
  // Tool 4: Cryptographic Hashing Demonstrator
  // ==========================================
  const [hashInput, setHashInput] = useState("CyberShield2026");
  const [sha256Hash, setSha256Hash] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    computeHash(hashInput);
  }, [hashInput]);

  const computeHash = async (text) => {
    if (!text) {
      setSha256Hash("");
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setSha256Hash(hashHex);
  };

  return (
    <main className="tools-page">
      {/* Hero Header */}
      <section className="tools-hero">
        <div className="tools-badge">
          <FaShieldAlt />
          <span>Interactive Security Toolkit</span>
        </div>
        <h1>Cybersecurity Educational Tools</h1>
        <p>
          Analyze credential entropy, generate cryptographic passwords, evaluate deceptive URL structures, and explore one-way hashing algorithms.
        </p>
      </section>

      {/* Main Tool Container */}
      <section className="tools-container">
        {/* Navigation Tabs */}
        <div className="tools-tabs">
          <button
            className={`tab-btn ${activeTab === "strength" ? "active" : ""}`}
            onClick={() => setActiveTab("strength")}
          >
            <FaLock />
            <span>Password Analyzer</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "generator" ? "active" : ""}`}
            onClick={() => setActiveTab("generator")}
          >
            <FaKey />
            <span>Password Generator</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
            onClick={() => setActiveTab("url")}
          >
            <FaLink />
            <span>URL Risk Inspector</span>
          </button>
          <button
            className={`tab-btn ${activeTab === "hash" ? "active" : ""}`}
            onClick={() => setActiveTab("hash")}
          >
            <FaHashtag />
            <span>Hash Demonstrator</span>
          </button>
        </div>

        {/* Tab 1: Password Strength Analyzer */}
        {activeTab === "strength" && (
          <div className="tool-card">
            <div className="tool-header">
              <h2>Password Strength & Entropy Analyzer</h2>
              <p>Test the resilience of passwords against brute-force attacks and dictionary cracking.</p>
            </div>

            <div className="tool-input-group">
              <label>Enter a sample password to analyze:</label>
              <div className="input-with-action">
                <input
                  type={showStrengthPassword ? "text" : "password"}
                  placeholder="Type password here..."
                  value={strengthInput}
                  onChange={(e) => setStrengthInput(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-vis-btn"
                  onClick={() => setShowStrengthPassword(!showStrengthPassword)}
                >
                  {showStrengthPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <span className="privacy-note">
                <FaInfoCircle /> Note: Passwords are evaluated purely on your local browser. They are never sent to any server.
              </span>
            </div>

            {strengthInput && (
              <div className="strength-results-panel">
                <div className="strength-meter-bar">
                  <div className="meter-header">
                    <span>
                      Strength Level: <strong style={{ color: strengthResult.color }}>{strengthResult.label}</strong>
                    </span>
                    <span className="entropy-tag">{strengthResult.entropy} bits entropy</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${strengthResult.score}%`,
                        backgroundColor: strengthResult.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="crack-time-card">
                  <div className="time-icon-box">
                    <FaShieldAlt style={{ color: strengthResult.color }} />
                  </div>
                  <div className="time-details">
                    <h4>Estimated Brute-Force Time</h4>
                    <p className="time-value" style={{ color: strengthResult.color }}>
                      {strengthResult.crackTime}
                    </p>
                    <span className="time-sub">Based on a 100 Billion guesses/second modern GPU cluster.</span>
                  </div>
                </div>

                <div className="criteria-checklist">
                  <h4>Security Criteria Checklist</h4>
                  <div className="checklist-grid">
                    <div className={`check-item ${strengthResult.checks.length ? "passed" : ""}`}>
                      {strengthResult.checks.length ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>At least 12+ characters</span>
                    </div>
                    <div className={`check-item ${strengthResult.checks.upper ? "passed" : ""}`}>
                      {strengthResult.checks.upper ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Uppercase letters (A-Z)</span>
                    </div>
                    <div className={`check-item ${strengthResult.checks.lower ? "passed" : ""}`}>
                      {strengthResult.checks.lower ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Lowercase letters (a-z)</span>
                    </div>
                    <div className={`check-item ${strengthResult.checks.numbers ? "passed" : ""}`}>
                      {strengthResult.checks.numbers ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Numbers (0-9)</span>
                    </div>
                    <div className={`check-item ${strengthResult.checks.symbols ? "passed" : ""}`}>
                      {strengthResult.checks.symbols ? <FaCheckCircle /> : <FaTimesCircle />}
                      <span>Special symbols (!@#$...)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Password Generator */}
        {activeTab === "generator" && (
          <div className="tool-card">
            <div className="tool-header">
              <h2>Cryptographic Password Generator</h2>
              <p>Generate high-entropy, uncrackable passwords using cryptographically secure random values.</p>
            </div>

            <div className="generated-display-box">
              <div className="password-text">{generatedPassword}</div>
              <div className="gen-actions">
                <button
                  className="btn-action copy"
                  onClick={() => copyToClipboard(generatedPassword, setCopiedGen)}
                >
                  {copiedGen ? <FaCheck /> : <FaCopy />}
                  <span>{copiedGen ? "Copied!" : "Copy"}</span>
                </button>
                <button className="btn-action regenerate" onClick={generatePassword}>
                  <FaSyncAlt />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            <div className="gen-controls">
              <div className="length-slider-group">
                <div className="slider-header">
                  <label>Password Length:</label>
                  <span className="length-badge">{genLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={genLength}
                  onChange={(e) => setGenLength(Number(e.target.value))}
                  className="cyber-range"
                />
              </div>

              <div className="checkboxes-grid">
                <label className="cyber-checkbox">
                  <input
                    type="checkbox"
                    checked={includeUpper}
                    onChange={(e) => setIncludeUpper(e.target.checked)}
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="cyber-checkbox">
                  <input
                    type="checkbox"
                    checked={includeLower}
                    onChange={(e) => setIncludeLower(e.target.checked)}
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="cyber-checkbox">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="cyber-checkbox">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  <span>Special Symbols (!@#$...)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: URL Phishing & Risk Inspector */}
        {activeTab === "url" && (
          <div className="tool-card">
            <div className="tool-header">
              <h2>Educational URL & Phishing Inspector</h2>
              <p>Analyze link structures, IP addresses, suspicious TLDs, and homograph indicators.</p>
            </div>

            <div className="tool-input-group">
              <label>Enter website link or domain to inspect:</label>
              <div className="url-search-input">
                <input
                  type="text"
                  placeholder="e.g. http://192.168.1.1/login or paypal-verification-update.co"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyzeUrl()}
                />
                <button className="btn-primary" onClick={analyzeUrl}>
                  Inspect URL
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {urlAnalysis && !urlAnalysis.invalid && (
              <div className="url-results-panel">
                <div
                  className="verdict-banner"
                  style={{
                    backgroundColor: `${urlAnalysis.verdictColor}15`,
                    borderColor: urlAnalysis.verdictColor,
                  }}
                >
                  <div className="verdict-icon">
                    {urlAnalysis.riskScore >= 60 ? (
                      <FaTimesCircle style={{ color: urlAnalysis.verdictColor }} />
                    ) : urlAnalysis.riskScore >= 25 ? (
                      <FaExclamationTriangle style={{ color: urlAnalysis.verdictColor }} />
                    ) : (
                      <FaCheckCircle style={{ color: urlAnalysis.verdictColor }} />
                    )}
                  </div>
                  <div>
                    <h3 style={{ color: urlAnalysis.verdictColor }}>{urlAnalysis.verdict}</h3>
                    <p>Risk Score: {urlAnalysis.riskScore} / 100</p>
                  </div>
                </div>

                <div className="url-breakdown-card">
                  <h4>Technical Breakdown</h4>
                  <div className="breakdown-grid">
                    <div className="breakdown-item">
                      <span className="bd-label">Hostname:</span>
                      <span className="bd-value">{urlAnalysis.hostname}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="bd-label">Protocol:</span>
                      <span className={`bd-value ${urlAnalysis.isHttps ? "safe" : "danger"}`}>
                        {urlAnalysis.protocol}
                      </span>
                    </div>
                    <div className="breakdown-item">
                      <span className="bd-label">Host Type:</span>
                      <span className="bd-value">{urlAnalysis.isIpAddress ? "Raw IP Address (Suspicious)" : "Domain Name"}</span>
                    </div>
                  </div>
                </div>

                <div className="flags-list">
                  <h4>Detailed Indicator Checks</h4>
                  {urlAnalysis.flags.map((flag, idx) => (
                    <div key={idx} className={`flag-item ${flag.level}`}>
                      {flag.level === "danger" && <FaTimesCircle />}
                      {flag.level === "warning" && <FaExclamationTriangle />}
                      {flag.level === "safe" && <FaCheckCircle />}
                      <span>{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {urlAnalysis?.invalid && (
              <div className="url-invalid-alert">
                <FaExclamationTriangle />
                <span>{urlAnalysis.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Cryptographic Hashing Demonstrator */}
        {activeTab === "hash" && (
          <div className="tool-card">
            <div className="tool-header">
              <h2>Cryptographic Hash Demonstrator (SHA-256)</h2>
              <p>
                Experience the <strong>Avalanche Effect</strong>: changing even a single character produces a completely different 256-bit cryptographic digest.
              </p>
            </div>

            <div className="tool-input-group">
              <label>Type text to compute live SHA-256 digest:</label>
              <textarea
                rows="3"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Type any message or password here..."
              ></textarea>
            </div>

            <div className="hash-output-container">
              <div className="hash-meta-header">
                <span>SHA-256 Output (64 Hex Characters / 256 Bits):</span>
                <button
                  className="copy-hash-btn"
                  onClick={() => copyToClipboard(sha256Hash, setCopiedHash)}
                >
                  {copiedHash ? <FaCheck /> : <FaCopy />}
                  <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                </button>
              </div>
              <div className="hash-value-box">{sha256Hash || "No input"}</div>
            </div>

            <div className="hash-educational-notes">
              <h4>
                <FaInfoCircle /> Why Hashing Matters in Cybersecurity
              </h4>
              <ul>
                <li>
                  <strong>One-Way Function</strong>: It is mathematically infeasible to reverse a hash back to its original plaintext.
                </li>
                <li>
                  <strong>Deterministic</strong>: The same input always produces the exact same hash output.
                </li>
                <li>
                  <strong>Collision Resistant</strong>: It is practically impossible to find two different inputs with identical hashes.
                </li>
                <li>
                  <strong>Usage</strong>: Used by websites to store passwords safely, verify software download integrity, and power blockchain ledgers.
                </li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default SecurityTools;
