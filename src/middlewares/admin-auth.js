const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Admin token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_FOR_ADMIN);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid admin token." });
  }
};

module.exports = auth;
