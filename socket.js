const { SocketAuth } = require("./middleware/socketMiddleware");
const db = require("./models");
const { Op } = require("sequelize");

const jwt = require("jsonwebtoken");
let io;
const { to } = require("./utils/error-handeling");

const updateUser = async (socket) => {
  if (socket) {
    const { token } = socket.handshake.query;
    const { id } = jwt.verify(token, process.env.JWT_ID);
    const data = await db.User.update(
      { socketId: socket.id, status: "online" },
      {
        where: {
          id: id,
        },
      }
    );

    if (!data) return new Error("some thing went worng");
  }
};
const updateUserstatus = async (socket) => {
  if (socket) {
    const { token } = socket.handshake.query;
    const { id } = jwt.verify(token, process.env.JWT_ID);
    const data = await db.User.update(
      { socketId: null, status: "offline" },
      {
        where: {
          id: id,
        },
      }
    );

    if (!data) return new Error("some thing went worng");
  }
};
const SocketId = async (id) => {
  const data = await db.User.findOne({ where: { id: id } });
  return data;
};
const chatData = async (id) => {
  const findChat = await db.Chat.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: db.User,
        as: "personOne",
        attributes: ["id", "firstName", "Pic", "email"],
      },
      {
        model: db.User,
        as: "personTwo",
        attributes: ["id", "firstName", "Pic", "email"],
      },
    ],
  });
  return findChat;
};
function socketInit(server) {
  // console.log("Inside socket file....");
  io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // auth middleware
  io.use(SocketAuth);

  io.on("connection", (socket) => {
    const data = updateUser(socket);
    socket.on("disconnect", async () => {
      updateUserstatus(socket);
    });
    socket.on(
      "calling",
      async ({ offer, id, name, email, callerid, chatid }) => {
        const data = await SocketId(id);
        if (data.socketId) {
          const chat = await chatData(chatid);

          if (chat) {
            socket
              .to(data.socketId)
              .emit("incoming-call", { offer, name, email, callerid, chat });
          }
        }
        // here u have to send message
      }
    );
    socket.on("call-accepted", async ({ answer, id }) => {
      console.log("callaccept");
      const data = await SocketId(id);
      console.log("data=>", data.socketId);
      if (data.socketId) {
        console.log(answer);
        socket.to(data.socketId).emit("accepted-call", { answer: answer });
      }
    });
    socket.on("negotiation-call", async ({ id, offer, callerid }) => {
      const data = await SocketId(id);
      if (data.socketId) {
        socket.to(data.socketId).emit("negotiation", { offer, callerid });
      }
    });
    socket.on("negotiation-accepted", async ({ id, answer }) => {
      const data = await SocketId(id);
      if (data.socketId) {
        socket.to(data.socketId).emit("negotiation-answer", { answer: answer });
      }
    });
    socket.on("disconect-call", async ({ id }) => {
      const data = await SocketId(id);
      if (data.socketId) {
        socket.to(data.socketId).emit("call-disconnected", {});
      }
    });
  });
}
function transmitDataOnRealtime(eventName, socketId, data) {
  io.to(socketId).emit(eventName, data);
  console.log(socketId, data);
}

module.exports = { socketInit, transmitDataOnRealtime };
