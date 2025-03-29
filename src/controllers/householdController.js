const householdService = require("../services/householdServices");
const User = require("../models/User");

const { isValidObjectId } = require("mongoose");

exports.createHousehold = async (req, res) => {
  try {
    const { name, members = [], devices = [] } = req.body;
    const ownerId = req.user.id;

    // Name validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid household name is required",
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

    const newHousehold = await householdService.createHousehold({
      name: name.trim(),
      ownerId,
      members: [ownerId, ...members],
      devices: [],
      logs: [],
    });

    res.status(201).json({
      success: true,
      data: newHousehold,
      message: "Household created successfully",
    });
  } catch (error) {
    console.error("Error creating household:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getHousehold = async (req, res) => {
  try {
    const household = await householdService.getHousehold(req.user.id);

    res.status(200).json({
      message: true,
      data: household,
    });
  } catch (error) {
    console.log("Error fetching fucking data", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;

    const deleteHousehold = await householdService.deleteHousehold(
      householdId,
      userId
    );
    res.status(200).json({
      message: "Household was deleted successfully",
      data: deleteHousehold,
    });
  } catch (error) {
    console.log("Error deleting household.", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = exports;
