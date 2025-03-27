const mongoose = require("mongoose");
const { logDB } = require("../db/dbConnection");

const logSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  device_id: {
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

const Log = logDB.model("Log", logSchema);

module.exports = Log;
