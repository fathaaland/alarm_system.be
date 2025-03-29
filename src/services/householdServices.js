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
    const households = await Household.find({
      $or: [{ ownerId: userId }, { members: userId }],
    });
    if (!households || households.length === 0) {
      throw new Error("No households found or you don't have access");
    }
    return households;
  } catch (error) {
    throw error;
  }
};

exports.deleteHousehold = async (householdId, userId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      ownerId: userId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }

    await household.deleteOne({ _id: householdId });

    return household;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
