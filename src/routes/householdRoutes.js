const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware, householdController.createHousehold);
