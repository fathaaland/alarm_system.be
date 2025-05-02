const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middlewares/auth");
const adminAuth = require("../middlewares/admin");
const WebSocket = require("ws");

router.get("/", authMiddleware, deviceController.getDevices);
router.post("/create", adminAuth, deviceController.createDevice);
router.delete("/delete/:deviceId", adminAuth, deviceController.deleteDevice);
router.put(
  "/set-alarm-triggered-on/:hwId",
  authMiddleware,
  deviceController.setAlarmTriggeredOnByHwId
);
router.put(
  "/set-alarm-triggered-off/:hwId",
  authMiddleware,
  deviceController.setAlarmTriggeredOffByHwId
);

const setupDeviceWebSocket = (wss) => {
  wss.on("connection", (ws, req) => {
    authMiddleware(req, {}, async () => {
      if (!req.user) {
        ws.send(
          JSON.stringify({ success: false, message: "Authentication failed" })
        );
        return ws.close();
      }

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);

          if (data.action === "setStateActive") {
            req.body = data;
            await deviceController.setStateActive(ws, req);
          } else if (data.action === "setStateDeactive") {
            req.body = data;
            await deviceController.setStateDeactive(ws, req);
          } else {
            ws.send(
              JSON.stringify({
                success: false,
                message: "Invalid action",
              })
            );
          }
        } catch (error) {
          ws.send(
            JSON.stringify({
              success: false,
              message: error.message || "Invalid message format",
            })
          );
        }
      });
    });
  });
};

module.exports = {
  router,
  setupDeviceWebSocket,
};
