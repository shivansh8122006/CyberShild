const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  adminLogin,
  getAdminDashboard,
  getAdminUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getSecurityOverview,
  updateAdminProfile,
  changeAdminPassword,
} = require("../controllers/adminController");

// Public Admin Route
router.post("/login", adminLogin);

// Protected Admin Routes (Requires valid JWT + Admin Role)
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/security", getSecurityOverview);
router.put("/settings/profile", updateAdminProfile);
router.put("/settings/password", changeAdminPassword);

module.exports = router;
