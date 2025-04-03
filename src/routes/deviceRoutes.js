const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/auth");

router.post("/create", authMiddleware, deviceController.createDevice);
router.delete(
  "/delete/:deviceId",
  authMiddleware,
  deviceController.deleteDevice
);

module.exports = router;
