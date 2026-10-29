const mongoose = require("mongoose");
const Article = require("../models/Article");

// Fallback initial articles for high availability and offline demonstration
const DEFAULT_ARTICLES = [
  {
    _id: "66d000000000000000000001",
    title: "How to Create and Manage Strong Passwords",
    description: "Learn essential password security practices, entropy principles, and how password managers keep accounts safe.",
    category: "Password Security",
    content: `Passwords remain the first line of defense in digital security. However, millions of user credentials are leaked yearly due to predictable patterns and credential stuffing attacks.

### Key Rules for Strong Passwords:
1. **Length Over Complexity**: A 16-character passphrase provides vastly higher entropy than a complex 8-character string.
2. **Never Reuse Passwords**: If a single service is compromised, attackers use automated credential stuffing to breach your other accounts.
3. **Use a Dedicated Password Manager**: Tools like Bitwarden, 1Password, or KeePass generate and store unique, high-entropy passwords securely.
4. **Enable Multi-Factor Authentication (MFA)**: Even if an attacker discovers your password, MFA stops unauthorized access.`,
    createdAt: new Date("2026-08-20T10:00:00Z"),
  },
  {
    _id: "66d000000000000000000002",
    title: "How to Identify and Avoid Phishing Attacks",
    description: "Understand the mechanics of phishing emails, spear phishing, and spoofed domains to protect your credentials.",
    category: "Phishing",
    content: `Phishing is a deceptive social engineering attack where attackers impersonate trustworthy entities (like banks, employers, or popular services) to steal credentials or financial data.

### Common Red Flags of Phishing Emails:
- **Urgent or Threatening Tone**: Phrases like "Account Suspended in 24 Hours!" or "Immediate Action Required".
- **Mismatched Sender Address**: The display name says "Google Support", but the sender email is from an unofficial domain.
- **Suspicious Links**: Hovering over links reveals mismatched or newly registered domains.
- **Unexpected Attachments**: Files disguised as invoices or receipts (.zip, .exe, .html, or macro-enabled documents).

### Prevention Best Practices:
Always verify the sender's authentic domain, navigate directly to official websites rather than clicking email links, and report suspicious emails to your IT security team.`,
    createdAt: new Date("2026-08-22T11:30:00Z"),
  },
  {
    _id: "66d000000000000000000003",
    title: "Understanding Network Security and Firewalls",
    description: "Explore the fundamentals of network protection, packet filtering, ports, and encryption in modern networks.",
    category: "Network Security",
    content: `Network security consists of policies and practices designed to prevent unauthorized access, misuse, modification, or denial of computer networks and network-accessible resources.

### Core Concepts:
- **Firewalls**: Acts as a protective barrier inspecting incoming and outgoing traffic based on predetermined security rules.
- **Port Security**: Open, unmonitored ports are frequent entry points for port scans and exploits.
- **Virtual Private Networks (VPNs)**: Encrypts network traffic across untrusted public networks, protecting data from eavesdropping.
- **Network Segmentation**: Dividing a network into subnetworks to contain potential security breaches from spreading.`,
    createdAt: new Date("2026-08-24T14:15:00Z"),
  },
  {
    _id: "66d000000000000000000004",
    title: "What is Malware? Types, Vectors, and Protection",
    description: "Learn about viruses, trojans, spyware, ransomware, and how modern endpoint security defends against them.",
    category: "Malware",
    content: `Malware (malicious software) refers to any intrusive program written to cause harm to computers, servers, clients, or networks.

### Major Types of Malware:
- **Ransomware**: Encrypts victim data and demands payment (usually cryptocurrency) for the decryption key.
- **Trojans**: Disguises as legitimate software but delivers malicious payloads.
- **Spyware & Keyloggers**: Secretly monitors keystrokes, browsing history, and credentials.
- **Worms**: Self-replicating malware that spreads across networks without human interaction.

### How to Stay Protected:
Keep all operating systems and software patched, deploy updated endpoint protection, disable macro execution on untrusted documents, and maintain regular offline backups.`,
    createdAt: new Date("2026-08-25T09:00:00Z"),
  },
  {
    _id: "66d000000000000000000005",
    title: "Understanding Two-Factor Authentication (2FA)",
    description: "Why passwords alone are insufficient and how authenticator apps and security keys safeguard your identity.",
    category: "Authentication",
    content: `Two-Factor Authentication (2FA) is a security process where a user provides two distinct authentication factors to verify their identity.

### The Three Authentication Factors:
1. **Something You Know**: Password, PIN, or security question.
2. **Something You Have**: Authenticator app (TOTP), SMS OTP, hardware security key (YubiKey).
3. **Something You Are**: Biometrics like fingerprint or facial recognition.

### Why SMS 2FA is Vulnerable:
SMS OTPs are prone to SIM swapping attacks and SS7 interception. Time-based One-Time Passwords (TOTP apps) and hardware security keys provide much stronger resistance against interception and phishing.`,
    createdAt: new Date("2026-08-26T16:45:00Z"),
  },
  {
    _id: "66d000000000000000000006",
    title: "The Zero Trust Security Model Explained",
    description: "Discover why perimeter defense alone failed and how 'Never Trust, Always Verify' protects modern applications.",
    category: "Zero Trust",
    content: `Zero Trust is a cybersecurity paradigm centered on the belief that organizations should not automatically trust anything inside or outside its perimeters.

### Core Pillars of Zero Trust:
- **Never Trust, Always Verify**: Continuously authenticate and authorize every user and device access request.
- **Principle of Least Privilege (PoLP)**: Restrict user and service access only to the minimal resources needed for their specific tasks.
- **Assume Breach**: Operate with the presumption that adversaries are already inside the network, monitoring lateral movement and applying micro-segmentation.`,
    createdAt: new Date("2026-08-27T12:20:00Z"),
  },
  {
    _id: "66d000000000000000000007",
    title: "Public Wi-Fi Risks and Safe Browsing Habits",
    description: "Understand Man-in-the-Middle (MitM) attacks, evil twins, and how to safely access the internet in public spaces.",
    category: "Privacy",
    content: `Public Wi-Fi networks in cafes, airports, and hotels are convenient but inherently untrusted environments.

### Potential Public Wi-Fi Threats:
- **Man-in-the-Middle (MitM)**: Attackers intercept communication between your device and the router.
- **Evil Twin Rogue APs**: Fake Wi-Fi hotspots mimicking authentic names to harvest traffic.
- **Packet Sniffing**: Unencrypted traffic can be analyzed with packet analyzers like Wireshark.

### Protective Measures:
- Always use a trusted VPN on public networks.
- Verify websites enforce HTTPS with valid SSL/TLS certificates.
- Disable auto-connect to open Wi-Fi networks on mobile devices and laptops.`,
    createdAt: new Date("2026-08-28T08:10:00Z"),
  },
  {
    _id: "66d000000000000000000008",
    title: "Social Engineering: The Human Element of Hacking",
    description: "Explore psychological manipulation tactics like pretexting, baiting, tailgating, and how to build strong defense habits.",
    category: "Social Engineering",
    content: `Social engineering attacks manipulate individuals into divulging confidential information or performing actions that compromise security.

### Common Social Engineering Techniques:
- **Pretexting**: Creating an invented scenario (e.g. an auditor needing urgent system credentials).
- **Baiting**: Leaving infected USB drives in parking lots hoping someone plugs them in.
- **Quid Pro Quo**: Offering a fake service or benefit in exchange for credentials.
- **Vishing & Smishing**: Voice phishing phone calls and SMS scam messages.

### Defense Strategy:
Cultivate a culture of skepticism, always verify identity through out-of-band channels, and never share credentials under pressure.`,
    createdAt: new Date("2026-08-29T09:00:00Z"),
  },
];

