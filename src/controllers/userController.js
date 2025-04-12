const householdService = require("../services/userServices");
const User = require("../models/User");

exports.getHousehold = async (req, res) => {
  try {
    const household = await householdService.getHousehold(req.user.id);

    res.status(200).json({
      success: true,
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

exports.getHouseholdById = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;

    const household = await householdService.getHouseholdById(
      householdId,
      userId
    );

    res.status(200).json({
      success: true,
      data: household,
    });
  } catch (error) {
    console.log("Error fetching household by ID", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllWholeHouseholds = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const households = await householdService.getAllWholeHouseholds(
      currentUserId
    );

    res.status(200).json({
      success: true,
      data: households,
    });
  } catch (error) {
    console.error("Error in getAllWholeHouseholds controller:", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
