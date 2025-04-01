const express = require("express");
const router = express.Router();
const householdController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/auth");

router.post("/create", authMiddleware, householdController.createDevice);

module.exports = router;
