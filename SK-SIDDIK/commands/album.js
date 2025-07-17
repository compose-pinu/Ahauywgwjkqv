const fs = require("fs");
const path = require("path");
const https = require("https");

const categories = {
  "ISLAMIC-VIDEO": [
    "https://i.imgur.com/2JvDA4e.mp4",
    "https://i.imgur.com/ZWVwq1l.mp4",
    "https://i.imgur.com/FpuexGp.mp4",
    "https://i.imgur.com/Ew7CvTt.mp4",
    "https://i.imgur.com/V0OqX8g.mp4",
    "https://i.imgur.com/JmUDnqb.mp4",
    "https://i.imgur.com/FUnr5qQ.mp4",
    "https://i.imgur.com/AQwbIOr.mp4",
    "https://i.imgur.com/Tmt0IGj.mp4",
    "https://i.imgur.com/v0I3a1W.mp4",
    "https://i.imgur.com/Ai6RzC5.mp4",
    "https://i.imgur.com/cLbms2h.mp4",
    "https://i.imgur.com/WVitFo7.mp4",
    "https://i.imgur.com/tl5pUKV.mp4",
    "https://i.imgur.com/MqwgGtt.mp4",
    "https://i.imgur.com/xeZsWGT.mp4",
    "https://i.imgur.com/ggaGB0v.mp4",
    "https://i.imgur.com/qTSRbNF.mp4",
    "https://i.imgur.com/d8GRdba.mp4",
    "https://i.imgur.com/6J5V9qA.mp4",
    "https://i.imgur.com/W2tlljJ.mp4",
    "https://i.imgur.com/Bma5E6H.mp4",
    "https://i.imgur.com/zJO00lU.mp4",
    "https://i.imgur.com/iK7HgGJ.mp4",
    "https://i.imgur.com/AGgrxCv.mp4",
    "https://i.imgur.com/fxYQOh3.mp4",
    "https://i.imgur.com/lMtE97b.mp4",
    "https://i.imgur.com/W7Sl7Lg.mp4",
    "https://i.imgur.com/wVkIgip.mp4",
    "https://i.imgur.com/rKPBWbh.mp4",
    "https://i.imgur.com/JaZUUm9.mp4",
    "https://i.imgur.com/IlxXBo3.mp4",
    "https://i.imgur.com/ho6L4po.mp4"
  ]
};

const PAGE_SIZE = 11;

module.exports.config = {
  name: "album",
  version: "1.0.0",
  permisson: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "ভিডিও লিস্ট দেখুন এবং বেছে নিন",
  prefix: true,
  category: "video",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const categoryKeys = Object.keys(categories);
  let page = 1;

  if (args.length > 0) {
    const inputPage = parseInt(args[0], 10);
    if (!isNaN(inputPage) && inputPage > 0) {
      page = inputPage;
    }
  }

  const totalPages = Math.ceil(categoryKeys.length / PAGE_SIZE);
  if (page > totalPages) {
    return api.sendMessage(`❌ Page ${page} doesn't exist. Total pages: ${totalPages}`, event.threadID, event.messageID);
  }

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const currentPageCategories = categoryKeys.slice(startIndex, endIndex);

  const msg =
    `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\n` +
    `আপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n` +
    `╰╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╯\n` +
    `┏━━━━━━━━━━━━━━━━━┓\n` +
    currentPageCategories
      .map((cat, i) => `┣➤ ${startIndex + i + 1}. ${cat.toUpperCase()}`)
      .join("\n") +
    `\n┗━━━━[𝗦𝗜𝗗𝗗𝗜𝗞-𝗕𝗢𝗧]━━━━┛\n` +
    `\n☽━━━━━━━━━━━━━━━━━━☾\n           🔰 | 𝐏𝐚𝐠𝐞 [ ${page} / ${totalPages} ] 🔰\n☽━━━━━━━━━━━━━━━━━━☾`;

  api.sendMessage({ body: msg }, event.threadID, (err, replyMsg) => {
    if (err) return;
    global.GoatBot.onReply.set(replyMsg.messageID, {
      commandName: "album",
      messageID: replyMsg.messageID,
      author: event.senderID,
      type: "selectCategory",
    });

    setTimeout(() => {
      api.unsendMessage(replyMsg.messageID).catch(() => {});
    }, 30000);
  }, event.messageID);
};

module.exports.onReply = async function ({ api, event, Reply }) {
  if (Reply.author !== event.senderID) {
    return api.sendMessage("⚠️ You are not authorized to reply to this option", event.threadID, event.messageID);
  }

  const categoryKeys = Object.keys(categories);
  const num = parseInt(event.body.trim());

  if (isNaN(num) || num < 1 || num > categoryKeys.length) {
    return api.sendMessage("❌ Invalid input. Please enter a valid number", event.threadID, event.messageID);
  }

  const category = categoryKeys[num - 1];
  const videoURL = categories[category][Math.floor(Math.random() * categories[category].length)];
  const fileName = path.basename(videoURL);
  const filePath = path.join(__dirname, "cache", "album", fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const loadingMsg = await api.sendMessage(`⏳ Loading ${category.toUpperCase()}`, event.threadID);

  try {
    if (!fs.existsSync(filePath)) {
      await downloadFile(filePath, videoURL);
    }

    await api.sendMessage({
      body: `✅ Here's Your ${category.toUpperCase()}`,
      attachment: fs.createReadStream(filePath),
    }, event.threadID, () => {
      api.unsendMessage(loadingMsg.messageID);
    });
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Failed to load video", event.threadID);
  }
};

function downloadFile(filePath, url) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (res) => {
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
}
