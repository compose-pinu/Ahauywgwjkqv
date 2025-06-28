module.exports.config = {
  name: "adduser",
  version: "2.4.3",
  permssion: 0,
  credits: "SK-SIDDIK-KHAN",
  prefix: true,
  description: "Add user to the group by link or UID",
  category: "group",
  usages: "(uid/link)",
  cooldowns: 5
};

async function getUID(url, api) {
  if (!url.includes("facebook.com") && !url.includes("fb.com")) {
    return ["⛔ Please enter a valid Facebook URL", null, true];
  }

  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    let data = await api.httpGet(url);
    const redirectMatch = /{"redirect":"(.*?)"}/.exec(data);

    if (redirectMatch) {
      const redirectURL = redirectMatch[1].replace(/\\/g, '').split('?')[0];
      data = await api.httpGet(redirectURL);
    }

    const idMatch = /"userID":"(\d+)"/.exec(data);
    const nameMatch = /"title":"(.*?)"/.exec(data);
    const name = nameMatch ? JSON.parse(`{"name":"${nameMatch[1]}"}`).name : "Facebook User";

    return [idMatch ? idMatch[1] : null, name, false];
  } catch (e) {
    return [null, null, true];
  }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();

  if (!args[0]) {
    return api.sendMessage("Please enter a user ID or Facebook profile link ⚠️", threadID, messageID);
  }

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs.map(e => parseInt(e));
  const adminIDs = threadInfo.adminIDs.map(e => parseInt(e.id));
  const approvalMode = threadInfo.approvalMode;

  const adduser = async (id, name = "Facebook User") => {
    id = parseInt(id);

    if (participantIDs.includes(id)) {
      return api.sendMessage(`${name} is already in the group. ✅`, threadID, messageID);
    }

    try {
      await api.addUserToGroup(id, threadID);
    } catch {
      return api.sendMessage(`Can't add ${name} to the group. ❎`, threadID, messageID);
    }

    if (approvalMode && !adminIDs.includes(botID)) {
      return api.sendMessage(`Added ${name}, but they need to be approved. ✅❎`, threadID, messageID);
    } else {
      return api.sendMessage(`Successfully added ${name} to the group! ✅`, threadID, messageID);
    }
  };

  if (!isNaN(args[0])) {
    return adduser(args[0]);
  } else {
    try {
      const [id, name, failed] = await getUID(args[0], api);

      if (failed && id != null) {
        return api.sendMessage(id, threadID, messageID);
      } else if (failed && id == null) {
        return api.sendMessage("User ID not found. ❎", threadID, messageID);
      } else {
        return await adduser(id, name);
      }
    } catch (e) {
      return api.sendMessage(`${e.name}: ${e.message}`, threadID, messageID);
    }
  }
};
