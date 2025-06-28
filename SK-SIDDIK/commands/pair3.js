module.exports.config = {
  name: "pair3",
  version: "1.0.2",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "Family Pair",
  prefix: true,
  category: "love",
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
  const dir = resolve(__dirname, 'cache', 'canvas');
  const imgPath = resolve(dir, 'araa.jpg');
  const url = "https://drive.google.com/uc?id=1E_SfNEQ8pnExwEqLiqf8DTzNtuSankjp";

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(imgPath)) await downloadFile(url, imgPath);
};

async function makeImage({ one, two, three }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const dir = path.resolve(__dirname, "cache", "canvas");

  let base = await jimp.read(`${dir}/araa.jpg`);
  let outputPath = `${dir}/araa_${one}_${two}_${three}.png`;

  let getAvatar = async (uid) => {
    const avatarPath = `${dir}/avt_${uid}.png`;
    const avatarBuffer = (await axios.get(
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: 'arraybuffer' }
    )).data;
    fs.writeFileSync(avatarPath, Buffer.from(avatarBuffer, 'utf-8'));
    return await jimp.read(await circle(avatarPath));
  };

  const [circleOne, circleTwo, circleThree] = await Promise.all([
    getAvatar(one).then(img => img.resize(65, 65)),
    getAvatar(two).then(img => img.resize(65, 65)),
    getAvatar(three).then(img => img.resize(65, 65))
  ]);

  base
    .composite(circleOne, 135, 260)     
    .composite(circleTwo, 230, 210)     
    .composite(circleThree, 193, 370);  

  const buffer = await base.getBufferAsync("image/png");
  fs.writeFileSync(outputPath, buffer);

  fs.unlinkSync(`${dir}/avt_${one}.png`);
  fs.unlinkSync(`${dir}/avt_${two}.png`);
  fs.unlinkSync(`${dir}/avt_${three}.png`);

  return outputPath;
}

async function circle(image) {
  const jimp = require("jimp");
  const img = await jimp.read(image);
  img.circle();
  return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ api, event, args, Users }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID } = event;

  const info = await api.getUserInfo(senderID);
  const senderName = info[senderID].name;

  const threadInfo = await api.getThreadInfo(threadID);
  const members = threadInfo.participantIDs.filter(id => id !== senderID);
  const randomUIDs = members.sort(() => 0.5 - Math.random()).slice(0, 2);

  const [name1, name2] = await Promise.all([
    Users.getData(randomUIDs[0]).then(u => u.name),
    Users.getData(randomUIDs[1]).then(u => u.name)
  ]);

  const imagePath = await makeImage({
    one: randomUIDs[0],   
    two: senderID,        
    three: randomUIDs[1]  
  });

  const arrayTag = [
    { id: randomUIDs[0], tag: name1 },
    { id: senderID, tag: senderName },
    { id: randomUIDs[1], tag: name2 }
  ];

  const message = {
    body: `${name1} x ${senderName} x ${name2}\n— Family Picture 🌸✅`,
    mentions: arrayTag,
    attachment: fs.createReadStream(imagePath)
  };

  api.sendMessage(message, threadID, () => fs.unlinkSync(imagePath), messageID);
};
