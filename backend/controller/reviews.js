const { Profile } = require("../model/db");
const { Review } = require("../model/db");

const generateDemoReviews = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const dummyReviews = [
      {
        reviewerName: "Amaka Eze",
        reviewerLocation: "Lagos",
        productId: "prod_001",
        productName: "Organic Tomatoes, 5kg",
        farmerId: profile._id,
        rating: 5,
        reviewText:
          "Freshest tomatoes I've gotten in months. Skin firm, color deep, lasted nearly two weeks in the fridge. Already reordered.",
        sellerReply: "Thanks Amaka. Next batch ships Friday.",
        sellerReplyDate: new Date("2026-05-13"),
      },
      {
        reviewerName: "Chinedu Okafor",
        reviewerLocation: "Abuja",
        productId: "prod_002",
        productName: "Yellow Maize, 10kg",
        farmerId: profile._id,
        rating: 4,
        reviewText:
          "Good quality maize and well packaged. Delivery arrived on schedule.",
        sellerReply: "Thank you for your feedback. We're glad you enjoyed it.",
        sellerReplyDate: new Date("2026-05-15"),
      },
      {
        reviewerName: "Blessing Nwosu",
        reviewerLocation: "Port Harcourt",
        productId: "prod_003",
        productName: "Fresh Mangoes, Basket",
        farmerId: profile._id,
        rating: 5,
        reviewText: "Sweet, juicy, and perfectly ripe. My family loved them.",
        sellerReply:
          "We're happy to hear that. Thanks for supporting our farm.",
        sellerReplyDate: new Date("2026-05-18"),
      },
      {
        reviewerName: "Emeka Obi",
        reviewerLocation: "Enugu",
        productId: "prod_004",
        productName: "Cassava Tubers, 20kg",
        farmerId: profile._id,
        rating: 4,
        reviewText: "Fresh harvest and very clean. Will definitely buy again.",
      },
      {
        reviewerName: "Aisha Bello",
        reviewerLocation: "Kano",
        productId: "prod_005",
        productName: "Sunflower Bouquet",
        farmerId: profile._id,
        rating: 5,
        reviewText:
          "Beautiful flowers and excellent presentation. Stayed fresh for days.",
        sellerReply: "Thank you! We appreciate your kind words.",
        sellerReplyDate: new Date("2026-05-20"),
      },
    ];

    await Review.insertMany(dummyReviews);

    res.json({
      message: "Demo reviews generated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const reviews = await Review.find({
      farmerId: profile._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      reviews,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  generateDemoReviews,
  getReviews,
};
