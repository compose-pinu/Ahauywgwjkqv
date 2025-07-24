const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0.0",
    permission: 0,
    credits: "Nayan",
    description: "Ask anything to the AI",
    prefix: false,
    category: "user",
    usages: "<question>",
    cooldowns: 5
  },

  run: async function({ api, event, args, Users }) {
    const { threadID, messageID, senderID } = event;
    const prompt = args.join(" ");

    // Check if prompt is empty
    if (!prompt) {
      return api.sendMessage("❗ Please provide a question for the AI to answer.\n\nExample:\nai What is the capital of France?", threadID, messageID);
    }

    try {
      // Fetch dynamic API endpoint
      const apiList = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const aiEndpoint = apiList.data.api;

      // Send request to AI API
      const response = await axios.get(`${aiEndpoint}/nayan/gpt3?prompt=${encodeURIComponent(prompt)}`);
      const aiResponse = response.data.response || "⚠️ AI is currently unable to process your request.";

      // Get user's name
      const userName = await Users.getNameUser(senderID);

      // Send AI response back to the thread
      return api.sendMessage(`${aiResponse}`, threadID, messageID);
      
    } catch (err) {
      console.error("AI Command Error:", err);
      return api.sendMessage("❌ Error: Could not fetch AI response. Please try again later.", threadID, messageID);
    }
  }
};
