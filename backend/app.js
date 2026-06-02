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

const allowedOrigins = [
  "http://localhost:5173",
  "https://flux-a-flow-frontend.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

const ejs = require("ejs");
const path = require("path");

app.use("/auth", router);
io.use(socketAuth);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
