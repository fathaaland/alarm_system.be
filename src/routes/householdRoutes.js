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

// router.put(
//   "/add-user/:id",
//   authMiddleware,
//   householdController.addUserHousehold
// );

// router.put(
//   "/remove-user/:id",
//   authMiddleware,
//   householdController.removeUserHousehold
// );

module.exports = router;
