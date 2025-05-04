const Log = require("../models/Log");
const Household = require("../models/Household");

exports.createLog = async (logData) => {
  try {
    const newLog = new Log({
      userId: logData.userId,
      deviceId: logData.deviceId,
      householdId: logData.householdId,
      type: logData.type,
      message: logData.message,
    });

    await newLog.save();

    await Household.findByIdAndUpdate(
      logData.householdId,
      { $push: { logs: newLog._id } },
      { new: true }
    );

    return newLog;
  } catch (error) {
    throw error;
  }
};

exports.deleteLogById = async (logId, adminId) => {
  try {
    const log = await Log.findById(logId);
    if (!log) {
      throw new Error("Log not found");
    }

    const result = await Log.findByIdAndDelete(logId);

    await Household.findByIdAndUpdate(
      log.householdId,
      { $pull: { logs: logId } },
      { new: true }
    );

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

exports.getLogById = async (logId, userId, householdId) => {
  try {
    const log = await Log.findOne({
      _id: logId,
      householdId: householdId,
    });

    if (!log) {
      throw new Error("Log not found in this household");
    }

    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: userId }, { members: userId }],
    });

    if (!household) {
      throw new Error("You don't have access to this household");
    }

    return log;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
