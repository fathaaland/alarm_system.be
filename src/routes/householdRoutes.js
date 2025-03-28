const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middlewares/auth");

router.post("/create", authMiddleware, householdController.createHousehold);
router.get("/", authMiddleware, householdController.getHousehold);
router.delete(
  "/delete/:id",
  authMiddleware,
  householdController.deleteHousehold
);

module.exports = router;