// CREATE
const createArticle = async (req, res) => {
  try {
    const { title, description, category, content } = req.body;

    if (!title || !description || !category || !content) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const article = await Article.create({
        title,
        description,
        category,
        content,
      });
      return res.status(201).json({
        message: "Article created successfully",
        article,
      });
    }

    // In-memory fallback
    const newArticle = {
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      description,
      category,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    DEFAULT_ARTICLES.unshift(newArticle);

    res.status(201).json({
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create article",
      error: error.message,
    });
  }
};

// READ ALL
const getArticles = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const articles = await Article.find().sort({ createdAt: -1 });
      if (articles.length > 0) {
        return res.status(200).json(articles);
      }
    }
    res.status(200).json(DEFAULT_ARTICLES);
  } catch (error) {
    res.status(200).json(DEFAULT_ARTICLES);
  }
};

// READ ONE
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const article = await Article.findById(id);
      if (article) {
        return res.status(200).json(article);
      }
    }

    const fallbackArticle = DEFAULT_ARTICLES.find(
      (a) => a._id.toString() === id || a.title.toLowerCase().replace(/[^a-z0-9]/g, "-") === id
    );

    if (fallbackArticle) {
      return res.status(200).json(fallbackArticle);
    }

    return res.status(404).json({
      message: "Article not found",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch article",
      error: error.message,
    });
  }
};

// UPDATE
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid article ID format",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const article = await Article.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      return res.status(200).json({
        message: "Article updated successfully",
        article,
      });
    }

    const index = DEFAULT_ARTICLES.findIndex((a) => a._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ message: "Article not found" });
    }

    DEFAULT_ARTICLES[index] = { ...DEFAULT_ARTICLES[index], ...req.body, updatedAt: new Date() };

    res.status(200).json({
      message: "Article updated successfully",
      article: DEFAULT_ARTICLES[index],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update article",
      error: error.message,
    });
  }
};

// DELETE
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid article ID format",
      });
    }

    if (mongoose.connection.readyState === 1) {
      const article = await Article.findByIdAndDelete(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      return res.status(200).json({
        message: "Article deleted successfully",
      });
    }

    const index = DEFAULT_ARTICLES.findIndex((a) => a._id.toString() === id);
    if (index === -1) {
      return res.status(404).json({ message: "Article not found" });
    }

    DEFAULT_ARTICLES.splice(index, 1);
    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete article",
      error: error.message,
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};