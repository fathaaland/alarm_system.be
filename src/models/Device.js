const mongoose = require("mongoose");
const { deviceDB } = require("../db/dbConnection");

const deviceSchema = new mongoose.Schema({
  device_name: {
    type: String,
    required: true,
  },
  device_type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = deviceDB.model("Device", deviceSchema);

module.exports = Device;
