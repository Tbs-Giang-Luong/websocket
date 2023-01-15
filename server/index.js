const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const delay = require("delay");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    io.emit("sendDataFromServer", data);
  });

  async function setNumber() {
    while (true) {
      const number = 70000 + Math.random() * 100;
      socket.emit("sentNumber", {
        number: number.toFixed(2),
      });
      await delay(500);
    }
  }
  setNumber();
});

server.listen(3001, () => {
  console.log("Server Running");
});
