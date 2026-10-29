const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "cybershield_super_secret_jwt_key_2026";

// Fallback in-memory users for offline resilience
const DEFAULT_USERS = [
  {
    _id: "66d000000000000000000099",
    name: "System Administrator",
    email: "admin@cybershield.com",
    // bcrypt hash of "admin123"
    password: "$2a$10$7ZkYk5E7Zkv6C9yXo4Kkku8Jm8Z2l5.Jp9rVbTqU3xW4qM6sT0lOi",
    role: "admin",
    status: "active",
    createdAt: new Date("2026-08-01T00:00:00Z"),
  }
];

// Helper to generate JWT token
const generateToken = (userId, email, role = "user") => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(400).json({
          message: "A user with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // First registered user or specified admin can be admin, otherwise "user"
      const totalCount = await User.countDocuments();
      const role = totalCount === 0 ? "admin" : "user";

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
        status: "active",
      });

      const token = generateToken(user._id, user.email, user.role);

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    }

    // In-memory fallback
    const foundInMemory = DEFAULT_USERS.find((u) => u.email === normalizedEmail);
    if (foundInMemory) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mockId = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: mockId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      status: "active",
      createdAt: new Date(),
    };
    DEFAULT_USERS.push(newUser);

    const token = generateToken(mockId, normalizedEmail, "user");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: mockId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (user.status === "suspended") {
        return res.status(403).json({
          message: "Account suspended. Please contact administrator.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user._id, user.email, user.role);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          status: user.status || "active",
        },
      });
    }

    // In-memory fallback
    const user = DEFAULT_USERS.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Account suspended. Please contact administrator.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id, user.email, user.role || "user");

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        status: user.status || "active",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};

// GET CURRENT USER PROFILE
const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        return res.status(200).json(user);
      }
    }

    const fallback = DEFAULT_USERS.find((u) => u._id === decoded.id);
    if (fallback) {
      const { password, ...userWithoutPassword } = fallback;
      return res.status(200).json(userWithoutPassword);
    }

    res.status(200).json({
      id: decoded.id,
      email: decoded.email,
      name: "Security Learner",
      role: decoded.role || "user",
      status: "active",
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  DEFAULT_USERS,
  generateToken,
};