const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  log_user_id: {
    type: String,
    required: true,
  },

  log_device_id: {
    type: String,
    required: true,
  },

  log_type: {
    type: String,
    required: true,
  },
  log_message: {
    type: String,
    required: true,
  },
  log_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
