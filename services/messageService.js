const db = require("../models");
const { transmitDataOnRealtime } = require("../socket"); // Import Socket.IO instance

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
    console.log(personTwo.socketId);
    if (personTwo.socketId && personId != personTwo.id) {
      transmitDataOnRealtime("newMessage", personTwo.socketId, data);
    }
    console.log(personOne.socketId);

    if (personOne.socketId && personId != personOne.id) {
      transmitDataOnRealtime("newMessage", personOne.socketId, data);
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
};
