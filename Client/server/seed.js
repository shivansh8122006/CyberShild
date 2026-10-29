const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const Article = require("./models/Article");
const User = require("./models/User");

const initialArticles = [
  {
    title: "How to Create and Manage Strong Passwords",
    description: "Learn essential password security practices, entropy principles, and how password managers keep accounts safe.",
    category: "Password Security",
    content: `Passwords remain the first line of defense in digital security. However, millions of user credentials are leaked yearly due to predictable patterns and credential stuffing attacks.

### Key Rules for Strong Passwords:
1. **Length Over Complexity**: A 16-character passphrase (e.g., \`correct-horse-battery-staple\`) provides vastly higher entropy than a complex 8-character string (\`P@ss1!\`).
2. **Never Reuse Passwords**: If a single service is compromised, attackers use automated credential stuffing to breach your other accounts.
3. **Use a Dedicated Password Manager**: Tools like Bitwarden, 1Password, or KeePass generate and store unique, high-entropy passwords securely.
4. **Enable Multi-Factor Authentication (MFA)**: Even if an attacker discovers your password, MFA stops unauthorized access.`,
  },
  {
    title: "How to Identify and Avoid Phishing Attacks",
    description: "Understand the mechanics of phishing emails, spear phishing, and spoofed domains to protect your credentials.",
    category: "Phishing",
    content: `Phishing is a deceptive social engineering attack where attackers impersonate trustworthy entities (like banks, employers, or popular services) to steal credentials or financial data.

### Common Red Flags of Phishing Emails:
- **Urgent or Threatening Tone**: Phrases like "Account Suspended in 24 Hours!" or "Immediate Action Required".
- **Mismatched Sender Address**: The display name says "Google Support", but the sender email is \`support@google-account-verify.co\`.
- **Suspicious Links**: Hovering over links reveals mismatched or newly registered domains.
- **Unexpected Attachments**: Files disguised as invoices or receipts (e.g., \`.zip\`, \`.exe\`, \`.html\`, or macro-enabled documents).

### Prevention Best Practices:
Always verify the sender's authentic domain, navigate directly to official websites rather than clicking email links, and report suspicious emails to your IT security team.`,
  },
  {
    title: "Understanding Network Security and Firewalls",
    description: "Explore the fundamentals of network protection, packet filtering, ports, and encryption in modern networks.",
    category: "Network Security",
    content: `Network security consists of policies and practices designed to prevent unauthorized access, misuse, modification, or denial of computer networks and network-accessible resources.

### Core Concepts:
- **Firewalls**: Acts as a protective barrier inspecting incoming and outgoing traffic based on predetermined security rules.
- **Port Security**: Open, unmonitored ports (e.g., Port 21 FTP, Port 23 Telnet, Port 3389 RDP) are frequent entry points for port scans and exploits.
- **Virtual Private Networks (VPNs)**: Encrypts network traffic across untrusted public networks, protecting data from eavesdropping.
- **Network Segmentation**: Dividing a network into subnetworks to contain potential security breaches from spreading to sensitive segments.`,
  },
  {
    title: "What is Malware? Types, Vectors, and Protection",
    description: "Learn about viruses, trojans, spyware, ransomware, and how modern endpoint security defends against them.",
    category: "Malware",
    content: `Malware (malicious software) refers to any intrusive program written to cause harm to computers, servers, clients, or networks.

### Major Types of Malware:
- **Ransomware**: Encrypts victim data and demands payment (usually cryptocurrency) for the decryption key.
- **Trojans**: Disguises as legitimate software (utilities, games) but delivers malicious payloads.
- **Spyware & Keyloggers**: Secretly monitors keystrokes, browsing history, and credentials.
- **Worms**: Self-replicating malware that spreads across networks without human interaction.

### How to Stay Protected:
Keep all operating systems and software patched, deploy updated endpoint protection (Antivirus/EDR), disable macro execution on untrusted documents, and maintain regular offline backups.`,
  },
  {
    title: "Understanding Two-Factor Authentication (2FA)",
    description: "Why passwords alone are insufficient and how authenticator apps and security keys safeguard your identity.",
    category: "Authentication",
    content: `Two-Factor Authentication (2FA) is a security process where a user provides two distinct authentication factors to verify their identity.

### The Three Authentication Factors:
1. **Something You Know**: Password, PIN, or security question.
2. **Something You Have**: Authenticator app (TOTP), SMS OTP, hardware security key (YubiKey).
3. **Something You Are**: Biometrics like fingerprint or facial recognition.

### Why SMS 2FA is Vulnerable:
SMS OTPs are prone to SIM swapping attacks and SS7 interception. Time-based One-Time Passwords (TOTP apps like Google Authenticator or Microsoft Authenticator) and FIDO2/WebAuthn hardware keys provide much stronger resistance against interception and phishing.`,
  },
  {
    title: "The Zero Trust Security Model Explained",
    description: "Discover why the traditional perimeter security model failed and how 'Never Trust, Always Verify' protects modern infrastructure.",
    category: "Zero Trust",
    content: `Zero Trust is a cybersecurity paradigm centered on the belief that organizations should not automatically trust anything inside or outside its perimeters.

### Core Pillars of Zero Trust:
- **Never Trust, Always Verify**: Continuously authenticate and authorize every user and device access request.
- **Principle of Least Privilege (PoLP)**: Restrict user and service access only to the minimal resources needed for their specific tasks.
- **Assume Breach**: Operate with the presumption that adversaries are already inside the network, monitoring lateral movement and applying micro-segmentation.`,
  },
  {
    title: "Public Wi-Fi Risks and Safe Browsing Habits",
    description: "Understand Man-in-the-Middle (MitM) attacks, evil twins, and how to safely access the internet in public spaces.",
    category: "Privacy",
    content: `Public Wi-Fi networks in cafes, airports, and hotels are convenient but inherently untrusted environments.

### Potential Public Wi-Fi Threats:
- **Man-in-the-Middle (MitM)**: Attackers intercept communication between your device and the router.
- **Evil Twin Rogue APs**: Fake Wi-Fi hotspots mimicking authentic names (e.g., "Airport_Free_WiFi") to harvest traffic.
- **Packet Sniffing**: Unencrypted traffic can be analyzed with packet analyzers like Wireshark.

### Protective Measures:
- Always use a trusted VPN on public networks.
- Verify websites enforce HTTPS with valid SSL/TLS certificates.
- Disable auto-connect to open Wi-Fi networks on mobile devices and laptops.`,
  },
  {
    title: "Social Engineering: The Human Element of Hacking",
    description: "Explore psychological manipulation tactics like pretexting, baiting, tailgating, and how to build strong defense habits.",
    category: "Social Engineering",
    content: `Social engineering attacks manipulate individuals into divulging confidential information or performing actions that compromise security.

### Common Social Engineering Techniques:
- **Pretexting**: Creating an invented scenario (e.g., an auditor needing urgent system credentials).
- **Baiting**: Leaving infected USB drives in parking lots or lobbies hoping someone plugs them in.
- **Quid Pro Quo**: Offering a fake service or benefit in exchange for credentials.
- **Vishing & Smishing**: Voice phishing phone calls and SMS scam messages.

### Defense Strategy:
Cultivate a culture of skepticism, always verify identity through out-of-band channels, and never share credentials under pressure.`,
  },
];

