const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access forbidden. Admin privileges are required to perform this action.",
    });
  }
  next();
};

module.exports = adminMiddleware;
