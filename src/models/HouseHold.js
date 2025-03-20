const mongoose = require("mongoose");
const { householdDB } = require("../db/dbConnection");

const householdSchema = new mongoose.Schema({
  hh_name: {
    type: String,
    required: true,
  },
  hh_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hh_members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  hh_devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  active: {
    type: Boolean,
    default: false,
  },
  alarm_triggered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
