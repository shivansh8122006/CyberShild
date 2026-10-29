// CyberShield Centralized API Client Service
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Fallback initial cybersecurity articles for guaranteed availability
const FALLBACK_ARTICLES = [
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
    createdAt: new Date("2026-08-20T10:00:00Z").toISOString(),
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
    createdAt: new Date("2026-08-22T11:30:00Z").toISOString(),
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
    createdAt: new Date("2026-08-24T14:15:00Z").toISOString(),
  },
  {
    _id: "66d000000000000000000004",
    title: "What is Malware? Types, Vectors, and Protection",
    description: "Learn about viruses, trojans, spyware, ransomware, and how modern endpoint security defends against them.",
    category: "Malware",
    content: `Malware (malicious software) refers to any intrusive program written to cause harm to computers, servers, clients, or networks.

### Major Types of Malware:
- **Ransomware**: Encrypts victim data and demands payment for the decryption key.
- **Trojans**: Disguises as legitimate software but delivers malicious payloads.
- **Spyware & Keyloggers**: Secretly monitors keystrokes, browsing history, and credentials.
- **Worms**: Self-replicating malware that spreads across networks without human interaction.

### How to Stay Protected:
Keep all operating systems and software patched, deploy updated endpoint protection, disable macro execution on untrusted documents, and maintain regular offline backups.`,
    createdAt: new Date("2026-08-25T09:00:00Z").toISOString(),
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

### Why Authenticator Apps are Preferred:
Time-based One-Time Passwords (TOTP apps) and hardware security keys protect against SIM swapping and SMS interception attacks.`,
    createdAt: new Date("2026-08-26T16:45:00Z").toISOString(),
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
    createdAt: new Date("2026-08-27T12:20:00Z").toISOString(),
  },
];

// Helper for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("cybershield_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Articles API
  async getArticles() {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error("Server responded with error");
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_ARTICLES;
    } catch (error) {
      console.warn("Using fallback articles due to network:", error.message);
      return FALLBACK_ARTICLES;
    }
  },

  async getArticleById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("Using fallback article search:", error.message);
    }
    const found = FALLBACK_ARTICLES.find((a) => a._id === id);
    if (found) return found;
    throw new Error("Article not found");
  },

  async createArticle(articleData) {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(articleData),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to create article");
    }
    return data;
  },

  async updateArticle(id, articleData) {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(articleData),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to update article");
    }
    return data;
  },

  async deleteArticle(id) {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete article");
    }
    return data;
  },

  // Auth API
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }
    return await response.json();
  },

  // ================= ADMIN APIs =================
  async adminLogin(credentials) {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Admin login failed");
    }
    return data;
  },

  async getAdminDashboard() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch admin dashboard");
    }
    return data;
  },

  async getAdminUsers(search = "", role = "all") {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (role !== "all") params.append("role", role);

    const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }
    return data;
  },

  async updateUserRole(id, roleOrStatus) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(roleOrStatus),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update user");
    }
    return data;
  },

  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }
    return data;
  },

  async getAdminSecurity() {
    const response = await fetch(`${API_BASE_URL}/admin/security`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch security domains");
    }
    return data;
  },

  async updateAdminProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/admin/settings/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update admin profile");
    }
    return data;
  },

  async changeAdminPassword(passwordData) {
    const response = await fetch(`${API_BASE_URL}/admin/settings/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(passwordData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }
    return data;
  },
};

export default api;
