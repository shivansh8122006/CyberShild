const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "cybershield_super_secret_jwt_key_2026";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    // If database is connected, fetch fresh user data to verify status
    if (require("mongoose").connection.readyState === 1) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User account no longer exists." });
      }
      if (user.status === "suspended") {
        return res.status(403).json({ message: "Account is suspended. Contact administration." });
      }
      req.user.role = user.role;
      req.user.name = user.name;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session token." });
  }
};

module.exports = authMiddleware;
