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

exports.deleteLogById = async (req, res) => {
  try {
    const { logId } = req.params;

    if (!logId) {
      return res.status(400).json({ success: false, error: "Missing log ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(logId)) {
      return res.status(400).json({ success: false, error: "Invalid log ID" });
    }

    const deletedLog = await logService.deleteLogById(logId);

    if (!deletedLog) {
      return res.status(404).json({ success: false, error: "Log not found" });
    }

    res.status(200).json({ success: true, data: deletedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { householdId } = req.params;

    if (!householdId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing household ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(householdId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid household ID" });
    }

    const logs = await logService.getLogs(householdId);

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
