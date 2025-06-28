module.exports.config = {
  name: "up",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: false,
  description: "Uptime",
  category: "no prefix",
  usages: "user",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  let time = process.uptime();
  let hours = Math.floor(time / (60 * 60));
  let minutes = Math.floor((time % (60 * 60)) / 60);
  let seconds = Math.floor(time % 60);
  const timeStart = Date.now();

  return api.sendMessage('', event.threadID, (err, info) => {
    setTimeout(() => {
      const hoursString = hours === 1 ? "hour" : "hours";
      const minutesString = minutes === 1 ? "minute" : "minutes";
      const secondsString = seconds === 1 ? "second" : "seconds";

      const uptimeString = `${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ড`;

      api.sendMessage(`${uptimeString}`, event.threadID, event.messageID);
    }, 200);
  }, event.messageID);
};
