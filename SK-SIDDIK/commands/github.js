const axios = require("axios");
const moment = require("moment");
const fs = require("fs-extra");

const fetch = async (url) => {
  const { default: fetch } = await import('node-fetch');
  return fetch(url);
};

module.exports.config = {
  name: 'github',
  version: '1.1.1',
  permission: 0,
  credits: 'SK-SIDDIK-KHAN',
  prefix: true,
  description: 'Fetches GitHub user information using the username.',
  category: 'Information',
  usages: '[GitHub Username]',
  cooldowns: 5,
};

module.exports.run = async ({ event, api, args }) => {
    if (!args[0]) return api.sendMessage(`🔰 Please Send a GitHub Username 🔰`, event.threadID, event.messageID);

    fetch(`https://api.github.com/users/${encodeURI(args.join(' '))}`)
      .then(res => res.json())
      .then(async body => {
        if (body.message) return api.sendMessage(`🔰 User Not Found 🔰`, event.threadID, event.messageID);

        let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, updated_at, bio } = body;

        const info = 
          `⊙─── [ 𝗚𝗜𝗧𝗛𝗨𝗕 𝗜𝗡𝗙𝗢 ] ───⊙\n\n╰‣📛𝗡𝗮𝗺𝗲: ${name}\n╰‣👤 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${login}\n╰‣🔰 𝗜𝗗: ${id}\n╰‣💬 𝗕𝗶𝗼: ${bio || "No Bio"}\n╰‣🔓 𝗣𝘂𝗯𝗹𝗶𝗰 𝗥𝗲𝗽𝗼𝘀𝗶𝘁𝗼𝗿𝗶𝗲𝘀: ${public_repos || "None"}\n╰‣🎀 𝗙𝗼𝗹𝗹𝗼𝘄𝗲𝗿𝘀: ${followers}\n╰‣🔖 𝗙𝗼𝗹𝗹𝗼𝘄𝗶𝗻𝗴: ${following}\n╰‣🌎 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻: ${location || "No Location"}\n╰‣📌 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱: ${moment.utc(created_at).format("dddd, MMMM, Do YYYY")}\n╰‣♻ 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗨𝗽𝗱𝗮𝘁𝗲𝗱: ${moment.utc(updated_at).format("dddd, MMMM, Do YYYY")}\n\n⊙──── [ 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊 ] ────⊙`;

        try {
          const avatarBuffer = await axios.get(`${avatar_url}`, { responseType: "arraybuffer" });
          fs.writeFileSync(__dirname + "/cache/avatargithub.png", Buffer.from(avatarBuffer.data, "utf-8"));

          api.sendMessage({
            attachment: fs.createReadStream(__dirname + "/cache/avatargithub.png"),
            body: info
          }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avatargithub.png"), event.messageID);
        } catch (error) {
          console.error("Error fetching avatar image:", error);
          api.sendMessage(`🔰 Error Fetching Avatar Image 🔰`, event.threadID, event.messageID);
        }
      }).catch(error => {
        console.error("Error fetching GitHub user data:", error);
        api.sendMessage(`🔰 Error Fetching User Data 🔰`, event.threadID, event.messageID);
      });
};