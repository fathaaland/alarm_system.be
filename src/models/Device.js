const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_name: {
    type: String,
    required: true,
    unique: true,
  },
  device_type: {
    type: String,
    required: true,
  },
  current_state: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Device", deviceSchema);
