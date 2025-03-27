const User = require("../models/User");
const householdService = require("../services/householdService");
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

module.exports = householdController;
