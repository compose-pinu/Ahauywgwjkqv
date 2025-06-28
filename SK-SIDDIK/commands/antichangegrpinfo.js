const fs = require("fs-extra");
const path = require("path");

const activeGroupsFilePath = path.join(__dirname, "..", "events", "Siddik", "groupSettings.json");

let activeGroups = {};
if (fs.existsSync(activeGroupsFilePath)) {
  try {
    const fileData = fs.readFileSync(activeGroupsFilePath, "utf-8");
    activeGroups = JSON.parse(fileData);

    if (typeof activeGroups !== "object" || Array.isArray(activeGroups)) {
      console.warn("Invalid activeGroups data structure Resetting");
      activeGroups = {};
    }
  } catch (error) {
    console.error("Error loading active groups:", error);
    activeGroups = {};
  }
}

const saveActiveGroups = () => {
  try {
    fs.writeFileSync(activeGroupsFilePath, JSON.stringify(activeGroups, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving active groups:", error);
  }
};

module.exports = {
  config: {
    name: "antichange",
    version: "1.0.0",
    permission: 0,
    credits: "SK-SIDDIK-KHAN",
    description: "Prevents unauthorized group changes",
    prefix: false,
    category: "box",
    usages: "antichange [on/off]",
    cooldowns: 5,
  },

  run: async ({ api, event, args, Threads }) => {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const botAdmins = global.config.ADMINBOT || [];

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);

      if (!groupAdmins.includes(senderID) && !botAdmins.includes(senderID)) {
        return api.sendMessage("⚠️ Only group admins or bot admins can use this command", threadID);
      }

      const { setData, getData, delData } = Threads;

      if (args[0] === "on") {
        if (!activeGroups[threadID]) {
          activeGroups[threadID] = {
            name: threadInfo.threadName || "",
            image: threadInfo.imageSrc || "",
          };

          await setData(threadID, { threadInfo });
          saveActiveGroups();

          return api.sendMessage("✅ Anti-change feature has been activated for this group", threadID);
        } else {
          return api.sendMessage("⚠️ Anti-change feature is already active for this group", threadID);
        }
      }

      if (args[0] === "off") {
        if (activeGroups[threadID]) {
          delete activeGroups[threadID];
          await delData(threadID);
          saveActiveGroups();

          return api.sendMessage("🚫 Anti-change feature has been deactivated for this group", threadID);
        } else {
          return api.sendMessage("⚠️ Anti-change feature is not active for this group", threadID);
        }
      }

      return api.sendMessage("⚠️ Invalid option. Use: antichange on | antichange off", threadID);
    } catch (err) {
      console.error("An error occurred in antichange command:", err);
      return api.sendMessage("❌ An unexpected error occurred. Please try again later", threadID);
    }
  }
};
