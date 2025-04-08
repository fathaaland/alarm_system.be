const householdService = require("../services/householdServices");
const User = require("../models/User");
const { isValidObjectId } = require("mongoose");

exports.createHousehold = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    const { name, members = [], devices = [] } = req.body;
    const ownerId = req.user?.id;

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

    const newHousehold = await householdService.createHousehold({
      name: name.trim(),
      ownerId,
      members: [],
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

exports.addUserToHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;
    const newUserId = req.body.newUserId;

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: "New user ID is required",
      });
    }

    const addUser = await householdService.addUserToHousehold(
      householdId,
      userId,
      newUserId
    );

    res.status(200).json({
      message: "User was added to the household successfully",
      data: addUser,
    });
  } catch (error) {
    console.log("Error adding user to household.", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeUserToHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;
    const deleteUserId = req.body.deleteUserId;

    if (!deleteUserId) {
      return res.status(400).json({
        success: false,
        message: "Delete user ID is required",
      });
    }

    const removeUser = await householdService.removeUserToHousehold(
      householdId,
      userId,
      deleteUserId
    );

    res.status(200).json({
      message: "User was removed from the household successfully",
      data: removeUser,
    });
  } catch (error) {
    console.log("Error removing user from household.", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
