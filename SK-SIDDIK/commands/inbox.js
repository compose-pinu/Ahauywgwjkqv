const axios = require('axios');

module.exports.config = {
  name: "inbox",
  version: "1.0.1",
  aliases: ["INBOX", "Inbox"],
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "",
  prefix: true,
  category: "system",
  usages: "user",
  cooldowns: 5,
  dependencies: {
    axios: ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const query = encodeURIComponent(args.join(' '));

    api.sendMessage(
      "✅ SUCCESSFULLY SEND MSG\n\n🔰 PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX ✅",
      event.threadID
    );

    api.sendMessage(
      "✅ SUCCESSFULLY ALLOWED\n🔰 NOW YOU CAN USE  SIDDIK-BOT HERE 😘✅",
      event.senderID
    );
  } catch (error) {
    console.error("Error bro: " + error);
  }
};
