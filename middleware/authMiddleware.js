var jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  auth: (req, res, next) => {
    const { token } = req.headers;
    const { body } = req;
    if (!token) {
      return res.status(404).send({
        error: "Hacker Chala jao",
      });
    }

    const { id, email } = jwt.verify(token, process.env.JWT_ID);
    if (!id) {
      return res.status(404).send({
        error: "masti mat kro website ka saat",
      });
    }
    if (email != body.Useremail) {
      return res.status(404).send({
        error: "Login again",
      });
    }
    req.body.id = id;

    next();
  },
};
