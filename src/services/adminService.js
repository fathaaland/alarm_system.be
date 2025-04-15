const jwt = require("jsonwebtoken");

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
