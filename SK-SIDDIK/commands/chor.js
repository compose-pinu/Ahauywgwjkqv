module.exports.config = {
  name: "chor",
  version: "1.0.0",
  permssion: 0,
  prefix: true,
  credits: "SK-SIDDIK",
  description: "",
  category: "fun",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": "",
    "node-superfetch": "" 
  }
};

module.exports.circle = async (image) => {
  const jimp = global.nodemodule['jimp'];
  image = await jimp.read(image);
  image.circle();
  return image;  
};

module.exports.run = async ({ event, api, args, Users }) => {
  try {
    const Canvas = global.nodemodule['canvas'];
    const request = global.nodemodule["node-superfetch"];
    const jimp = global.nodemodule["jimp"];
    const fs = global.nodemodule["fs-extra"];
    var path_toilet = __dirname + '/cache/damma.jpg'; 
    var id = Object.keys(event.mentions)[0] || event.senderID;
    const canvas = Canvas.createCanvas(500, 670);
    const ctx = canvas.getContext('2d');
    const background = "https://drive.google.com/uc?id=1BqUpRXRa3GJ36ONYZr2tS2SKGpnbBeHr";
    
    var avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    console.log('Fetched Avatar:', avatar); 

    avatar = await this.circle(avatar.body);
    console.log('Processed Avatar:', avatar); 

    const backgroundImage = await Canvas.loadImage(background);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(await avatar.getBufferAsync("image/png")), 48, 410, 111, 111);  

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(path_toilet, imageBuffer);
    
    api.sendMessage({ 
      attachment: fs.createReadStream(path_toilet, { 'highWaterMark': 128 * 1024 }), 
      body: "বলদ মেয়েদের চিপায় ধরা খাইছে😁😁" 
    }, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);
    
  } catch (e) {
    console.log('Error:', e.stack);
    api.sendMessage(e.stack, event.threadID);
  }
};
