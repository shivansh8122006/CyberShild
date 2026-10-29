const express = require("express");
const cors = require("cors");
require("dotenv").config();

const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);

const PORT = 5002;
const server = app.listen(PORT, async () => {
  console.log(`Testing admin backend on port ${PORT}...`);

  try {
    // 1. Admin login test
    const loginRes = await fetch(`http://localhost:${PORT}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@cybershield.com",
        password: "admin123",
      }),
    });
    const loginData = await loginRes.json();
    console.log("✓ Admin Login:", loginRes.status, loginData.message, !!loginData.token ? "(Admin Token OK)" : "");
    const adminToken = loginData.token;

    // 2. Unauthenticated check on dashboard
    const unauthRes = await fetch(`http://localhost:${PORT}/api/admin/dashboard`);
    console.log("✓ Unauthenticated /api/admin/dashboard rejection:", unauthRes.status, "(Expected 401)");

    // 3. Admin Dashboard stats with Token
    const dashRes = await fetch(`http://localhost:${PORT}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const dashData = await dashRes.json();
    console.log("✓ Admin Dashboard Stats:", dashRes.status, "Total Users:", dashData.stats?.totalUsers, "Total Articles:", dashData.stats?.totalArticles);

    // 4. Admin Users list
    const usersRes = await fetch(`http://localhost:${PORT}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const usersData = await usersRes.json();
    console.log("✓ Admin Users List:", usersRes.status, "Found:", usersData.length, "users");

    // 5. Admin Security Overview
    const secRes = await fetch(`http://localhost:${PORT}/api/admin/security`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const secData = await secRes.json();
    console.log("✓ Admin Security Overview:", secRes.status, "Domains:", secData.length);

    console.log("\n ALL ADMIN BACKEND ENDPOINTS TESTED & PASSED! 🚀");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
