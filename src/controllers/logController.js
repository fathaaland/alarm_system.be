const Log = require("../models/Log");
const Household = require("../models/Household");
const mongoose = require("mongoose");
const logService = require("../services/logService");

exports.createLog = async (req, res) => {
  try {
    const { userId, logId, type, message, time } = req.body;

    if (!userId || !logId || !type || !message || !time) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const newLog = await logService.createLog({
      userId,
      logId,
      type,
      message,
      time,
    });

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
