const axios = require("axios");

function discordNotify(customMessage) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  return async (req, res, next) => {
    try {
      await axios.post(webhook, {
        content:
          typeof customMessage === "function"
            ? customMessage(req)
            : customMessage,
      });
    } catch (error) {
      console.error("Chyba při odesílání na Discord:", error.message);
    }
    next();
  };
}

module.exports = discordNotify;
