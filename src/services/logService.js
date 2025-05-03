const Log = require("../models/Log");
const Household = require("../models/Household");

exports.createLog = async (logData) => {
  try {
    const newLog = new Log({
      userId: logData.userId,
      logId: logData.logId,
      type: logData.type,
      message: logData.message,
      time: logData.time,
    });

    await newLog.save();
    return newLog;
  } catch (error) {
    throw error;
  }
};

exports.deleteLog = async (logId, adminId) => {
  try {
    const log = await Log.findById(logId);
    if (!log) {
      throw new Error("Log not found");
    }

    const result = await Log.findByIdAndDelete(logId);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getLogs = async (householdId) => {
  try {
    const logs = await Log.find({ householdId: householdId });
    return logs;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
