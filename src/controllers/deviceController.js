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

    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    if (!isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Valid household ID is required",
      });
    }

    const newDevice = await deviceService.createDevice({
      name: name.trim(),
      type: type.trim(),
      active,
      alarm_triggered,
      householdId,
      hw_id,
      createdBy: adminId,
    });

    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found",
      });
    }

    household.devices.push(newDevice._id);
    await household.save();

    await sendDiscordNotification(
      `:new: Admin ${req.admin.username} (ID: ${adminId}) created new device "${name}" (ID: ${newDevice._id}) in household ${household.name} (ID: ${householdId})`
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
    const adminId = req.admin?.id;
    const deviceId = req.params.deviceId;

    if (!adminId) {
      return res.status(403).json({
        success: false,
        message: "Pouze admin může mazat zařízení",
      });
    }

    if (!isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Neplatné ID zařízení",
      });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Zařízení nenalezeno",
      });
    }

    await Household.updateOne(
      { _id: device.householdId },
      { $pull: { devices: deviceId } }
    );

    await Device.deleteOne({ _id: deviceId });

    await sendDiscordNotification(
      `:wastebasket: Admin ${req.admin.username} (ID: ${adminId}) smazal zařízení "${device.name}" (ID: ${deviceId})`
    );

    res.status(200).json({
      success: true,
      message: "Zařízení úspěšně smazáno",
    });
  } catch (error) {
    console.error("Chyba při mazání zařízení:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Interní chyba serveru",
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

    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (device.alarm_triggered === 1 && device.active === true) {
      return res.status(400).json({
        success: false,
        message: "Alarm is already triggered",
      });
    }

    const updatedDevice = await deviceService.setAlarmTriggeredOnByHwId(
      hwId,
      ownerId
    );

    await sendDiscordNotification(
      `:rotating_light: Alarm triggered ON for device "${updatedDevice.name}" (HW ID: ${hwId}) by user ${req.user.username} (ID: ${ownerId})`
    );

    res.status(200).json({
      success: true,
      data: updatedDevice,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
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

    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (device.alarm_triggered === 0 && device.active === true) {
      return res.status(400).json({
        success: false,
        message: "Alarm is already off",
      });
    }

    const updatedDevice = await deviceService.setAlarmTriggeredOffByHwId(
      hwId,
      ownerId
    );

    await sendDiscordNotification(
      `:white_check_mark: Alarm triggered OFF for device "${updatedDevice.name}" (HW ID: ${hwId}) by user ${req.user.username} (ID: ${ownerId})`
    );

    res.status(200).json({
      success: true,
      data: updatedDevice,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setStateActive = async (ws, req) => {
  try {
    const ownerId = req.user?.id;
    const householdId = req.body.householdId;

    if (!isValidObjectId(householdId)) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Invalid household ID",
        })
      );
      return;
    }

    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household not found or you don't have permission",
        })
      );
      return;
    }

    if (household.active === true) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household is already active.",
        })
      );
      return;
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = true;
      return device.save();
    });

    await Promise.all(updatePromises);

    household.active = true;
    await household.save();

    await sendDiscordNotification(
      `:white_check_mark: User ${req.user.username} (ID: ${ownerId}) activated ALL devices in household "${household.name}" (ID: ${householdId})`
    );

    ws.send(
      JSON.stringify({
        success: true,
        data: devices,
        message: "All devices activated successfully",
      })
    );
  } catch (error) {
    console.error("Error setting state active:", error);
    ws.send(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      })
    );
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

    if (household.active === false) {
      return res.status(400).json({
        success: false,
        message: "Household is already deactive.",
      });
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = false;
      return device.save();
    });

    await Promise.all(updatePromises);

    household.active = false;
    await household.save();

    await sendDiscordNotification(
      `:x: User ${req.user.username} (ID: ${ownerId}) deactivated ALL devices in household "${household.name}" (ID: ${householdId})`
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

exports.getDevices = async (req, res) => {
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

    const devices = await deviceService.getDevices(householdId);

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
