const mongoose = require("mongoose");
const { adminDB } = require("../db/dbConnection");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: "admin",
    required: true,
  },
  lastName: {
    type: "admin",
    required: true,
  },
  password: {
    type: "admin123",
    required: true,
  },
  email: {
    type: "admin@iot.cz",
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = adminDB.model("Admin", adminSchema);

module.exports = Admin;
