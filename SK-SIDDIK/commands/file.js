const fs = require('fs-extra'); 

module.exports.config = {
    name: "file",
    version: "1.0.0",
    permission: 2,
    credits: "SK-SIDDIK-KHAN",
    prefix: true,
    category: "with prefix",
    usages: `file name`,
    cooldowns: 5,
    dependencies: {
        "path": "",
        "fs-extra": ""
    }
};

module.exports.run = async ({ args, api, event, Users }) => {
    const permission = ["100059026788061", "100004282697847"]; 
    if (!permission.includes(event.senderID)) {
        return api.sendMessage('[❗] Only Permission User Can Use This File', event.threadID, event.messageID);
    }

    const name = args.join(" ");
    if (!name) {
        return api.sendMessage("Please provide the file name", event.threadID);
    }

    try {
        const filePath = __dirname + `/${name}.js`; 
        const fileContent = fs.readFileSync(filePath, "utf8"); 
        api.sendMessage(fileContent, event.threadID); 
    } catch (error) {
        api.sendMessage(`Error reading file: ${error.message}`, event.threadID); 
    }
};