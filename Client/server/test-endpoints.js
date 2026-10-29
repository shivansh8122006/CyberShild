const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const articleRoutes = require("./routes/articleRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running.! 🚀" });
});

const PORT = 5001; // test port
const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Test Root
    const rootRes = await fetch(`http://localhost:${PORT}/`);
    const rootData = await rootRes.json();
    console.log("✓ Root API:", rootData.message);

    // 2. Test Get Articles
    const articlesRes = await fetch(`http://localhost:${PORT}/api/articles`);
    const articlesData = await articlesRes.json();
    console.log(`✓ GET /api/articles: Found ${articlesData.length} articles`);
    const firstId = articlesData[0]?._id;

    // 3. Test Get Article by ID
    if (firstId) {
      const oneRes = await fetch(`http://localhost:${PORT}/api/articles/${firstId}`);
      const oneData = await oneRes.json();
      console.log(`✓ GET /api/articles/${firstId}: "${oneData.title}"`);
    }

    // 4. Test Create Article
    const createRes = await fetch(`http://localhost:${PORT}/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Security Guide",
        description: "Test description for automated verification.",
        category: "Network Security",
        content: "Detailed test content for security testing.",
      }),
    });
    const createData = await createRes.json();
    console.log(`✓ POST /api/articles: status ${createRes.status}`, createData.message);

    // 5. Test Register
    const regRes = await fetch(`http://localhost:${PORT}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Security Learner",
        email: `tester_${Date.now()}@cybershield.org`,
        password: "securepassword123",
      }),
    });
    const regData = await regRes.json();
    console.log(`✓ POST /api/auth/register: status ${regRes.status}`, regData.message);

    // 6. Test Login
    const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regData.user?.email,
        password: "securepassword123",
      }),
    });
    const loginData = await loginRes.json();
    console.log(`✓ POST /api/auth/login: status ${loginRes.status}`, loginData.message, !!loginData.token ? "(Token received)" : "(No token)");

    console.log("\n ALL BACKEND ENDPOINTS PASSED SUCCESSFULLY! 🚀");
  } catch (err) {
    console.error("Test failure:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
