const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bad = require("bad-words");
const messagess = require("./util/messages.js");
const {
  addUser,
  removeUser,
  getUsers,
  getUsersRoom,
} = require("./util/users.js");

const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
const publicdirectory = path.join(__dirname, "../public");

app.use(express.static(publicdirectory));

io.on("connection", (socket) => {
  console.log("connection recieved");

  socket.on("join", ({ username, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    console.log(error);
    console.log(user);

    if (error) {
      return cb(error);
    }

    socket.join(user.room);
    socket.emit("message", messagess.generateMsg("Welcome"));
    socket.broadcast
      .to(user.room)
      .emit("message", messagess.generateMsg(user.username + " has joined"));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersRoom(user.room),
    });
    cb();
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUsers(socket.id);

    console.log(user.room);
    const filter = new bad();

    if (filter.isProfane(message)) {
      return cb("message has abuses");
    }
    io.to(user.room).emit(
      "message",
      messagess.generateMsg(user.username, message)
    );
    cb("sent");
  });

  socket.on("sendLocation", (loc, cb) => {
    const user = getUsers(socket.id);
    io.to(user.room).emit(
      "location-message",
      messagess.generateLoc(user.username, loc)
    );
    cb();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("disconnect");
    console.log(user);
    console.log(user.room);
    if (user) {
      io.to(user.room).emit(
        "message",
        messagess.generateMsg(user.username + " has left")
      );
    }

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersRoom(user.room),
    });
  });
});

server.listen(port, () => {
  console.log("server is up running" + port);
});
