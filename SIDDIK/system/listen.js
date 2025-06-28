module.exports = function({ api, models }) {
  setInterval(function () {
    if (global.config.notification) {
      require("./handle/handleNotification.js")({ api });
    }
  }, 1000 * 60);

  const Users = require("./controllers/users")({ models, api });
  const Threads = require("./controllers/threads")({ models, api });
  const Currencies = require("./controllers/currencies")({ models });
  const logger = require("../catalogs/Siddikc.js");
  const chalk = require("chalk");
  const gradient = require("gradient-string");
  const crayon = gradient('yellow', 'lime', 'green');
  const sky = gradient('#3446eb', '#3455eb', '#3474eb');

  (async function () {
    try {
      const process = require("process");
      const [threads, users] = await Promise.all([
        Threads.getAll(),
        Users.getAll(['userID', 'name', 'data'])
      ]);

      threads.forEach(data => {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread);
        global.data.threadData.set(idThread, data.data || {});
        global.data.threadInfo.set(idThread, data.threadInfo || {});
        if (data.data?.banned) {
          global.data.threadBanned.set(idThread, {
            'reason': data.data.reason || '',
            'dateAdded': data.data.dateAdded || ''
          });
        }
        if (data.data?.commandBanned?.length) {
          global.data.commandBanned.set(idThread, data.data.commandBanned);
        }
        if (data.data?.NSFW) {
          global.data.threadAllowNSFW.push(idThread);
        }
      });

      users.forEach(dataU => {
        const idUsers = String(dataU.userID);
        global.data.allUserID.push(idUsers);
        if (dataU.name?.length) {
          global.data.userName.set(idUsers, dataU.name);
        }
        if (dataU.data?.banned) {
          global.data.userBanned.set(idUsers, {
            'reason': dataU.data.reason || '',
            'dateAdded': dataU.data.dateAdded || ''
          });
        }
        if (dataU.data?.commandBanned?.length) {
          global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
        }
      });

      global.loading(`Deployed ${chalk.blueBright(`${global.data.allThreadID.length}`)} groups and ${chalk.blueBright(`${global.data.allUserID.length}`)} users ]\n\n${chalk.blue(`_____________________________________________

███████╗██╗  ██╗    ███████╗██╗██████╗ ██████╗ ██╗██╗  ██╗
██╔════╝██║ ██╔╝    ██╔════╝██║██╔══██╗██╔══██╗██║██║ ██╔╝
███████╗█████╔╝     ███████╗██║██║  ██║██║  ██║██║█████╔╝ 
╚════██║██╔═██╗     ╚════██║██║██║  ██║██║  ██║██║██╔═██╗ 
███████║██║  ██╗    ███████║██║██████╔╝██████╔╝██║██║  ██╗
╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═╝
_____________________________________________

Owner   : SK.SIDDIK.KHAN

Facebook   : https://www.facebook.com/TERA.PAPPA.IS.BUSY

Whatsapp   : wa.me/+8801831773688

Msg Enjoy Siddik Bot Here🤙
_____________________________________________ 

SK SIDDIK PROJECT VERSION 4.0.0
_____________________________________________`)}\n`, "[ Data");

    } catch (error) {
      logger.loader(`can't load environment variable, error : ${error}`, 'error');
    }
  })();

  const operator = global.config.OPERATOR.length;
  const admin = global.config.ADMINBOT.length;
  const approved = global.config.APPROVED.length;

  console.log(`${crayon(``)}${sky(`[ Data -`)} bot name : ${chalk.blueBright(global.config.BOTNAME || "SIDDIK")} ]\n${sky(`[ Data -`)} bot id : ${chalk.blueBright(api.getCurrentUserID())} ]\n${sky(`[ Data -`)} bot prefix : ${chalk.blueBright(global.config.PREFIX)} ]\n${sky(`✦──────✦ Data -`)} deployed ${chalk.blueBright(operator)} bot operators and ${chalk.blueBright(admin)} addmins ✦──────✦`);

  if (global.config.approval) {
    console.log(`${sky(`[ Data -`)} deployed ${chalk.blueBright(approved)} approved groups ]`);
  }

  const handleCommand = require("./handle/handleCommand.js")({ api, Users, Threads, Currencies, models });
  const handleCommandEvent = require("./handle/handleCommandEvent.js")({ api, Users, Threads, Currencies, models });
  const handleReply = require("./handle/handleReply.js")({ api, Users, Threads, Currencies, models });
  const handleReaction = require("./handle/handleReaction.js")({ api, Users, Threads, Currencies, models });
  const handleEvent = require("./handle/handleEvent.js")({ api, Users, Threads, Currencies, models });
  const handleCreateDatabase = require("./handle/handleCreateDatabase.js")({ api, Threads, Users, Currencies, models });

  return (event) => {
    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;
      case "change_thread_image":
        break;
      case "event":
        handleEvent({ event });
        break;
      case "message_reaction":
        handleReaction({ event });

        if (event.reaction == "⚠️") {
          if (event.userID == global.config.ADMINBOT[0]) {
            api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
              if (err) return console.log(err);
            });
          }
        }

        const emoji = global.config?.reactUnsend || "😡";
        const id = global.config.ADMINBOT;

        if (emoji.includes(event.reaction)) {
          if (event.senderID === api.getCurrentUserID()) {
            if (id.includes(event.userID)) {
              api.unsendMessage(event.messageID);
            }
          }
        }

        break;
      default:
        break;
    }
  };
};
