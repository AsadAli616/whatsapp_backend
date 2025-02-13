const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  SocketAuth: (socket, next) => {
    const { token } = socket.handshake.query;
    if (token) {
      const { id, email } = jwt.verify(token, process.env.JWT_ID);
      if (!id) {
        return new Error("token is not correct");
      }
      if (!email) {
        return new Error("token is not correct");
      }
      next();
    } else {
      return new Error("token not found");
    }
  },
};
