const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminRefreshToken,
  adminLogout,
} = require("../controllers/admin-authController");

// Admin auth routes
router.post("/admin/login", adminLogin);
router.post("/admin/refresh-token", adminRefreshToken);
router.post("/admin/logout", adminLogout);

module.exports = router;
