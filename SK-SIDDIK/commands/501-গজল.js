module.exports.config = {
  name: "gojol",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "",
  prefix: true,
  category: "music",
  usages: "user",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  var hi = ["ɪꜱʟᴀᴍɪᴄ-ɢᴏᴊᴏʟ"];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
      "https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN",
   
   "https://drive.google.com/uc?id=1CCQqJVqvFsgyAd4ZjZB0BJ3lGN4Kc2l2",
   
   "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo",
   
   "https://drive.google.com/uc?id=1CDCa4AlqErr1b7JRNWL62AP0WtdjlSOE",
   
   "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht",
   
   "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e",
   
   "https://drive.google.com/uc?id=1CESeRi5Ue4HR6GSDfYJrREGGcsvYJvAB"
];

  const loadingMessage = await api.sendMessage({ body: "Loading Islamic Gojol... Please Wait ⏰" }, event.threadID);

  setTimeout(() => {
    api.unsendMessage(loadingMessage.messageID);
  }, 5000);

  const callback = () => {
    api.sendMessage({ 
      body: `「 ${know} 」`, 
      attachment: fs.createReadStream(__dirname + "/cache/26.mp3") 
    }, event.threadID, () => {
      fs.unlinkSync(__dirname + "/cache/26.mp3"); 
      api.unsendMessage(loadingMessage.messageID); 
    });
  };

  try {
    request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(__dirname + "/cache/26.mp3"))
      .on("close", () => {
        callback(); 
      });
  } catch (error) {
    api.unsendMessage(loadingMessage.messageID); 
    api.sendMessage({ body: "Sorry, there was an error fetching the audio. Please try again later." }, event.threadID);
  }
};