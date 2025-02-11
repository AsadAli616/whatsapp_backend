const db = require("../models");

module.exports = {
  createChat: async (body) => {
    const { id, email } = body;
    console.log(id, email);
    const user = await db.User.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new Error("user not exist");
    }
    const findChat = await db.Chat.findOne({
      where: { personOneId: id, personTwoId: user.id },
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
      message: "",
      personId: id,
    });

    if (!Message) {
      throw new Error("somethig went wrong");
    }

    const UpdateChat = await db.Chat.update(
      {
        messageId: Message.id,
      },
      { where: { id: Chat.id } }
    );
    if (UpdateChat[0] == 0) {
      throw new Error("somethig went wrong");
    }
    return UpdateChat;
  },
  findChat: async (body) => {
    const { id } = body;
    const findChat = await db.Chat.findAll({
      where: { personOneId: id, blocked: false },
    });
    const findChat2 = await db.Chat.findOne({
      where: { personTwoId: id, blocked: false },
    });
    if (!findChat && !findChat2) {
      return "no chat found";
    }
    if (!findChat) return findChat2;
    if (!findChat2) return findChat;

    const AllUser = findChat.concat(findChat2);

    return AllUser;
  },
};
