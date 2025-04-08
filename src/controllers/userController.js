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

exports.getWholeHouseholdById = async (req, res) => {
  try {
    const household = await householdService.getWholeHouseholdById(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: household,
    });
  } catch (error) {
    console.error("Error fetching household:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("access")
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
