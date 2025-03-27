const houseHold = require("../models/householdModel");
const houseHoldService = require("../services/householdService");

// Create a new household
exports.createHousehold = async (req, res) => {
  try {
    const name = req.body.name;
    const ownerId = req.body.ownerId;

    const newHouseHold = await houseHoldService.createHouseHold(name, ownerId);

    res.status(201).json({
      succsess: true,
      message: "Household created successfully",
      data: newHouseHold,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
