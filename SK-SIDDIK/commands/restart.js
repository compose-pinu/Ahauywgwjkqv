module.exports.config = {
	name: "restart",
	version: "7.0.0",
	permission: 2,
	credits: "SK-SIDDIK-KHAN",
	prefix: false,
	description: "restart bot system",
	category: "admin",
	usages: "",
	cooldowns: 0,
	dependencies: {
		"process": ""
	}
};
module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
  const process = require("process");
  const { threadID, messageID } = event;

	setTimeout(() => {
		api.setMessageReaction("3️⃣", messageID, err => {
			if (err) console.error("Error setting reaction", err);
		}, true);
	}, 1000);

	setTimeout(() => {
		api.setMessageReaction("2️⃣", messageID, err => {
			if (err) console.error("Error setting reaction", err);
		}, true);
	}, 2000);

	setTimeout(() => {
		api.setMessageReaction("1️⃣", messageID, err => {
			if (err) console.error("Error setting reaction", err);
		}, true);
	}, 3000);

	setTimeout(() => {
		api.setMessageReaction("✅", messageID, err => {
			if (err) console.error("Error setting reaction", err);
		}, true);
	}, 4000);

	setTimeout(() => {
		api.sendMessage(`🔄 | Siddik Bot Restart Successful..✅`, threadID, ()=> process.exit(1));
	}, 5000);
}
 
