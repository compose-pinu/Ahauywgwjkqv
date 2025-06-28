module.exports.config = {
  name: "lift",
  version: "1.0.0",
  permission: 2,
  prefix: false,
  credits: "SK-SIDDIK-KHAN",
  description: "any group time to lift",
  category: "auto-lift", 
  usages: "admin",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const delayMinutes = parseInt(args[0]);

  if (!args[0] || isNaN(delayMinutes)) {
    return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  }

  api.sendMessage(
    `╭────────────────⊙\n├─☾ JUST WAIT\n├─☾ ${delayMinutes} MINUTES\n├─☾ SK SIDDIK KHAN\n╰────────────────⊙`,
    event.threadID
  );

  setTimeout(() => {
    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  }, delayMinutes * 60 * 1000);
};
