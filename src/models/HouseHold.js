const mongoose = require("mongoose");
const { householdDB } = require("../db/dbConnection");

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  logs: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

if (householdDB.models.Household) {
  delete householdDB.models.Household;
}

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
