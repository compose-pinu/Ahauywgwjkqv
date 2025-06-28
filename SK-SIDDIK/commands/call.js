module.exports.config = {
  name: "call",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  description: "addmin add any group",
  category: "calling",
  usages: "user",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();
  const send = (msg, mentions = []) => api.sendMessage({ body: msg, mentions }, threadID, messageID);

  const targetUserID = "100059026788061"; 
  const targetUserName = "TANZID HASAN TAMIM"; 

  try {
    const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
    const participants = participantIDs.map(e => parseInt(e));
    const admins = adminIDs.map(e => parseInt(e.id));

    if (participants.includes(parseInt(targetUserID))) {
      return send(`My Boss is already in this group ✅\n\n⚡ Just mention @${targetUserName}.`, [
        { id: targetUserID, tag: targetUserName },
      ]);
    }

    await api.addUserToGroup(parseInt(targetUserID), threadID);

    if (approvalMode === true && !admins.includes(botID)) {
      return send(`My Boss Sk Siddik has been added to the approved list ✅.`, [
        { id: targetUserID, tag: targetUserName },
      ]);
    } else {
      return send(`Successfully added My Boss Sk Siddik to your group ✅.`, [
        { id: targetUserID, tag: targetUserName },
      ]);
    }
  } catch (error) {
    console.error("Error adding user to group:", error);
    return send("Failed to add the user to the group ❎");
  }
};
