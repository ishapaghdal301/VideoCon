const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

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

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
  socket.on("drawing", (data) => {
    imageUrl = data;
    console.log("drawing server");
    socket.broadcast.emit("canvasImage", imageUrl);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
