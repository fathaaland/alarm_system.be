const { householdDB } = require("../dbConnections");

const householdSchema = new householdDB.Schema({
  hh_name: {
    type: String,
    required: true,
  },
  hh_admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  hh_password: {
    type: String,
    required: true,
  },
  hh_members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  hh_devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
