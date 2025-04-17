const express = require("express");
const router = express.Router();
const householdController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.get(
  "/whole/:id",
  authMiddleware,
  householdController.getWholeHouseholdById
);
router.get("/", authMiddleware, householdController.getHousehold);
router.get("/:id", authMiddleware, householdController.getHouseholdById);
router.get("/all", authMiddleware, householdController.getAllHouseholds);



module.exports = router;
