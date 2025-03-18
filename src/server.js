const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const { userDB, householdDB, deviceDB, logDB } = require("./db/dbConnection");

dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Připojeno k MongoDB"))
  .catch((err) => console.error("Chyba připojení k MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
