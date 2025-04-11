const express = require("express");
const router = express.Router();
const householdController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, householdController.getHousehold);
router.get("/:id", authMiddleware, householdController.getHouseholdById);
router.get("/whole", authMiddleware, householdController.getWholeHouseholds);

module.exports = router;
