const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "us",
    version: "2.6.0",
    permssion: 0,
    credits: "SK-SIDDIK",
    description: "Create a love image between you and someone you tag.",
    prefix: true,
    category: "Love",
    usages: "[tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = path;
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const filePath = resolve(dirMaterial, "us.png");
    const { downloadFile } = global.utils;

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });

    const url = "https://drive.google.com/uc?id=1AJZNV21hzR9Hzo0WNhOOeHFRNtAVsm3p";
    await downloadFile(url, filePath);
};

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const templatePath = path.join(__root, "us.png");
    const pathImg = path.join(__root, `love_${one}_${two}.png`);
    const avatarOne = path.join(__root, `avt_${one}.png`);
    const avatarTwo = path.join(__root, `avt_${two}.png`);

    const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let baseImg = await jimp.read(templatePath);
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    baseImg.resize(466, 659)
        .composite(circleOne.resize(110, 110), 150, 76)
        .composite(circleTwo.resize(100, 100), 245, 305);

    let finalBuffer = await baseImg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, finalBuffer);

    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(imagePath) {
    const img = await jimp.read(imagePath);
    img.circle();
    return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0];

    if (!mention) {
        return api.sendMessage("🔰 Please Mention 1 Person 🔰", threadID, messageID);
    }

    const tag = mentions[mention].replace("@", "");
    const one = senderID;
    const two = mention;

    try {
        const imgPath = await makeImage({ one, two });
        return api.sendMessage({
            body: `𝐉𝐔𝐒𝐓 𝐘𝐎𝐔 𝐀𝐍𝐃 𝐌𝐄 <😘😊🦋︎>`,
            mentions: [{ tag: tag, id: two }],
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath), messageID);
    } catch (err) {
        console.error("Error generating image:", err);
        return api.sendMessage("❌ Failed to generate image. Try again later.", threadID, messageID);
    }
};
