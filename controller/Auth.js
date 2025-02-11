const { singin, singUp, Code } = require("../services/authService");
const { to } = require("../utils/error-handeling");
const {
  logINValidation,
  verifyAccount,
  signUpValidation,
} = require("../validation/authValidation");

module.exports = {
  Login: async (req, res) => {
    const { body } = req;
    const { error } = await logINValidation(body);
    if (error) {
      console.log("erro", error);
      return res.status(400).send({
        error: error.details[0].message,
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
    const { body } = req;
    const { error } = await signUpValidation(body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const fileBuffer = req.file.buffer;
    // const error1 = await fileBufferVelidation(fileBuffer);

    const [err, data] = await to(singUp(body, fileBuffer));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    res.status(200).send({ data: data });
  },
  verifyCode: async (req, res) => {
    const { body } = req;
    const { error } = await verifyAccount(body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const [err, data] = await to(Code(body));
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    res.status(200).send({ data: data });
  },
};
