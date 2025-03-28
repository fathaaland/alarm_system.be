const User = require("../models/User");

exports.user = async (userData) => {
  try {
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.lastName,
      email: userData.email,
      role: userData.role || "",
      refreshToken: userData.refreshToken,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
