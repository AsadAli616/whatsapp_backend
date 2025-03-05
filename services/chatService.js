const { Op } = require("sequelize");
const db = require("../models");

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
        blocked: false,
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
};
