require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const householdRoutes = require("./routes/householdRoutes");
const userRoutes = require("./routes/userRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const { householdDB } = require("./db/dbConnection");
const adminAuthRoutes = require("./routes/admin-authRoutes");
require("./db/dbConnection");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/household", householdRoutes);
app.use("/user", userRoutes);
app.use("/device", deviceRoutes);
app.use("/admin", adminAuthRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
