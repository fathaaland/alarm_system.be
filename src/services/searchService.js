const Household = require("../models/household");

exports.searchHouseholds = async (input) => {
  try {
    const households = await Household.find({
      $or: [
        { _id: input },
        { id: { $regex: input, $options: "i" } },
        { name: { $regex: input, $options: "i" } },
        { ownerId: input },
      ],
    });
    return households;
  } catch (error) {
    throw error;
  }
};
