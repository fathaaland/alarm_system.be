const Log = require("../models/Log");
const Household = require("../models/Household");
const { logDB } = require("../db/dbConnection");

exports.createLog = async (logData) => {
  try {
    const newLog = new logDB({
      name: logData.name,
      type: logData.type,
      active: logData.active,
      alarm_triggered: logData.alarm_triggered,
      householdId: logData.householdId,
      hw_id: logData.hw_id,
      createdBy: logData.createdBy,
      isAdminCreated: true,
    });

    await newLog.save();
    return newLog;
  } catch (error) {
    throw error;
  }
};
