module.exports.config = {
  name: "fm",
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

  var hi = ["🅥🅤🅣-🅕🅜"];
  var know = hi[Math.floor(Math.random() * hi.length)];
  var link = [
   "https://drive.google.com/uc?id=1DyhbJ-j-4N0dJBf7cqZ3HJlfVSqFPFNr",
   
   "https://drive.google.com/uc?id=1E6c3W9QcSUxxlfhPzMbM_8QAUwJGjJ20",
   
   "https://drive.google.com/uc?id=1E2BG1gb8T33SrFo5CkWHJACwHdv2iwdF",
   
   "https://drive.google.com/uc?id=1E9h0tfBCHyTZuDNZnPlifCKLxJDy9jBe",
   
   "https://drive.google.com/uc?id=1E2JuP8aIqW6bTqlB0yavXKxQPY1o6RPI",
   
   "https://drive.google.com/uc?id=1E9cK5e2vRvesVAsFeWvX7PtM-eE5I4H4",
   
   "https://drive.google.com/uc?id=1E103RtEOdMaVS30TXLreISz5Vg5bEkxl"
];

  const loadingMessage = await api.sendMessage({ body: "Loading Vut Fm... Please wait ⏰" }, event.threadID);

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