module.exports.config = {
	name: "tid",	
    version: "1.0.0", 
	permssion: 0,
	credits: "SK-SIDDIK",
	description: "Get box id", 
	prefix: true,
	category: "group",
	usages: "tid",
	cooldowns: 5, 
	dependencies: '',
};
 
module.exports.run = async function({ api, event }) {
  api.sendMessage(" "+event.threadID, event.threadID, event.messageID);
};
 