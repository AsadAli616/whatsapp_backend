const { SocketAuth } = require("./middleware/socketMiddleware");
const db = require("./models");
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
    socket.on("calling", async ({ offer, id, name }) => {
      const data = await SocketId(id);
      if (data.socketId) {
        console.log(data.socketId);
        socket.to(data.socketId).emit("incoming-call", { offer, name });
      }
      // here u have to send message
    });
  });
}
function transmitDataOnRealtime(eventName, socketId, data) {
  io.to(socketId).emit(eventName, data);
  console.log(socketId, data);
}

module.exports = { socketInit, transmitDataOnRealtime };
