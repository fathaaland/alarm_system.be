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
