const moment = require('moment-timezone');

module.exports.config = {
    name: 'link',
    version: '1.0.0',
    permission: 0,
    credits: 'SK-SIDDIK-KHAN',
    prefix: false,
    description: 'auto link',
    category: 'utility',
    usages: 'user',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async ({ event, api, args }) => {
    const { messageReply, senderID, threadID, messageID, type, mentions } = event;
    let uid;

    if (type == "message_reply") {
        uid = messageReply.senderID;
    } else if (args.join().indexOf("@") !== -1) {
        uid = Object.keys(mentions)[0];
    } else {
        uid = senderID;
    }

    try {
        const data = await api.getUserInfo(uid);
        const { profileUrl } = data[uid];

        return api.sendMessage(`${profileUrl}`, threadID, messageID);
    } catch (error) {
        return api.sendMessage("Could not retrieve user profile link.", threadID, messageID);
    }
};
