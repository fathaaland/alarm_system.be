const mongoose = require("mongoose");

const householdSchema = new mongoose.Schema({
  household_name: {
    type: String,
    required: true,
    unique: true,
  },
  household_password: {
    type: String,
    required: true,
  },
  household_users: {
    type: Array,
    default: [],
  },
  household_devices: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("HouseHold", householdSchema);
