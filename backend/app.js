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

// CORS configuration with environment variables
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,https://flux-a-flow-frontend.netlify.app"
).split(",");

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for socket connection"));
      }
    },
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
