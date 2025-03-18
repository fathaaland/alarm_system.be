const mongoose = require("mongoose");
const { userDB } = require("../db/dbConnection"); // Připojení k "users" DB
const bcrypt = require("bcryptjs");

// Správné použití mongoose.Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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

// Hashování hesla před uložením
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Metoda na porovnání hesel
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Model se vytváří pomocí `userDB`, což zajistí uložení do správné databáze
const User = userDB.model("User", userSchema);

module.exports = User;
