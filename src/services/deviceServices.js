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
      createdBy: deviceData.createdBy,
      isAdminCreated: true,
    });

    await newDevice.save();
    return newDevice;
  } catch (error) {
    throw error;
  }
};

exports.deleteDevice = async (deviceId) => {
  try {
    const device = await Device.findByIdAndDelete(deviceId);
    if (!device) {
      throw new Error("Device not found");
    }
    return device;
  } catch (error) {
    throw error;
  }
};

exports.setAlarmTriggeredOnByHwId = async (hwId, ownerId) => {
  try {
    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      throw new Error("Device not found");
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error("You don't have permission to update this device");
    }
    // if (device.alarm_triggered === 1) {
    //   throw new Error("Alarm is already triggered");
    // }

    device.alarm_triggered = 1;
    await device.save();

    return device;
  } catch (error) {
    throw error;
  }
};

exports.setAlarmTriggeredOffByHwId = async (hwId, ownerId) => {
  try {
    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      throw new Error("Device not found");
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error("You don't have permission to update this device");
    }
    // if (device.alarm_triggered === 0) {
    //   throw new Error("Alarm is already off");
    // }

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

    // if (household.active === true) {
    //   throw new Error("Household is already active.");
    // }

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

    // if (!household.active === false) {
    //   throw new Error("Household is already inactive.");
    // }
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
