const {
  createChat,
  findChat,
  blockChat,
  unblockChat,
} = require("../services/chatService");
const { to } = require("../utils/error-handeling");

module.exports = {
  addChat: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(createChat(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    res.status(200).send({ data: data });
  },
  findChats: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(findChat(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    res.status(200).send({ data: data });
  },
  blockedChat: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(blockChat(body));
    if (err) {
      res.status(400).send({
        error: err.message,
      });
    }
    res.status(200).send({
      data: data,
    });
  },
  unblockChats: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(unblockChat(body));
    if (err) {
      res.status(400).send({
        error: err.message,
      });
    }
    res.status(200).send({
      data: data,
    });
  },
};
