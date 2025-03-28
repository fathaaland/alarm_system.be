const Household = require("../models/HouseHold");

exports.createHousehold = async (householdData) => {
  try {
    const newHousehold = new Household({
      name: householdData.name,
      ownerId: householdData.ownerId,
      members: householdData.members,
      devices: householdData.devices || [],
      logs: householdData.logs || [],
    });

    await newHousehold.save();
    return newHousehold;
  } catch (error) {
    throw error;
  }
};

exports.getHousehold = async (userId) => {
  try {
    const household = await Household.findOne({ ownerId: userId });

    if (!household) {
      throw new Error("Household not found or you don't have access");
    }
    return household;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
