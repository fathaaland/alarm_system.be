const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Admin authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin privileges required" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid admin token" });
    }
    res.status(500).json({ message: "Admin authentication failed" });
  }
};

module.exports = adminAuth;
