const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports.config = {
    name: "propose",
    version: "2.6.0",
    permssion: 0,
    credits: "SK-SIDDIK-KHAN",
    description: "Propose someone with a cute image",
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
    const dir = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dir, "propose.png");
    const imgUrl = "https://drive.google.com/uc?id=1AKOFk9AUwd6GHzlK1j5Y9ElVul0usU-R";

    if (!fs.existsSync(imgPath)) {
        fs.ensureDirSync(dir);
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, res.data);
    }
};

async function makeImage({ one, two }) {
    const __root = path.join(__dirname, "cache", "canvas");

    const baseImg = await jimp.read(path.join(__root, "propose.png"));
    const pathImg = path.join(__root, `love_${one}_${two}.png`);
    const avatarOne = path.join(__root, `avt_${one}.png`);
    const avatarTwo = path.join(__root, `avt_${two}.png`);

    const avatar1Data = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    const avatar2Data = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;

    fs.writeFileSync(avatarOne, Buffer.from(avatar1Data, 'utf-8'));
    fs.writeFileSync(avatarTwo, Buffer.from(avatar2Data, 'utf-8'));

    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    baseImg.resize(760, 506)
        .composite(circleOne.resize(90, 90), 210, 65)
        .composite(circleTwo.resize(90, 90), 458, 105);

    const raw = await baseImg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);

    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0];

    if (!mention) {
        return api.sendMessage("Please mention someone to propose to!", threadID, messageID);
    }

    const tag = mentions[mention].replace("@", "");
    const one = senderID;
    const two = mention;

    try {
        const imgPath = await makeImage({ one, two });
        api.sendMessage({
            body: `├─🅛🅞🅥🅔 🅨🅞🅤 🅑🅐🅑🅨─┤`,
            mentions: [{ tag, id: two }],
            attachment: fs.createReadStream(imgPath)
        }, threadID, () => fs.unlinkSync(imgPath), messageID);
    } catch (err) {
        console.error(err);
        api.sendMessage("An error occurred while creating the image.", threadID, messageID);
    }
};
