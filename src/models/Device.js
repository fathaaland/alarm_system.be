const mongoose = require("mongoose");
const { deviceDB } = require("../db/dbConnection");

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  alarm_triggered: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = deviceDB.model("Device", deviceSchema);

module.exports = Device;
