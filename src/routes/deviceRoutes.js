const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/create", /*adminMiddleware,*/ deviceController.createDevice);
router.delete(
  "/delete/:deviceId",
  // adminMiddleware,
  deviceController.deleteDevice
);
router.put(
  "/set-alarm-triggered-on/:hwId",
  // authMiddleware,
  deviceController.setAlarmTriggeredOnByHwId
);
router.put(
  "/set-alarm-triggered-off/:hwId",
  // authMiddleware,
  deviceController.setAlarmTriggeredOffByHwId
);
router.put(
  "/set-state-active",
  // authMiddleware,
  deviceController.setStateActive
);
router.put(
  "/set-state-deactive",
  // authMiddleware,
  deviceController.setStateDeactive
);

module.exports = router;
