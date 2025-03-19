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
  hh_password: {
    type: String,
    required: true,
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
  current_state: {
    type: String,
    default: "active",
  },
  trigger_alarm: {
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
