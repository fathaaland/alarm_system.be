const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../services/authService");
const User = require("../models/User");

// Registrace
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Uživatel již existuje." });
    }

    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Uložení refresh tokenu do databáze
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Chyba serveru." });
  }
});

// Přihlášení
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Neplatné přihlašovací údaje." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Neplatné přihlašovací údaje." });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Uložení refresh tokenu do databáze
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Chyba serveru." });
  }
});

// Refresh tokenu
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token chybí." });
  }

  try {
    // Ověření refresh tokenu
    const decoded = verifyRefreshToken(refreshToken);

    // Najděte uživatele podle ID v refresh tokenu
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Neplatný refresh token." });
    }

    // Vygenerujte nový access token
    const accessToken = generateAccessToken(user.id);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Neplatný refresh token." });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null; // Smažte refresh token
      await user.save();
    }

    res.json({ message: "Odhlášení proběhlo úspěšně." });
  } catch (error) {
    res.status(500).json({ message: "Chyba serveru." });
  }
});

module.exports = router;
