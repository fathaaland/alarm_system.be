const { deviceDB } = require("../db/dbConnection");

const deviceSchema = new deviceDB.Schema({
  device_name: {
    type: String,
    required: true,
  },
  device_type: {
    type: String,
    required: true,
  },
  device_household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = deviceDB.model("Device", deviceSchema);

module.exports = Device;
