module.exports.config = {
  name: "join2",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "SIDDIK",
  description: "Notify bot or group member with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

  const path = join(__dirname, "Siddik", "font");
  if (existsSync(path)) mkdirSync(path, { recursive: true });	

  const path2 = join(__dirname, "Siddik", "font");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}


module.exports.run = async function({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${(!global.config.BOTNAME) ? "bot" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const fs = require("fs");
    return api.sendMessage("╰┈➤চলে এসেছি আমি পিচ্চি সিদ্দিক তোমাদের মাঝে🤭", event.threadID, () => api.sendMessage({body:`
┏━[𝐁𝐎𝐓 𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐄𝐃]━➣
┃━━━━━━━━━━━━━━━
┃━➤𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 - 𝐒𝐈𝐃𝐃𝐈𝐊 𝐁𝐎𝐓
┃━━━━━━━━━━━━━━━
┃━➤𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 - [ / ]
┃━━━━━━━━━━━━━━━
┃━➤𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 - 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊
┃━━━━━━━━━━━━━━━
┃━➤𝐅𝐁 - 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊 𝐊𝐇𝐀𝐍
┃━━━━━━━━━━━━━━━
┃━➤🅃🅽🅇 🄵🅾🅁 🅄🆂🄸🅽🄶
┗━━━━━━━━━━━━━━━━━━┙
`, attachment: fs.createReadStream(__dirname + "/Siddik/Intro.mp4")} ,threadID));
  }
  else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "Siddik", "font");
      const pathGif = join(path, `${threadID}.gif`);

      var mentions = [], nameArray = [], memLength = [], i = 0;

      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "♡︎ 𝗪𝗲𝗹𝗰𝗼𝗺𝗲 {name} ♡︎\n☻︎ 𝗬𝗼𝘂 𝗮𝗿𝗲 𝗴𝗿𝗼𝘂𝗽 𝗺𝗲𝗺𝗯𝗲𝗿 [ {soThanhVien} ] 𝗴𝗿𝗼𝘂𝗽 𝗻𝗮𝗺𝗲𝘀 {threadName} ☻︎\n\n𒊹︎︎︎ 𝗪𝗲 𝗮𝗿𝗲 𝗴𝗹𝗮𝗱 𝘁𝗼 𝗵𝗮𝘃𝗲 𝘆𝗼𝘂 𝗵𝗲𝗿𝗲 𒊹︎︎︎\n\n☻︎ 𝗙𝗲𝗲𝗹 𝗳𝗿𝗲𝗲 𝘁𝗼 𝗷𝗼𝗶𝗻 𝗼𝘂𝗿 𝗰𝗼𝗻𝘃𝗲𝗿𝘀𝗮𝘁𝗶𝗼𝗻𝘀 𝗮𝗻𝗱 𝗵𝗮𝘃𝗲 𝗳𝘂𝗻 ☻︎\n\n♡︎ 𝗘𝗻𝗷𝗼𝘆 𝘆𝗼𝘂𝗿 𝘀𝘁𝗮𝘆 𝗮𝗻𝗱 𝗺𝗮𝗸𝗲 𝗴𝗿𝗲𝗮𝘁 𝗺𝗲𝗺𝗼𝗿𝗶𝗲𝘀 ♡︎\n\n☻︎ 𝗟𝗲𝘁'𝘀 𝗵𝗮𝘃𝗲 𝗮𝗻 𝗮𝘄𝗲𝘀𝗼𝗺𝗲 𝘁𝗶𝗺𝗲 𝘁𝗼𝗴𝗲𝘁𝗵𝗲𝗿 ☻︎" : msg = threadData.customJoin;
      msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{type}/g, (memLength.length > 1) ?  'You' : 'Friend')
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

      if (existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "Siddik", "font"));

      if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
      else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "Siddik", "font", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
      }
      else formPush = { body: msg, mentions }

      return api.sendMessage(formPush, threadID);
    } catch (e) { return console.log(e) };
  }
        }
