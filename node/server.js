const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("codeChange", (newCode) => {
    socket.broadcast.emit("codeChange", newCode);
  });

  socket.on("inputChange", (newInput) => {
    console.log("input change");
    socket.broadcast.emit("inputChange", newInput);
  });

  socket.on("outputChange", (newOutput) => {
    console.log("output change");
    socket.broadcast.emit("outputChange", newOutput);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
