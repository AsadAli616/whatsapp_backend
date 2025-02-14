const { SocketAuth } = require("./middleware/socketMiddleware");
const db = require("./models");
const jwt = require("jsonwebtoken");
let io;

const updateUser = async (socket) => {
  if (socket) {
    const { token } = socket.handshake.query;
    const { id } = jwt.verify(token, process.env.JWT_ID);
    // console.log();
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
      { socketId: "", status: "offline" },
      {
        where: {
          id: id,
        },
      }
    );

    if (!data) return new Error("some thing went worng");
  }
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
    socket.emit("message", "Hello from server");
    socket.on("disconnect", async () => {
      updateUserstatus(socket);
    });
  });
}
function transmitDataOnRealtime(eventName, socketId, data) {
  io.to(socketId).emit(eventName, data);
  console.log(socketId, data);
}

module.exports = { socketInit, transmitDataOnRealtime };
