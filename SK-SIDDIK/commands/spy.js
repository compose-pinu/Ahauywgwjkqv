const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "spy",
  version: "1.3.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "Get user information and profile photo",
  prefix: false,
  category: "information",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, type, messageReply, mentions } = event;

  let uid;

  if (Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  } else if (args[0] && /^\d+$/.test(args[0])) {
    uid = args[0];
  } else if (type === "message_reply") {
    uid = messageReply.senderID;
  } else {
    uid = event.senderID; 
  }

  try {
    const userInfo = await api.getUserInfo(uid);
    const user = userInfo[uid];

    const name = user?.name || "Name not found";
    let genderText;
    switch (user?.gender) {
      case 1:
        genderText = "𝙶𝚒𝚛𝚕";
        break;
      case 2:
        genderText = "Boy";
        break;
      default:
        genderText = "𝙶𝚊𝚢";
    }

    const infoMsg = `
╭── [ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ]

├‣ 𝙽𝚊𝚖𝚎: ${name}

├‣ 𝙶𝚎𝚗𝚍𝚎𝚛: ${genderText}

├‣ 𝚄𝙸𝙳: ${uid}

├‣ 𝚄𝚜𝚎𝚛𝚗𝚊𝚖𝚎: ${user.vanity || "𝙽𝚘𝚗𝚎"}

├‣ 𝙿𝚛𝚘𝚏𝚒𝚕𝚎 𝚄𝚁𝙻: ${user.profileUrl || "𝚄𝚗𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎"}

├‣ 𝙱𝚒𝚛𝚝𝚑𝚍𝚊𝚢: ${user.isBirthday !== false ? user.isBirthday : "𝙿𝚛𝚒𝚟𝚊𝚝𝚎"}

├‣ 𝙽𝚒𝚌𝚔𝙽𝚊𝚖𝚎: ${user.alternateName || "𝙽𝚘𝚗𝚎"}

╰‣ 𝚃𝙷𝙰𝙽𝙺𝚂 𝙵𝙾𝚁 𝚄𝚂𝙸𝙽𝙶 𝚂𝙺 𝙱𝙾𝚃`;

    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    const imagePath = path.join(__dirname, "temp_avatar.png");
    fs.writeFileSync(imagePath, buffer);

    api.sendMessage(
      {
        body: infoMsg,
        attachment: fs.createReadStream(imagePath)
      },
      threadID,
      () => fs.unlinkSync(imagePath),
      messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage("Failed to retrieve user information", threadID, messageID);
  }
};
