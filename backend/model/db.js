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

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    default: "",
  },
});

const marketplaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer_profiles",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    products: [productSchema],
  },
  {
    timestamps: true,
  },
);

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
    marketplaces: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Marketplace",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("farmer_profiles", profileSchema);

const Farmers = mongoose.model("farmers", user_schema);

const Marketplace = mongoose.model('Marketplace', marketplaceSchema);

module.exports = { Farmers, Profile, Marketplace };