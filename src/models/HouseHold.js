const mongoose = require("mongoose");
const { householdDB } = require("../db/dbConnection");
const logschema = require("./Log");

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  logs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Log",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

if (householdDB.models.Household) {
  delete householdDB.models.Household;
}

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
