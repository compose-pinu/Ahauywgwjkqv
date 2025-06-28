module.exports.config = {
  name: "info",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  description: "",
  category: "prefix",
  usages: "",
  cooldowns: 5,
  dependencies: 
{
  "request":"",
  "fs-extra":"",
  "axios":""
}
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
  hours = Math.floor(time / (60 * 60)),
  minutes = Math.floor((time % (60 * 60)) / 60),
  seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format(" hh:mm:ss");
 
var callback = () => api.sendMessage({body:` 
┏━━━━━━━━━━━━━━━━━┓
┣➤𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : 𝐒𝐈𝐃𝐃𝐈𝐊 𝐁𝐎𝐓
┣➤𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 : 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊
┣➤𝐅𝐁 : 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊 𝐊𝐇𝐀𝐍
┣➤𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 : ${global.config.PREFIX}
┣➤𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 : 𝐒𝐊 𝐒𝐈𝐃𝐃𝐈𝐊
┣➤𝐔𝐏𝐓𝐈𝐌𝐄
┣➤𝐓𝐎𝐃𝐀𝐘 𝐈𝐒 𝐓𝐈𝐌𝐄 : ${juswa}  
┣➤𝐁𝐎𝐓 𝐈𝐒 𝐑𝐔𝐍𝐍𝐈𝐍𝐆 ${hours}:${minutes}:${seconds}.
┣➤𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆
┗━━━━[𝗦𝗜𝗗𝗗𝗜𝗞-𝗕𝗢𝗧]━━━━━┛`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => 
  fs.unlinkSync(__dirname + "/cache/1.png"));  
    return request(encodeURI(`https://graph.facebook.com/100059026788061/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(
fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
 };
