const express = require("express");
const cors = require("cors");
const { router } = require("./routes/auth");
const socketAuth = require("./middleware/socketAuth");
const { Profile } = require("./model/db");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

const ejs = require("ejs");
const path = require("path");

app.use("/auth", router);
io.use(socketAuth);



server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
