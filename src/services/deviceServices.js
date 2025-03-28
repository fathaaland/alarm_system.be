const Device = require("../models/Device");

exports.device = async (deviceData) => {
  try {
    const newDevice = new Device({
      name: deviceData.name,
      type: deviceData.type,
      active: deviceData.active,
      alarm_triggered: deviceData.alarm_triggered,
    });

    await newDevice.save();
    return newDevice;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
