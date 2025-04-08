const User = require("../models/User");
const Household = require("../models/HouseHold");
const Device = require("../models/Device");

exports.user = async (userData) => {
  try {
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.lastName,
      email: userData.email,
      role: userData.role || "",
      refreshToken: userData.refreshToken,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

exports.getHousehold = async (userId) => {
  try {
    const households = await Household.find({
      $or: [{ ownerId: userId }, { members: userId }],
    });

    return households;
  } catch (error) {
    throw error;
  }
};

exports.getHouseholdById = async (householdId, userId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: userId }, { members: userId }],
    });

    if (!household) {
      throw new Error("Household not found or you don't have access");
    }

    return household;
  } catch (error) {
    throw error;
  }
};

exports.getWholeHouseholdById = async (householdId, userId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: userId }, { members: userId }],
    })
      .populate({
        path: "members",
        select: "firstName lastName email role",
        model: User,
      })
      .populate({
        path: "devices",
        model: Device,
        select: "name type active alarm_triggered createdAt",
      });

    if (!household) {
      throw new Error("Household not found or you don't have access");
    }

    return household;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
