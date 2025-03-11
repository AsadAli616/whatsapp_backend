const db = require("../models");
const { transmitDataOnRealtime, sendFCMMessage } = require("../socket"); // Import Socket.IO instance
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = {
  sendMesage: async (body) => {
    const { personId, chatId, message } = body;
    const data = await db.Message.create({
      personId: personId,
      chatId: chatId,
      message: message,
    });
    if (!data) {
      throw new Error("connection error");
    }
    const findchat = await db.Chat.findOne({ where: { id: chatId } });
    if (!findchat) {
      throw new Error("connection error");
    }

    const [personOne, personTwo] = await Promise.all([
      db.User.findOne({ where: findchat.personOneId }),
      db.User.findOne({ where: findchat.personTwoId }),
    ]);

    if (!personOne) {
      throw new Error("connection error");
    }
    if (!personTwo) {
      throw new Error("connection error");
    }
    if (personTwo.socketId && personId != personTwo.id) {
      transmitDataOnRealtime("newMessage", personTwo.socketId, data);
    }
    if (personTwo.fcmToken && personId != personTwo.id) {
      sendFCMMessage(
        personTwo.fcmToken,
        `New message from: ${personTwo.firstName}`,
        `message: ${data.message}`
      );
    }
    if (personOne.socketId && personId != personOne.id) {
      transmitDataOnRealtime(
        "newMessage",
        personOne.socketId,
        `message: ${data.message}`
      );
    }
    if (personOne.fcmToken && personId != personOne.id) {
      sendFCMMessage(
        personOne.fcmToken,
        `New message from ${personOne.firstName}`,
        "asad"
      );
    }
    return data;
  },
  findMessage: async (body) => {
    const { chatId } = body;
    const Message = await db.Message.findAll({
      where: { chatId: chatId },
    });
    if (!Message) {
      throw new Error("no message found");
    }
    return Message;
  },
  AllowNotification: async (body) => {
    const { fcmToken, id } = body;
    console.log(id);
    const data = await db.User.update(
      { fcmToken: fcmToken },
      {
        where: {
          id: id,
        },
      }
    );
    if (data[0] == 0) {
      throw new Error("token not sent");
    }
    console.log(data);

    return data;
  },
  sendVideo: async (body, fileBuffer) => {
    const { personId, chatId, fileName } = body;
    if (!fileName && !fileBuffer) {
      throw new Error("image is not provided");
    }
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: fileName, resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    const cloudinaryResult = await uploadToCloudinary();
    if (!cloudinaryResult.secure_url) {
      throw new Error("something went worng try again.");
    }

    const data = await db.Message.create({
      personId: personId,
      chatId: chatId,
      message: cloudinaryResult.secure_url,
      type: "image",
    });
    if (!data) {
      throw new Error("connection error");
    }
    const findchat = await db.Chat.findOne({ where: { id: chatId } });
    if (!findchat) {
      throw new Error("connection error");
    }

    const [personOne, personTwo] = await Promise.all([
      db.User.findOne({ where: findchat.personOneId }),
      db.User.findOne({ where: findchat.personTwoId }),
    ]);

    if (!personOne) {
      throw new Error("connection error");
    }
    if (!personTwo) {
      throw new Error("connection error");
    }
    if (personTwo.socketId && personId != personTwo.id) {
      transmitDataOnRealtime("newMessage", personTwo.socketId, data);
    }
    if (personTwo.fcmToken && personId != personTwo.id) {
      sendFCMMessage(
        personTwo.fcmToken,
        `New message from: ${personTwo.firstName}`,
        `message: ${data.message}`
      );
    }
    if (personOne.socketId && personId != personOne.id) {
      transmitDataOnRealtime(
        "newMessage",
        personOne.socketId,
        `message: ${data.message}`
      );
    }
    if (personOne.fcmToken && personId != personOne.id) {
      sendFCMMessage(
        personOne.fcmToken,
        `New message from ${personOne.firstName}`,
        "asad"
      );
    }
    return data;
  },
  sendVideosMessage: async (body, fileBuffer) => {
    const { personId, chatId, fileName, message } = body;
    if (!fileName && !fileBuffer) {
      throw new Error("image is not provided");
    }
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: fileName, resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    const cloudinaryResult = await uploadToCloudinary();
    if (!cloudinaryResult.secure_url) {
      throw new Error("something went worng try again.");
    }

    const message2 = cloudinaryResult.secure_url + "," + message;
    const data = await db.Message.create({
      personId: personId,
      chatId: chatId,
      message: message2,
      type: "message/video",
    });
    if (!data) {
      throw new Error("connection error");
    }
    const findchat = await db.Chat.findOne({ where: { id: chatId } });
    if (!findchat) {
      throw new Error("connection error");
    }

    const [personOne, personTwo] = await Promise.all([
      db.User.findOne({ where: findchat.personOneId }),
      db.User.findOne({ where: findchat.personTwoId }),
    ]);

    if (!personOne) {
      throw new Error("connection error");
    }
    if (!personTwo) {
      throw new Error("connection error");
    }
    if (personTwo.socketId && personId != personTwo.id) {
      transmitDataOnRealtime("newMessage", personTwo.socketId, data);
    }
    if (personTwo.fcmToken && personId != personTwo.id) {
      sendFCMMessage(
        personTwo.fcmToken,
        `New message from: ${personTwo.firstName}`,
        `message: ${data.message}`
      );
    }
    if (personOne.socketId && personId != personOne.id) {
      transmitDataOnRealtime(
        "newMessage",
        personOne.socketId,
        `message: ${data.message}`
      );
    }
    if (personOne.fcmToken && personId != personOne.id) {
      sendFCMMessage(
        personOne.fcmToken,
        `New message from ${personOne.firstName}`,
        "asad"
      );
    }
    return data;
  },
};
