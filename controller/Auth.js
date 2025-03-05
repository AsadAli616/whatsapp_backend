const {
  singin,
  singUp,
  Code,
  editeProfile,
} = require("../services/authService");
const { to } = require("../utils/error-handeling");
const {
  logINValidation,
  verifyAccount,
  signUpValidation,
  editeProfileValidation,
} = require("../validation/authValidation");

module.exports = {
  Login: async (req, res) => {
    const { body } = req;
    const { error } = await logINValidation(body);
    if (error) {
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
  editeProfile: async (req, res) => {
    const { body } = req;
    let fileBuffer = null;
    console.log("bodyfileName", body.fileName);
    if (body.fileName !== undefined) {
      fileBuffer = req.file.buffer;
    }
    console.log("fileBuffer", fileBuffer);
    const { error } = await editeProfileValidation(body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const [err, data] = await to(editeProfile(body, fileBuffer));
    if (err) {
      return res.status(400).send({ error: err.message });
    }

    res.status(200).send({ data: data, update: "good hogia" });
  },
};
