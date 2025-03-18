const { logDB } = require("../dbConnections");

const logSchema = new logDB.Schema({
  message: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = logDB.model("Log", logSchema);

module.exports = Log;
