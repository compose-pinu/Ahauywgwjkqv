module.exports.config = {
name: "spam",
  version: "1.1.0",
  permssion: 2,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  description: "",
  category: "spam",
  usages: " [amount]",
  cooldowns: 5,
  dependencies: "",
};
 
module.exports.run = function ({ api, event, Users, args }) {
  const permission = ["100059026788061"] ;
   if (!permission.includes(event.senderID))
   return api.sendMessage("Only Sk Siddik Boss Use this command", event.threadID, event.messageID);
  if (args.length !== 2) {
    api.sendMessage(`Invalid number of arguments. Usage: ${global.config.PREFIX}spam [msg] [amount]`, event.threadID);
    return;
  }
  var { threadID, messageID } = event;
  var k = function (k) { api.sendMessage(k, threadID)};
 
  const msg = args[0];
  const count = args[1];
 
for (i = 0; i < `${count}`; i++) {
 k(`${msg}`);
}
 
}
