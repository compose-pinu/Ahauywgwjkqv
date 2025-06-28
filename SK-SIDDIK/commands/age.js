module.exports.config = {
  name: "age",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  category: "birthday",
  usages: "user",
  cooldowns: 5,
};

module.exports.run = async function ({ event, args, api }) {
  async function streamURL(url, mime='jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`,
    downloader = require('image-downloader'),
    fse = require('fs-extra');
    await downloader.image({ url, dest });
    setTimeout(j => fse.unlinkSync(j), 60 * 1000, dest);
    return fse.createReadStream(dest);
  }

  var input = args[0];
  if (!input) return api.sendMessage(`[🌸]➤ Please enter the correct format: >age [DD/MM/YYYY]`, event.threadID, event.messageID);

  var cc = input.split("/");
  var day = parseInt(cc[0]);
  if (!day || isNaN(day) || day > 31 || day < 1) return api.sendMessage("[🌸]➤ Invalid day of birth!", event.threadID, event.messageID);
  
  var month = parseInt(cc[1]);
  if (!month || isNaN(month) || month > 12 || month < 1) return api.sendMessage("[🌸]➤ Invalid month of birth!", event.threadID, event.messageID);
  
  var year = parseInt(cc[2]);
  if (!year) return api.sendMessage("[🌸]➤ Invalid year of birth!", event.threadID, event.messageID);
  
  const moment = require("moment-timezone");
  var currentTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
  var dateParts = currentTime.split(" ");
  var currentDate = dateParts[0].split("/");
  
  var currentDay = parseInt(currentDate[0]);
  var currentMonth = parseInt(currentDate[1]);
  var currentYear = parseInt(currentDate[2]);

  var dayDiff = currentDay - day;
  var monthDiff = currentMonth - month;
  var yearDiff = currentYear - year;

  var timeParts = dateParts[1].split(":");
  var hours = parseInt(timeParts[0]);
  var minutes = parseInt(timeParts[1]);
  var seconds = parseInt(timeParts[2]);

  var exactYear = yearDiff + Math.round(monthDiff / 12 * 100) / 100;
  var totalMonths = exactYear * 12 + monthDiff + day / 31;
  var totalWeeks = Math.round(totalMonths * 4 * 100) / 100;
  var totalDays = (totalMonths * 31 + totalMonths * 30) / 2 - (totalMonths / 36 * 3 / 2) + dayDiff + hours / 24;
  var totalHours = Math.round((totalDays * 24 + hours) * 100) / 100;
  var totalMinutes = Math.round((totalHours * 60 + minutes + seconds / 60) * 100) / 100;
  var totalSeconds = Math.round((totalMinutes * 60 + seconds) * 100) / 100;

  return api.sendMessage({
    body: `┏━━━[ YOUR AGE ]━━━➣
┃ Date of Birth: ${input}
┃ Your Age: ${exactYear} Years
┃━━━━━━━━━━━━━━━➢
┃ ➤ Months: ${Math.round(totalMonths * 100) / 100}
┃ ➤ Weeks: ${totalWeeks}
┃ ➤ Days: ${Math.round(totalDays * 100) / 100}
┃ ➤ Hours: ${totalHours}
┃ ➤ Minutes: ${totalMinutes}
┃ ➤ Seconds: ${totalSeconds}
┗━━[ SIDDIK BOT ]━━➣`,
    attachment: await streamURL(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
  }, event.threadID, event.messageID);
};