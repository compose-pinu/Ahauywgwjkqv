module.exports.config = {
  name: "pair",
  version: "1.0.1",
  permssion: 0,
  prefix: true,
  credits: "SK-SIDDIK-KHAN",
  description: "",
  category: "Picture",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = resolve(__dirname, 'cache', 'canvas');
  const filePath = resolve(dirMaterial, 'pairing.png');

  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

  if (!existsSync(filePath)) {
    const url = "https://drive.google.com/uc?id=1AOf6xRbxr9jqEtrLweWUJq_az1_VKBWk";
    await downloadFile(url, filePath);
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  const pairing_img = await jimp.read(path.join(__root, "pairing.png"));
  const pathImg = path.join(__root, `pairing_${one}_${two}.png`);
  const avatarOne = path.join(__root, `avt_${one}.png`);
  const avatarTwo = path.join(__root, `avt_${two}.png`);

  const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  const circleOne = await jimp.read(await circle(avatarOne));
  const circleTwo = await jimp.read(await circle(avatarTwo));
  pairing_img.composite(circleOne.resize(150, 150), 980, 200)
             .composite(circleTwo.resize(150, 150), 140, 200);

  const raw = await pairing_img.getBufferAsync("image/png");

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const { threadID, messageID, senderID } = event;

  const chances = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%"];
  const chance = chances[Math.floor(Math.random() * chances.length)];

  const senderInfo = await api.getUserInfo(senderID);
  const senderName = senderInfo[senderID].name;

  const threadInfo = await api.getThreadInfo(threadID);
  const participants = threadInfo.participantIDs.filter(id => id !== senderID);
  const pairedID = participants[Math.floor(Math.random() * participants.length)];

  const pairedInfo = await api.getUserInfo(pairedID);
  const pairedName = pairedInfo[pairedID].name;

  const tags = [
    { id: senderID, tag: senderName },
    { id: pairedID, tag: pairedName }
  ];

  const one = senderID, two = pairedID;
  const path = await makeImage({ one, two });

  return api.sendMessage(
    {
      body: `Congratulations ${senderName} is paired with ${pairedName}!\nThe odds are: 〘${chance}〙`,
      mentions: tags,
      attachment: fs.createReadStream(path)
    },
    threadID,
    () => fs.unlinkSync(path),
    messageID
  );
};
