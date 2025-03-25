const mongoose = require("mongoose");
const { householdDB } = require("../db/dbConnection");

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  logs: [
  {
    type: Object,
    required: false
  }
],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Household = householdDB.model("Household", householdSchema);

module.exports = Household;
