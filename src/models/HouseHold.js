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
      type: logschema,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
