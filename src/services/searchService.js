import Household from "../models/household.js";

exports.searchHouseholds = (input) => {
  return new Promise((resolve, reject) => {
    Household.find({
      $or: [
        { id: { $regex: input, $options: "i" } },
        { name: { $regex: input, $options: "i" } },
        { ownerId: { $regex: input, $options: "i" } },
      ],
    })
      .then((households) => {
        resolve(households);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
