const { Op, where } = require("sequelize");
const db = require("../models");
const { sendFCMMessage, transmitDataOnRealtime } = require("../socket");

module.exports = {
  createChat: async (body) => {
    const { id, email } = body;
    // console.log(id, email);
    const user = await db.User.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new Error("user not exist");
    }

    const findChat = await db.Chat.findOne({
      where: {
        [Op.or]: [
          { personOneId: id, personTwoId: user.id },
          { personOneId: user.id, personTwoId: id },
        ],
        blocked: false,
      },
      include: [
        {
          model: db.User,
          as: "personOne",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
        {
          model: db.User,
          as: "personTwo",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
      ],
    });
    if (findChat) {
      if (findChat.blocked) {
        throw new Error("You are Blocked by the User");
      }
      if (findChat.messageId) {
        return findChat;
      }
    }

    const Chat = await db.Chat.create({
      personOneId: id,
      personTwoId: user.id,
    });
    if (!Chat) {
      throw new Error("somethig went wrong");
    }
    const Message = await db.Message.create({
      chatId: Chat.id,
      message: "hey there",
      personId: id,
    });

    if (!Message) {
      throw new Error("somethig went wrong");
    }
    const findChats = await db.Chat.findOne({
      where: {
        [Op.or]: [
          { personOneId: id, personTwoId: user.id },
          { personOneId: user.id, personTwoId: id },
        ],
        blocked: false,
      },
      include: [
        {
          model: db.User,
          as: "personOne",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
        {
          model: db.User,
          as: "personTwo",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
      ],
    });
    // const UpdateChat = await db.Chat.update(
    //   {
    //     messageId: Message.id,
    //   },
    //   { where: { id: Chat.id } }
    // );
    // if (UpdateChat[0] == 0) {
    //   throw new Error("somethig went wrong");
    // }
    if (!findChats) {
      throw new Error("something went wrong");
    }
    return findChats;
  },
  findChat: async (body) => {
    const { id } = body;
    const findChat = await db.Chat.findAll({
      where: {
        [Op.or]: [{ personOneId: id }, { personTwoId: id }],
      },
      include: [
        {
          model: db.User,
          as: "personOne", // Alias for first user
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ], // Select specific fields
        },
        {
          model: db.User,
          as: "personTwo", // Alias for second user
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
      ],
    });

    return findChat;
  },
  blockChat: async (body) => {
    const { chatId, id } = body;
    const data = db.Chat.update(
      { blocked: true, blockUserId: id },
      {
        where: { id: chatId },
      }
    );
    if (data[0] == 0) {
      throw new Error("user is not blocked");
    }
    const FindChat = await db.Chat.findOne({ where: { id: chatId } });
    if (!FindChat) {
      throw new Error("user is not blocked");
    }
    const personOne = await db.User.findOne({
      where: { id: FindChat.personOneId },
    });
    const personTwo = await db.User.findOne({
      where: { id: FindChat.personTwoId },
    });

    if (personOne.fcmToken && personOne.id != id) {
      sendFCMMessage(
        personOne.fcmToken,
        `you have blocked by: ${personTwo.firstName}`,
        `message`
      );
    }
    if (personTwo.fcmToken && personTwo.id != id) {
      sendFCMMessage(
        personTwo.fcmToken,
        `you have blocked by: ${personOne.firstName}`,
        `message`
      );
    }
    if (personTwo.socketId) {
      transmitDataOnRealtime("blockUser", personTwo.socketId, {
        data: "blocked user",
      });
    }
    if (personOne.socketId) {
      transmitDataOnRealtime("blockUser", personOne.socketId, {
        data: "blocked user",
      });
    }
    return data;
  },
  unblockChat: async (body) => {
    const { chatId, id } = body;
    const data = db.Chat.update(
      { blocked: false, blockUserId: null },
      {
        where: { id: chatId },
      }
    );
    if (data[0] == 0) {
      throw new Error("user is not blocked");
    }
    const FindChat = await db.Chat.findOne({ where: { id: chatId } });
    if (!FindChat) {
      throw new Error("user is not unblocked");
    }
    const personOne = await db.User.findOne({
      where: { id: FindChat.personOneId },
    });
    const personTwo = await db.User.findOne({
      where: { id: FindChat.personTwoId },
    });

    if (personOne.fcmToken && personOne.id != id) {
      sendFCMMessage(
        personOne.fcmToken,
        `you have unblocked by: ${personTwo.firstName}`,
        `message`
      );
    }
    if (personTwo.fcmToken && personTwo.id != id) {
      sendFCMMessage(
        personTwo.fcmToken,
        `you have unblocked by: ${personOne.firstName}`,
        `message`
      );
    }
    if (personTwo.socketId) {
      transmitDataOnRealtime("blockUser", personTwo.socketId, {
        data: "unblocked user",
      });
    }
    if (personOne.socketId) {
      transmitDataOnRealtime("blockUser", personOne.socketId, {
        data: "unblocked user",
      });
    }
    return data;
  },
  findBlockChat: async (body) => {
    const { id } = body;
    const data = await db.Chat.findAll({
      where: {
        [Op.or]: [{ personOneId: id }, { personTwoId: id }],
        blocked: true,
      },
      include: [
        {
          model: db.User,
          as: "personOne",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
        {
          model: db.User,
          as: "personTwo",
          attributes: [
            "id",
            "firstName",
            "Pic",
            "email",
            "whatappstatus",
            "status",
          ],
        },
      ],
    });
    return data;
  },
};
