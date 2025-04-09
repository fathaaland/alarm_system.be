const Device = require("../models/Device");
const Household = require("../models/Household");

exports.createDevice = async (deviceData) => {
  try {
    const newDevice = new Device({
      name: deviceData.name,
      type: deviceData.type,
      active: deviceData.active,
      alarm_triggered: deviceData.alarm_triggered,
      householdId: deviceData.householdId,
      hw_id: deviceData.hw_id,
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

exports.setAlarmTriggeredOn = async (hwId) => {
  try {
    const device = await Device.findById(hwId);
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

exports.setAlarmTriggeredOff = async (hwId) => {
  try {
    const device = await Device.findById(hwId);
    if (!device) {
      throw new Error("Device not found.");
    }
    device.alarm_triggered = 0;
    await device.save();
    return device;
  } catch (error) {
    throw error;
  }
};

exports.setStateActive = async (householdId) => {
  try {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error("Household not found.");
    }
    await household.map((device) => {
      device.active = true;
      device.save();
    });
    return household;
  } catch (error) {
    throw error;
  }
};

exports.setStateDeactive = async (householdId) => {
  try {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error("Household not found.");
    }
    await household.map((device) => {
      device.active = false;
      device.save();
    });
    return household;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
