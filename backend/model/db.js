const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

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

const revenueSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },

  month: String,

  revenue: Number,
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
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankCode: String,
      bankName: String,
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

const transactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },

  marketplaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marketplace",
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  amount: Number,

  quantity: Number,

  platformFee: Number,

  status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },

  paystackReference: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const topProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
      default: "",
    },

    marketplaceId: {
      type: String,
    },
    marketplaceName: {
      type: String,
      required: true,
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farmer_profiles",
      required: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const reviewSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: true,
    },

    reviewerLocation: {
      type: String,
      required: true,
    },

    productId: {
      type: String,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    reviewText: {
      type: String,
      required: true,
    },

    sellerReply: {
      type: String,
      default: "",
    },

    sellerReplyDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const TopProduct = mongoose.model("TopProduct", topProductSchema);
const Profile = mongoose.model("farmer_profiles", profileSchema);

const Farmers = mongoose.model("farmers", user_schema);

const Marketplace = mongoose.model("Marketplace", marketplaceSchema);
const Revenue = mongoose.model("Revenue", revenueSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const Review = mongoose.model("Review", reviewSchema);

module.exports = {
  Farmers,
  Profile,
  Marketplace,
  Revenue,
  Transaction,
  TopProduct,
  Review
};
