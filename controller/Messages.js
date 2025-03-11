const {
  sendMesage,
  findMessage,
  AllowNotification,
  sendVideo,
  sendVideosMessage,
} = require("../services/messageService");
const { to } = require("../utils/error-handeling");

module.exports = {
  SendMessage: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(sendMesage(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    return res.status(200).send({ data: data });
  },
  findMessage: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(findMessage(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(200).send({ data: data });
  },
  allowNotification: async (req, res) => {
    const { body } = req;
    const [err, data] = await to(AllowNotification(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(200).send({ data: data });
  },
  sendVideos: async (req, res) => {
    console.log(req.file);
    const { body } = req;
    const fileBuffer = req.file.buffer;
    const [err, data] = await to(sendVideo(body, fileBuffer));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(200).send({ data: data });
  },
  sendVideoMessage: async (req, res) => {
    console.log(req.file);
    const { body } = req;
    const fileBuffer = req.file.buffer;
    const [err, data] = await to(sendVideosMessage(body, fileBuffer));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    return res.status(200).send({ data: data });
  },
};
