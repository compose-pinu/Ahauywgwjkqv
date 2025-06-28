module.exports.config = {
    name: "mygf",
    version: "2.6.0",
    permission: 0,
    credits: "SK-SIDDIK-KHAN",
    description: "King and Queen",
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
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync, createWriteStream } = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const dirMaterial = resolve(__dirname, 'cache', 'canvas');
    const path = resolve(dirMaterial, 'mygf.png');

    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

    if (!existsSync(path)) {
        try {
            const url = "https://drive.google.com/uc?id=19UVI0l2pDh1Jd6ZB3f9H7TOlem5Ew3vA";
            const response = await axios.get(url, { responseType: 'stream' });
            const writer = createWriteStream(path);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (err) {
            console.error("Failed to download background image:", err);
        }
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    const bgPath = path.join(__root, "mygf.png");
    if (!fs.existsSync(bgPath)) throw new Error("Background image not found!");

    let bg = await jimp.read(bgPath);
    let pathImg = path.join(__root, `love_${one}_${two}.png`);
    let avatarOne = path.join(__root, `avt_${one}.png`);
    let avatarTwo = path.join(__root, `avt_${two}.png`);

    try {
        let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

        let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    } catch (err) {
        throw new Error("Failed to download Facebook avatars: " + err.message);
    }

    try {
        let circleOne = await jimp.read(await circle(avatarOne));
        let circleTwo = await jimp.read(await circle(avatarTwo));

        bg.resize(1280, 716)
            .composite(circleOne.resize(360, 360), 130, 200)
            .composite(circleTwo.resize(360, 360), 787, 200);

        let raw = await bg.getBufferAsync("image/png");
        fs.writeFileSync(pathImg, raw);

        fs.unlinkSync(avatarOne);
        fs.unlinkSync(avatarTwo);

        return pathImg;
    } catch (err) {
        if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
        if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
        throw new Error("Image processing failed: " + err.message);
    }
}

async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;
    var mention = Object.keys(event.mentions)[0];

    if (!mention) {
        return api.sendMessage("🔰 Please Mention Your Gf 🔰", threadID, messageID);
    }

    let tag = event.mentions[mention].replace("@", "");
    let one = senderID, two = mention;

    try {
        const path = await makeImage({ one, two });
        api.sendMessage({
            body: `𝗞𝗶𝗻𝗴 𝗮𝗻𝗱 𝗤𝘂𝗲𝗲𝗻 <😘😊🦋︎`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
        console.error("Error in mygf command:", error);
        return api.sendMessage("❌ Error generating image:\n" + error.message, threadID, messageID);
    }
};
