module.exports.config = {
    name: "adminnoti",
    eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname"],
    version: "1.0.1",
    credits: "Mirai Team",
    description: "Update group information quickly",
    envConfig: {
        autoUnsend: true,
        sendNoti: true,
        timeToUnsend: 10
    }
};
 
module.exports.run = async function ({ event, api, Threads }) { 
    const { threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;
    const config = global.configModule[this.config.name] || { autoUnsend: false, sendNoti: false, timeToUnsend: 10 };
 
    try {
        let dataThread = (await getData(threadID)).threadInfo;
 
        switch (logMessageType) {
            case "log:thread-admins": {
                const { ADMIN_EVENT, TARGET_ID } = logMessageData;
                const action = ADMIN_EVENT === "add_admin" ? "Became a group admin" : "Removed from admin position";
                
                if (ADMIN_EVENT === "add_admin") {
                    dataThread.adminIDs.push({ id: TARGET_ID });
                } else {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != TARGET_ID);
                }
 
                if (config.sendNoti) {
                    api.sendMessage(`[ GROUP UPDATE ]\n❯ USER UPDATE ${TARGET_ID} ${action}`, threadID, async (error, info) => {
                        if (config.autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, config.timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                }
                break;
            }
 
            case "log:user-nickname": {
                const { participant_id, nickname } = logMessageData;
                dataThread.nicknames[participant_id] = nickname || "original name";
 
                if (typeof global.configModule["nickname"] !== "undefined" &&
                    !global.configModule["nickname"].allowChange.includes(threadID) &&
                    (!dataThread.adminIDs.some(item => item.id === event.author) || 
                     event.author === api.getCurrentUserID())) return;
 
                if (config.sendNoti) {
                    api.sendMessage(`[ Thread Update ] Nickname updated: ${participant_id} → ${nickname || "original name"}`, threadID, async (error, info) => {
                        if (config.autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, config.timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                }
                break;
            }
 
            case "log:thread-name": {
                dataThread.threadName = logMessageData.name || "No name";
 
                if (config.sendNoti) {
                    api.sendMessage(`[ Thread Update ] Group name changed to: ${dataThread.threadName}`, threadID, async (error, info) => {
                        if (config.autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, config.timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                }
                break;
            }
        }
 
        await setData(threadID, { threadInfo: dataThread });
    } catch (e) {
        console.error("[ERROR] adminUpdate module:", e);
    }
};
