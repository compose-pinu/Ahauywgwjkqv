module.exports.config = {
    name: 'tag',
    version: '1.0.1',
    permission: 0,
    credits: 'SK-SIDDIK',
    prefix: false,
    description: 'Tag reply system',
    category: 'user',
    usages: '',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, args, Users }) {
    let { senderID, messageReply, mentions, threadID } = event;
    let id = senderID; 
    let name;

    try {
        if (messageReply) {
            id = messageReply.senderID; 
        } else if (args[0] && Object.keys(mentions).length > 0) {
            id = Object.keys(mentions)[0];
        }

        name = await Users.getNameUser(id);

        let msg = {
            body: `‎♡ ${name} ‎♡\n\n`,
            mentions: [{ tag: name, id: id }]
        };

        api.sendMessage(msg, threadID);
    } catch (error) {
        console.error("Error:", error);
    }
};