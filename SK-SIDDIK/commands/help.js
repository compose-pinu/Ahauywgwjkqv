const fs = require("fs");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "help",
  version: "1.0.2",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  description: "beginner's guide",
  category: "guide",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 60
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || !body.startsWith("help")) return;

  const splitBody = body.trim().split(/\s+/);
  if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  api.sendMessage(getText(
    "moduleInfo",
    command.config.name,
    command.config.description,
    `${prefix}${command.config.name} ${command.config.usages || ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    command.config.permission === 0 ? getText("user") : 
      command.config.permission === 1 ? getText("adminGroup") : getText("adminBot"),
    command.config.credits
  ), threadID, messageID);
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  if (!command) {
    const arrayInfo = Array.from(commands.keys()).sort();
    const page = Math.max(1, parseInt(args[0]) || 1);
    const perPage = 20;
    const totalPages = Math.ceil(arrayInfo.length / perPage);

    if (page > totalPages) return api.sendMessage(`Page ${page} doesn't exist. Maximum pages: ${totalPages}.`, threadID, messageID);

    const start = (page - 1) * perPage;
    const msg = `┏━[𝗟𝗶𝘀𝘁 𝗼𝗳 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀]━➣\n${arrayInfo.slice(start, start + perPage).map((cmd, i) => `┃━➤  ${start + i + 1} •──⋅☾ ${cmd}`).join("\n")}\n┃━━━━━━━━━━━━━━━➢\n┃━➤ 𝐏𝐀𝐆𝐄 (${page}/${totalPages})\n┃━➤ 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${arrayInfo.length} \n┗━━[𝗦𝗜𝗗𝗗𝗜𝗞 𝗕𝗢𝗧]━━━➣`;

    return downloadAndSendImage(api, msg, threadID, messageID);
  }

  const commandInfo = getText(
    "moduleInfo",
    command.config.name,
    command.config.description,
    `${prefix}${command.config.name} ${command.config.usages || ""}`,
    command.config.commandCategory,
    command.config.cooldowns,
    command.config.permission === 0 ? getText("user") : 
      command.config.permission === 1 ? getText("adminGroup") : getText("adminBot"),
    command.config.credits
  );

  return downloadAndSendImage(api, commandInfo, threadID, messageID);
};

function downloadAndSendImage(api, msg, threadID, messageID) {
  const imageUrl = "https://graph.facebook.com/100059026788061/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const imagePath = __dirname + "/cache/1.png";

  request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(imagePath))
    .on("close", () => {
      
      api.sendMessage({ body: msg, attachment: fs.createReadStream(imagePath) }, threadID, () => {
        fs.unlinkSync(imagePath);  
      }, messageID);
    });
}
