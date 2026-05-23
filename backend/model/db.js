const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/flux-a-flow";

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to database successfully");
});

const user_schema = new mongoose.Schema({
  full_name: String,
  password: String,
  email: String,
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      unique: true,
    },

    nickname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    originCountry: {
      type: String,
      required: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("farmer_profiles", profileSchema);

const Buyers = mongoose.model("buyers", user_schema);

module.exports = { Buyers, Profile };
