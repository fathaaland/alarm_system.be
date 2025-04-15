require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const connectToDB = (uri, dbName) => {
  const connection = mongoose.createConnection(uri, {
    dbName,
  });

  connection.on("connected", () => {
    console.log(`Připojeno k databázi ${dbName}`);
  });

  connection.on("error", (err) => {
    console.error(`Chyba připojení k databázi ${dbName}:`, err);
  });

  return connection;
};

const userDB = connectToDB(process.env.MONGO_USER_URI, "users");
const householdDB = connectToDB(process.env.MONGO_HOUSEHOLD_URI, "household");
const deviceDB = connectToDB(process.env.MONGO_DEVICE_URI, "devices");
const logDB = connectToDB(process.env.MONGO_LOG_URI, "logs");
// const adminDB = connectToDB(process.env.MONGO_ADMIN_URI, "admin");

module.exports = { userDB, householdDB, deviceDB, logDB };
