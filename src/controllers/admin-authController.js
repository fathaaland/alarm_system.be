const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/authService");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const generateAdminAuthResponse = (admin) => {
  const accessToken = generateAccessToken(admin.id, admin.role);
  const refreshToken = generateRefreshToken(admin.id, admin.role);

  return {
    message: "Admin login successful.",
    success: true,
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
  };
};

//Admin login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials." });
    }

    const response = generateAdminAuthResponse(admin);
    admin.refreshToken = response.refreshToken;
    await admin.save();

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Admin refresh token
const adminRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing." });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const accessToken = generateAccessToken(admin.id, admin.role);

    res.json({
      message: "Admin access token refreshed successfully.",
      success: true,
      accessToken,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid refresh token." });
  }
};

// Admin logout
const adminLogout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is missing." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (admin) {
      admin.refreshToken = null;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: "Admin logout successful.",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid access token." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  adminLogin,
  adminRefreshToken,
  adminLogout,
};
