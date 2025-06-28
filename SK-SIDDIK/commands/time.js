const axios = require('axios'); 

module.exports.config = {
  name: "time",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK",
  prefix: false,
  description: "Get current time and details for a specific location",
  category: "system",  
  usages: "<location>",
  cooldowns: 5,
};

module.exports.run = async function ({ event, args, api }) {
    const threadID = event.threadID;
    const messageID = event.messageID;
    const apiKey = '44af5583113741a38e71284bdf53e63b'; 
    const location = args.join(' '); 

    if (!location) {
        return api.sendMessage("Please provide a location. Example: 'New York', 'Bangladesh', 'Tokyo'", threadID, messageID);
    }

    const url = `https://api.ipgeolocation.io/timezone?apiKey=${apiKey}&location=${encodeURIComponent(location)}`;

    try {
        const response = await axios.get(url);
        const { date_time_txt, timezone, location: apiLocation } = response.data;

        if (!date_time_txt) {
            return api.sendMessage("Could not retrieve time for the specified location. Please check the location name.", threadID, messageID);
        }

        const date = new Date(date_time_txt);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = dayNames[date.getUTCDay()];

        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; 
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

        const rul = 'https://i.imgur.com/gTe2xTc.png';  

        const formattedDate = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;

        const responseMessage =
            `╭─────⊙ \n` +
            `├🌍 𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐓𝐈𝐌𝐄𝐒 \n` +
            `├ \n` +
            `├🕛 Time : ${formattedTime}\n` +
            `├📅 Date : ${formattedDate}\n` +
            `├📝 Day Name : ${dayName}\n` +
            `├🕒 Location : ${args.join(' ')}\n` +
            `├🌐 Time Zone : ${timezone}\n` +
            `├𝐎𝐖𝐍𝐄𝐑 : 𝐒𝐊-𝐒𝐈𝐃𝐃𝐈𝐊\n` +
            `╰────────────⊙`;

        await api.sendMessage(responseMessage, threadID, messageID);

    } catch (error) {
        console.error("Failed to fetch time:", error);
        await api.sendMessage("⚠ | An error occurred while fetching the time. Please try again later.", threadID, messageID);
    }
};
