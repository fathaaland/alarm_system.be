const deviceService = require("../services/deviceServices");
const Device = require("../models/Device");
const Household = require("../models/Household");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendDiscordNotification } = require("../middlewares/discordNotifier");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createDevice = async (req, res) => {
  try {
    const { name, type, active, alarm_triggered, householdId, hw_id } =
      req.body;
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
      hw_id,
    });

    household.devices.push(newDevice._id);
    await household.save();

    await sendDiscordNotification(
      `:new: User ${req.user.username} (ID: ${ownerId}) created new device "${name}" (ID: ${newDevice._id}) in household ${household.name} (ID: ${householdId})`
    );

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

    await sendDiscordNotification(
      `:wastebasket: User ${req.user.username} (ID: ${ownerId}) deleted device "${device.name}" (ID: ${deviceId}) from household ${household.name} (ID: ${household._id})`
    );

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

exports.setAlarmTriggeredOnByHwId = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const hwId = req.params.hwId;

    if (!hwId) {
      return res.status(400).json({
        success: false,
        message: "Hardware ID is required",
      });
    }

    const device = await deviceService.setAlarmTriggeredOnByHwId(hwId, ownerId);

    await sendDiscordNotification(
      `:rotating_light: Alarm triggered ON for device "${device.name}" (HW ID: ${hwId}) by user ${req.user.username} (ID: ${ownerId})`
    );

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("permission")
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setAlarmTriggeredOffByHwId = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const hwId = req.params.hwId;

    if (!hwId) {
      return res.status(400).json({
        success: false,
        message: "Hardware ID is required",
      });
    }

    const device = await deviceService.setAlarmTriggeredOffByHwId(
      hwId,
      ownerId
    );

    await sendDiscordNotification(
      `:white_check_mark: Alarm triggered OFF for device "${device.name}" (HW ID: ${hwId}) by user ${req.user.username} (ID: ${ownerId})`
    );

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("permission")
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.setStateActive = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const householdId = req.body.householdId;

    if (!isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid household ID",
      });
    }

    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "Household not found or you don't have permission",
      });
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = true;
      return device.save();
    });

    await Promise.all(updatePromises);

    await sendDiscordNotification(
      `:electric_plug: User ${req.user.username} (ID: ${ownerId}) activated ALL devices in household "${household.name}" (ID: ${householdId})`
    );

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error setting state active:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setStateDeactive = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const householdId = req.body.householdId;

    if (!isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid household ID",
      });
    }

    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "Household not found or you don't have permission",
      });
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = false;
      return device.save();
    });

    await Promise.all(updatePromises);

    await sendDiscordNotification(
      `:power_off: User ${req.user.username} (ID: ${ownerId}) deactivated ALL devices in household "${household.name}" (ID: ${householdId})`
    );

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error setting state deactive:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
