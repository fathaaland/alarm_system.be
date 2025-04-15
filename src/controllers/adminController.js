const bcrypt = require("bcryptjs");
const {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminRefreshToken,
} = require("../services/adminService");
const User = require("../models/Admin");
const Admin = require("../models/Admin");

// Register
const register = async (req, res) => {
  const { firstName, lastName, email, password, role = "admin" } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: "First name, last name, email and password are required.",
    });
  }

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    admin = new Admin({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await admin.save(); // Middleware will hash the password

    const accessToken = generateAdminAccessToken(admin.id);
    const refreshToken = generateAdminRefreshToken(admin.id);

    admin.refreshToken = refreshToken;
    await admin.save();

    res.json({
      message: "Admin registered successfully.",
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid admin login credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid admin login credentials." });
    }

    const accessToken = generateAdminAccessToken(admin.id);
    const refreshToken = generateAdminRefreshToken(admin.id);

    admin.refreshToken = refreshToken;
    await admin.save();

    res.json({
      message: "Login successful.",
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing." });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const accessToken = generateAccessToken(user.id);
    res.json({
      message: "Access token refreshed successfully.",
      success: true,
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Invalid refresh token." });
  }
};

// Logout
const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  try {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.json(200, { success: true }, { message: "Logout successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { register, login, refreshToken, logout };
