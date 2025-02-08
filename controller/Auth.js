const { singin, singUp } = require("../services/authService");
const { to } = require("../utils/error-handeling");
const { logINValidation } = require("../validation/authValidation");

module.exports = {
  Login: async (req, res) => {
    const { body } = req;
    const { error } = await logINValidation(body);
    if (error) {
      console.log("erro", error);
      return res.status(400).send({
        message: error,
      });
    }

    const [err, data] = await to(singin(body));
    if (err) {
      console.log("erro", err);
      return res.status(400).send({
        error: err.message,
      });
    }
    return res.status(200).send({
      data: data,
    });
  },

  signUp: async (req, res) => {
    const fileBuffer = req.file.buffer;
    const { body } = req;
    const [err, data] = await to(singUp(body));
    if (err) {
      res.status(400).send({ error: err.message });
    }
  },
};
