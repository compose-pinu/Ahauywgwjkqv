const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "antichange",
  eventType: ["log:subscribe", "log:thread-name", "log:thread-image"],
  version: "1.0.0",
  credits: "SK-SIDDIK-KHAN",
  description: "Prevent unauthorized group changes",
};

module.exports.run = async ({ api, event }) => {
  const settingsPath = __dirname + "/Siddik/groupSettings.json";

  if (!fs.existsSync(settingsPath)) return;

  const groupSettings = JSON.parse(fs.readFileSync(settingsPath));
  const threadID = event.threadID;

  if (!groupSettings[threadID]) return;

  const settings = groupSettings[threadID];

  const revertName = async (currentName) => {
    if (settings.name && currentName !== settings.name) {
      await api.setTitle(settings.name, threadID);
      api.sendMessage("⚠️ Group name change detected and reverted.", threadID);
    }
  };

  const revertImage = async (currentImageUrl) => {
    if (settings.image && currentImageUrl !== settings.image) {
      const filePath = __dirname + "/cache/sk.png";

      request(settings.image)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {
          api.changeGroupImage(fs.createReadStream(filePath), threadID, () => {
            fs.unlinkSync(filePath);
            api.sendMessage("⚠️ Group image change detected and reverted.", threadID);
          });
        });
    }
  };

  switch (event.logMessageType) {
    case "log:thread-name":
      const nameInfo = await api.getThreadInfo(threadID);
      await revertName(nameInfo.threadName);
      break;

    case "log:thread-image":
      const imageInfo = await api.getThreadInfo(threadID);
      await revertImage(imageInfo.imageSrc);
      break;

    default:
      break;
  }
};
