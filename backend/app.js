const express = require("express");
const cors = require("cors");
const { router } = require("./routes/auth");
require('dotenv').config()

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors(
  {origin: "http://localhost:5173",
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true}
)); 
app.use(express.json());

const ejs = require("ejs");
const path = require("path");


app.use("/auth", router);


app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
