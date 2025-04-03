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
  "/set-alarm-triggered/:id",
  authMiddleware,
  deviceController.setAlarmTriggeredOn
);
// router.put(
//   "/set-alarm_triggered-off",
//   authMiddleware,
//   deviceController.setAlarmTriggeredOff
// );
// router.put(
//   "/set-state-active",
//   authMiddleware,
//   deviceController.setStateActive
// );
// router.put(
//   "/set-state-deactive",
//   authMiddleware,
//   deviceController.setStateDeactive
// );

module.exports = router;
