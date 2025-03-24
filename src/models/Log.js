const mongoose = require("mongoose");
const { logDB } = require("../db/dbConnection");

const logSchema = new mongoose.Schema({
 log_type: {
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
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Log = logDB.model("Log", logSchema);

module.exports = Log;
