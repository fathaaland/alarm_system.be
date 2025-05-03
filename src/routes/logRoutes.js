const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middlewares/auth");

router.get("/", authMiddleware, logController.getLogs);
router.post("/create", authMiddleware, logController.createLog);
router.get("/delete/:logId", authMiddleware, logController.deleteLogById);

module.exports = router;
