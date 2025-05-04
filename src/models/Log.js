const mongoose = require("mongoose");
const { logDB } = require("../db/dbConnection");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deviceId: {
    type: String,
    required: true,
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = logDB.model("Log", logSchema);
