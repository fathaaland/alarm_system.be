const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middlewares/auth");

router.post("/create", authMiddleware, householdController.createHousehold);

router.delete(
  "/delete/:id",
  authMiddleware,
  householdController.deleteHousehold
);

router.put(
  "/add-user/:id",
  authMiddleware,
  householdController.addUserToHousehold
);

module.exports = router;
