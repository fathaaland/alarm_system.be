const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const generateAdminAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_FOR_ADMIN, {
    expiresIn: "1h",
  });
};

const generateAdminRefreshToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_FOR_ADMIN, {
    expiresIn: "1d",
  });
};

const verifyAdminRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_FOR_ADMIN);
};

module.exports = {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminRefreshToken,
};

exports.admin = async (adminData) => {
  try {
    const newAdmin = new Admin({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      password: adminData.lastName,
      email: adminData.email,
      role: adminData.role,
      refreshToken: adminData.refreshToken,
    });

    await newAdmin.save();
    return newAdmin;
  } catch (error) {
    throw error;
  }
};
