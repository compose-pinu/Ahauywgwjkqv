const axios = require("axios");

module.exports.config = {
  name: "album",
  version: "1.0.0",
  permisson: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "ভিডিও লিস্ট দেখুন এবং বেছে নিন",
  prefix: true,
  category: "video",
  usages: "[page_number]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/DJ-SIDDIK-15/cemiFinal/refs/heads/main/Siddik.json");

    if (!response.data || !response.data.siddik || response.data.siddik.length === 0) {
      return api.sendMessage("⚠️ ভিডিও লিস্ট আনতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }

    const videos = response.data.siddik;
    const itemsPerPage = 10;
    const page = parseInt(args[0]) || 1;
    const totalPages = Math.ceil(videos.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
      return api.sendMessage(`❌ অবৈধ পেজ নম্বর! 1 থেকে ${totalPages} এর মধ্যে একটি পেজ নম্বর দিন।`, event.threadID, event.messageID);
    }

    const startIndex = (page - 1) * itemsPerPage;
    const videosOnPage = videos.slice(startIndex, startIndex + itemsPerPage);

    let messageContent = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\nআপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n╰╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╯\n` +
        `┏━━━━━━━━━━━━━━━━━┓\n` +
      videosOnPage
        .map((video, index) => `┣➤ ${startIndex + index + 1}. ${video.name}`)
        .join("\n") +
        `\n┗━━━━[𝗦𝗜𝗗𝗗𝗜𝗞-𝗕𝗢𝗧]━━━━┛\n` +
        `\n☽━━━━━━━━━━━━━━━━━━☾\n           🔰 | 𝐏𝐚𝐠𝐞 [ ${page}/${totalPages} ] 🔰\n☽━━━━━━━━━━━━━━━━━━☾`;

    api.sendMessage(messageContent, event.threadID, (err, info) => {
      if (err) return console.error("⚠️ ভিডিও লিস্ট পাঠাতে সমস্যা:", err);

      global.client.handleReply.push({
        name: "album",
        messageID: info.messageID,
        author: event.senderID,
        videos: videos
      });
    });

  } catch (error) {
    console.error("⚠️ ভিডিও লিস্ট ফেচ করতে সমস্যা:", error);
    api.sendMessage("⚠️ ভিডিও লিস্ট আনতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  const selectedNumber = parseInt(event.body);
  
  if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > handleReply.videos.length) {
    return api.sendMessage("❌ দয়া করে একটি সঠিক নাম্বার দিন।", event.threadID, event.messageID);
  }

  const selectedVideo = handleReply.videos[selectedNumber - 1];

  try {
    const loadingMessage = await api.sendMessage("𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨 𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭...⏰", event.threadID);

    const videoUrl = selectedVideo.verses[Math.floor(Math.random() * selectedVideo.verses.length)];

    console.log("✅ Selected Video URL:", videoUrl); 

    const response = await axios({
      method: "GET",
      url: videoUrl,
      responseType: "stream"
    });

    if (!response.data) {
      return api.sendMessage("⚠️ ভিডিও লোড করতে ব্যর্থ হয়েছে! দয়া করে পরে চেষ্টা করুন।", event.threadID, event.messageID);
    }

    api.sendMessage({
      body: `𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓 - ${selectedVideo.name}`,
      attachment: response.data,
    }, event.threadID, () => api.unsendMessage(loadingMessage.messageID));

  } catch (error) {
    console.error("⚠️ ভিডিও পাঠাতে সমস্যা:", error);
    api.sendMessage("⚠️ ভিডিও পাঠাতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
