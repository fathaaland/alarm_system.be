const deviceService = require("../services/deviceServices");
const Device = require("../models/Device");
const Household = require("../models/Household");
const User = require("../models/User");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createDevice = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    const {
      name,
      type,
      active = true,
      alarm_triggered = 0,
      householdId,
    } = req.body;

    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid user token",
      });
    }

    if (!isValidObjectId(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner ID",
      });
    }

    if (!householdId || !isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Valid household ID is required",
      });
    }

    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: ownerId }],
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "Household not found or you don't have access",
      });
    }

    const newDevice = await deviceService.createDevice({
      name: name.trim(),
      type: type.trim(),
      active,
      alarm_triggered,
      householdId,
    });

    console.log("New device:", newDevice);

    household.devices.push(newDevice._id);
    await household.save();

    res.status(201).json({
      success: true,
      data: newDevice,
      householdId: household._id,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const deviceId = req.params.id;

    if (!isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid device ID",
      });
    }

    const device = await Device.findById(deviceId).populate("householdId");
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this device",
      });
    }

    await Device.deleteOne({ _id: deviceId });

    household.devices = household.devices.filter(
      (id) => id.toString() !== deviceId
    );
    await household.save();

    res.status(200).json({
      success: true,
      message: "Device deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setAlarmTriggeredOn = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const deviceId = req.params.id;

    if (!isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid device ID",
      });
    }

    if ((device.alarm_triggered = 1) && (device.active = true)) {
      return res.status(400).json({
        success: false,
        message: "Alarm already triggered",
      });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this device",
      });
    }

    device.alarm_triggered = 1;
    await device.save();

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error("Error setting alarm triggered on:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setAlarmTriggeredOff = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const deviceId = req.params.id;

    if (!isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid device ID",
      });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if ((device.alarm_triggered = 0) && (device.active = true)) {
      return res.status(400).json({
        success: false,
        message: "Alarm already is triggered off",
      });
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this device",
      });
    }

    device.alarm_triggered = 0;
    await device.save();

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error("Error setting alarm triggered on:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
