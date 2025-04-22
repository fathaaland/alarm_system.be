const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminRefreshToken,
  adminLogout,
} = require("../controllers/admin-authController");

// Admin auth routes
router.post("/login", adminLogin);
router.post("/refresh-token", adminRefreshToken);
router.post("/logout", adminLogout);

module.exports = router;
