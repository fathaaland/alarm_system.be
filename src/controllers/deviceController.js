const deviceService = require("../services/deviceServices");
const Device = require("../models/Device");
const User = require("../models/User");

exports.createDevice = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    const { name, type, active, alarm_triggered } = req.body;
    const houseHoldId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid user token",
      });
    }

    // OwnerId validation
    if (!isValidObjectId(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner ID",
      });
    }

    // Is Existing owner ownerId validation
    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    const newDevice = await deviceService.createDevice({
      name: name.trim(),
      type: deviceType.trim(),
      active: deviceStatus.trim(),
      alarm_triggered: deviceLocation.trim(),
    });

    res.status(201).json({
      success: true,
      data: newDevice,
      message: "Device created successfully",
    });
  } catch (error) {
    console.error("Error creating device:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
