const mongoose = require("mongoose");
const { householdDB } = require("../db/dbConnection");
const { logDB } = require("../db/dbConnection");

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

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
      type: logSchema,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Household = householdDB.model("Household", householdSchema);
const Log = logDB.model("Log", logSchema);

module.exports = [Household, Log];
