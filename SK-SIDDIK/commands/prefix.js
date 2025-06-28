const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  permission: 0, 
  credits: "SK-SIDDIK",
  prefix: false,
  description: "Show bot prefix and command info",
  category: "info",
  usages: "prefix",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event }) => {
  const msg = event.body?.toLowerCase() || "";
  if (!msg.startsWith("prefix")) return;

  const botPrefix = global.config.PREFIX || "!";
  const text = `┏━━━━━━━━━━━━━━━━━┓
┣➤ 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎
┣➤ 𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : 𝐒𝐈𝐃𝐃𝐈𝐊_𝐁𝐎𝐓
┣➤ 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 : [ ${botPrefix} ]
┣➤ 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 : 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊
┣➤ 𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆
┗━━━━[𝗦𝗜𝗗𝗗𝗜𝗞-𝗕𝗢𝗧]━━━━━┛`;

  const fileId = "1FRBxqqKQDp37eCuovCjjFtZviPdbVtA9";
  const url = `https://drive.google.com/uc?id=${fileId}`;
  const dirMaterial = path.join(__dirname, "cache");
  const filePath = path.join(dirMaterial, "1.png");

  try {
    await fs.ensureDir(dirMaterial);

    if (!fs.existsSync(filePath)) {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, res.data);
    }

    api.sendMessage(
      {
        body: text,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      async () => {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Failed to delete image after sending:", err);
        }
      },
      event.messageID
    );
  } catch (err) {
    console.error("Error handling prefix event:", err);
    return api.sendMessage("An error occurred while fetching the prefix info.", event.threadID);
  }
};
