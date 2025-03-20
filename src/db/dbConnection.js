require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

const connectToDB = (uri, dbName) => {
  const connection = mongoose.createConnection(uri, {
    dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.on("connected", () => {
    console.log(`Připojeno k databázi ${dbName}`);
  });

  connection.on("error", (err) => {
    console.error(`Chyba připojení k databázi ${dbName}:`, err);
  });

  return connection;
};

console.log("🔍 Debug: MONGO_USER_URI =", process.env.MONGO_USER_URI);
console.log("🔍 Debug: MONGO_HOUSEHOLD_URI =", process.env.MONGO_HOUSEHOLD_URI);
console.log("🔍 Debug: MONGO_DEVICE_URI =", process.env.MONGO_DEVICE_URI);
console.log("🔍 Debug: MONGO_LOG_URI =", process.env.MONGO_LOG_URI);

const userDB = connectToDB(process.env.MONGO_USER_URI, "users");
const householdDB = connectToDB(process.env.MONGO_HOUSEHOLD_URI, "household");
const deviceDB = connectToDB(process.env.MONGO_DEVICE_URI, "devices");
const logDB = connectToDB(process.env.MONGO_LOG_URI, "logs");

module.exports = { userDB, householdDB, deviceDB, logDB };
