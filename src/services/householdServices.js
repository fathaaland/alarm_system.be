const mongoose = require("mongoose");
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

exports.addUserToHousehold = async (householdId, userId, newUserId) => {
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

    if (household.members.includes(newUserId)) {
      throw new Error("User already exists in the household.");
    }

    household.members.push(newUserId);
    await household.save();

    return household;
  } catch (error) {
    throw error;
  }
};

exports.removeUserToHousehold = async (householdId, deleteUserId) => {
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

    if (household.members.includes(newUserId)) {
      throw new Error("User already deletes from the household.");
    }

    household.members.deleteOne({ _id: deleteUserId });

    await household.save();

    return household;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