const initialUsers = [
  {
    name: "System Administrator",
    email: "admin@cybershield.com",
    passwordPlain: "admin123",
    role: "admin",
    status: "active",
  },
  {
    name: "Alex Rivera",
    email: "alex.rivera@cybershield.com",
    passwordPlain: "user12345",
    role: "user",
    status: "active",
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@cybershield.com",
    passwordPlain: "user12345",
    role: "user",
    status: "active",
  },
  {
    name: "Rohan Sharma",
    email: "rohan.sharma@cybershield.com",
    passwordPlain: "user12345",
    role: "user",
    status: "active",
  },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("⚠️ MONGO_URI not found in environment variables (.env)");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully to MongoDB Atlas! 🚀\n");

    // 1. Seed Articles
    console.log("--- SEEDING ARTICLES ---");
    for (const item of initialArticles) {
      const existing = await Article.findOne({ title: item.title });
      if (!existing) {
        await Article.create(item);
        console.log(`✓ Added Article: "${item.title}" (${item.category})`);
      } else {
        console.log(`- Article exists: "${item.title}"`);
      }
    }

    // 2. Seed Users & Root Admin
    console.log("\n--- SEEDING ADMIN & USERS ---");
    for (const u of initialUsers) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.passwordPlain, 10);
        await User.create({
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: u.role,
          status: u.status,
        });
        console.log(`✓ Created User: ${u.name} (${u.email}) [Role: ${u.role.toUpperCase()}]`);
      } else {
        // Ensure role is admin if it's admin@cybershield.com
        if (u.email === "admin@cybershield.com" && existing.role !== "admin") {
          existing.role = "admin";
          await existing.save();
          console.log(`✓ Elevated ${existing.email} to ADMIN role.`);
        } else {
          console.log(`- User exists: ${existing.email} [Role: ${existing.role}]`);
        }
      }
    }

    const totalArticles = await Article.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });

    console.log("\n==========================================");
    console.log(" DATABASE INITIALIZATION COMPLETE! 🚀");
    console.log(` • Total Articles in MongoDB Atlas: ${totalArticles}`);
    console.log(` • Total Users in MongoDB Atlas:    ${totalUsers}`);
    console.log(` • Total Admins in MongoDB Atlas:   ${totalAdmins}`);
    console.log("==========================================");
    console.log("\nAdmin Login Credentials:");
    console.log(" Email:    admin@cybershield.com");
    console.log(" Password: admin123");
    console.log(" URL:      http://localhost:5173/admin/login\n");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
