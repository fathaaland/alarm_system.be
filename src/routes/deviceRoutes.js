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
router.put(
  "/device/set-alarm_triggered-on",
  authMiddleware,
  deviceController.setAlarmTriggeredOn
);
router.put(
  "/device/set-alarm_triggered-off",
  authMiddleware,
  deviceController.setAlarmTriggeredOff
);
router.put(
  "/device/set-state-active",
  authMiddleware,
  deviceController.setStateActive
);
router.put(
  "/device/set-state-deactive",
  authMiddleware,
  deviceController.setStateDeactive
);

module.exports = router;
