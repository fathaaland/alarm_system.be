const mongoose = require("mongoose");
const { logDB } = require("../db/dbConnection");

const logSchema = new mongoose.Schema({
  log_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  log_device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
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

const Log = logDB.model("Log", logSchema);

module.exports = Log;
