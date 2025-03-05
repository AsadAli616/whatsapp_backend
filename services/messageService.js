const db = require("../models");
const { transmitDataOnRealtime, sendFCMMessage } = require("../socket"); // Import Socket.IO instance

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
};
