const Device = require("../models/Device");

exports.createDevice = async (deviceData) => {
  try {
    const newDevice = new Device({
      name: deviceData.name,
      type: deviceData.type,
      active: deviceData.active,
      alarm_triggered: deviceData.alarm_triggered,
      householdId: deviceData.householdId,
    });

    await newDevice.save();
    return newDevice;
  } catch (error) {
    throw error;
  }
};

exports.deleteDevice = async (deviceId, ownerId) => {
  try {
    const household = await Household.findOne({
      _id: deviceId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }

    await household.deleteOne({ _id: deviceId });

    return household;
  } catch (error) {
    throw error;
  }
};

exports.setAlarmTriggeredOn = async (deviceId) => {
  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      throw new Error("Device not found.");
    }
    device.alarm_triggered = 1;
    await device.save();
    return device;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
