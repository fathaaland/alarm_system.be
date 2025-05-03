const Log = require("../models/Log");

exports.getLogs = async (householdId) => {
  try {
    const logs = await Log.find({ householdId: householdId });
    return logs;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
