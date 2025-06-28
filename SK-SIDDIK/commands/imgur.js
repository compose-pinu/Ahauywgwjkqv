const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "imgur",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "Create a link for your image or video on Imgur",
  prefix: false,
  category: "other",
  usages: "[tag]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  async function uploadToImgur(attachmentBuffer) {
    try {
      const formData = new FormData();
      formData.append("image", attachmentBuffer, "image.jpg"); 

      console.log("Uploading to Imgur...");
      const uploadResponse = await axios.post("https://api.imgur.com/3/upload", formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Client-ID c76eb7edd1459f3` 
        },
      });

      console.log("Upload response:", uploadResponse.data);
      const imgurLink = uploadResponse.data.data.link;

      if (!imgurLink) {
        throw new Error("Failed to get Imgur link");
      }
      return imgurLink;
    } catch (error) {
      console.error("Imgur upload error:", error.response?.data || error.message);
      throw new Error("An error occurred while uploading to Imgur.");
    }
  }

  try {
    const attachmentLink = event.messageReply?.attachments[0]?.url;

    if (!attachmentLink) {
      return api.sendMessage(
        "Please reply to an image or video.",
        event.threadID,
        event.messageID
      );
    }

    const attachmentResponse = await axios.get(attachmentLink, { responseType: "arraybuffer" });
    const attachmentBuffer = attachmentResponse.data;

    const imgurLink = await uploadToImgur(attachmentBuffer);

    api.sendMessage(imgurLink, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage(
      "Failed to convert image or video into link.",
      event.threadID,
      event.messageID
    );
  }
};
