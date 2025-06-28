module.exports.config = {
    name: 'pp',
    version: '1.0.0',
    permission: 0,
    credits: 'SK-SIDDIK-KHAN',
    prefix: false,
    description: 'Fetches the profile picture of a user.',
    category: 'image',
    usages: '[mention user]',
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function ({ api, event, args }) {
    const request = require("request");
    const fs = require("fs");
    const path = __dirname + "/cache/1.png"; 

    let id = event.senderID;

    if (event.messageReply) {
        id = event.messageReply.senderID;
    } else if (args[0] && args[0].indexOf('@') !== -1) {
        let mentions = Object.keys(event.mentions);
        id = mentions[0]; 
    }

    const callback = () => {
        api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => {
            fs.unlinkSync(path); 
        }, event.messageID);
    };

    const accessToken = '6628568379|c1e620fa708a1d5696fb991c1bde5662';

    request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=${accessToken}`))
        .pipe(fs.createWriteStream(path))
        .on('close', callback)
        .on('error', (err) => {
            console.error('Error fetching the profile picture:', err);
            api.sendMessage('An error occurred while fetching the profile picture. Please try again later.', event.threadID);
        });
};
