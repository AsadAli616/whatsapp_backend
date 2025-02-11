const db = require("../models");

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
