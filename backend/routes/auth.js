const express = require("express");
const router = express.Router();
const { Founder } = require("../model/db");
const { sendEmail } = require("../utils/sendEmail");
const ejs = require("ejs");
const templatePath = "./views/emailTemplate.ejs";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");
const { sign_in } = require("../controller/sign_in");
const { sign_up } = require("../controller/sign_up");
const { profile } = require("../controller/profile");
const { Profile } = require("../model/db");
const { upload_pic } = require("../middleware/multer");
const { cloudinary } = require("../utils/cloudinary");
const { Marketplace } = require("../model/db");
const { Revenue } = require("../model/db");
const { TopProduct } = require("../model/db");
const { Review } = require("../model/db");
router.post("/signin", sign_in);
router.post("/signup", sign_up);

router.get("/profile", authMiddleware, profile);

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "marketplaces",
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const no_of_marketplaces = profile.marketplaces.length;

    let total_products = 0;

    for (let i = 0; i < profile.marketplaces.length; i++) {
      const market = profile.marketplaces[i];

      for (let j = 0; j < market.products.length; j++) {
        total_products += Number(market.products[j].quantity);
      }
    }

    res.json({
      marketplaces: no_of_marketplaces,
      products: total_products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/upload-profile",
  authMiddleware,
  upload_pic.single("profile_picture"),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const { nickname, description, originCountry } = req.body;

      let profilePicture = "";

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profilePicture = result.secure_url;
      }

      console.log(profilePicture);

      const profile = await Profile.create({
        user: userId,
        nickname,
        description,
        originCountry,
        profilePicture,
      });

      res.status(201).json({
        success: true,
        message: "Profile created successfully",
        profile,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Failed to create profile",
      });
    }
  },
);

router.get("/social-profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if profile exists
    const profile = await Profile.findOne({
      user: userId,
    });

    // No profile found
    if (!profile) {
      return res.status(404).json({
        success: false,
        hasProfile: false,
        message: "Profile not found",
      });
    }

    // Profile exists
    res.status(200).json({
      success: true,
      hasProfile: true,
      profile,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const {
      nickname,

      description,

      originCountry,
    } = req.body;

    if (nickname) profile.nickname = nickname;

    if (description) profile.description = description;

    if (originCountry) profile.originCountry = originCountry;

    await profile.save();

    res.json({
      message: "Profile updated",

      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch(
  "/profilePicture",
  authMiddleware,
  upload_pic.single("profilePicture"),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const result = await cloudinary.uploader.upload(req.file.path);

      profile.profilePicture = result.secure_url;

      await profile.save();

      res.json({
        message: "Picture updated",

        picture: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);
router.post("/marketplace", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  const { title, description } = req.body;

  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    return res.status(404).json({
      message: "Profile not found",
    });
  }

  // Create marketplace
  const marketplace = await Marketplace.create({
    owner: profile._id,
    title,
    description,
  });

  // Link marketplace to profile
  profile.marketplaces.push(marketplace._id);

  await profile.save();

  res.status(201).json({
    message: "Marketplace created",
    marketplace,
  });
});

router.get("/marketplaces", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("marketplaces");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      marketplaces: profile.marketplaces,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/marketplace/:id/products", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const market = await Marketplace.findById(id);

    if (!market) {
      return res.status(404).json({
        message: "Marketplace not found",
      });
    }

    res.json({
      title: market.title,
      desc: market.description,
      products: market.products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/marketplace/:id/product",
  authMiddleware,
  upload_pic.single("imageURL"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const { name, price, quantity } = req.body;

      if (!name || !price || !quantity) {
        return res.status(400).json({
          message: "Missing fields",
        });
      }

      let prodPicture = "";

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        prodPicture = result.secure_url;
      }

      const market = await Marketplace.findById(id);

      if (!market) {
        return res.status(404).json({
          message: "Marketplace not found",
        });
      }

      market.products.push({
        name,

        price: Number(price),

        quantity: Number(quantity),

        imageURL: prodPicture,
      });

      await market.save();

      res.status(201).json({
        message: "Product added",

        products: market.products,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.get("/all-products", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("marketplaces");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    let all_products = [];

    for (let i = 0; i < profile.marketplaces.length; i++) {
      const market = profile.marketplaces[i];

      for (let j = 0; j < market.products.length; j++) {
        all_products.push({
          ...market.products[j].toObject(),

          marketplaceName: market.title,

          marketplaceId: market._id,
        });
      }
    }

    res.json({
      products: all_products,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete(
  "/marketplace/:marketId/product/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        marketId,

        productId,
      } = req.params;

      const market = await Marketplace.findById(marketId);

      if (!market) {
        return res.status(404).json({
          message: "Marketplace not found",
        });
      }

      market.products = market.products.filter(
        (product) => product._id.toString() !== productId,
      );

      await market.save();

      res.json({
        message: "Product deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.delete("/marketplace/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const market = await Marketplace.findById(id);

    if (!market) {
      return res.status(404).json({
        message: "Marketplace not found",
      });
    }

    profile.marketplaces = profile.marketplaces.filter(
      (marketId) => marketId.toString() !== id,
    );

    await profile.save();

    await Marketplace.findByIdAndDelete(id);

    res.json({
      message: "Marketplace deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.patch(
  "/marketplace/:marketId/product/:productId",
  authMiddleware,
  upload_pic.single("imageURL"),
  async (req, res) => {
    try {
      const {
        marketId,

        productId,
      } = req.params;

      const {
        name,

        price,

        quantity,
      } = req.body;

      const market = await Marketplace.findById(marketId);

      if (!market) {
        return res.status(404).json({
          message: "Marketplace not found",
        });
      }

      const product = market.products.id(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (name) product.name = name;

      if (price) product.price = Number(price);

      if (quantity) product.quantity = Number(quantity);

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);

        product.imageURL = result.secure_url;
      }

      await market.save();

      res.json({
        message: "Product updated",

        product,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post("/bank-details", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { accountName, accountNumber, bankName, bankCode } = req.body;

    if (!accountName || !accountNumber || !bankName || !bankCode) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const profile = await Profile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.bankDetails = {
      accountName,
      accountNumber,
      bankName,
      bankCode,
      verified: false,
    };

    await profile.save();

    res.status(200).json({
      message: "Bank details saved",
      bankDetails: profile.bankDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/bank-details", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json({
      bankDetails: profile.bankDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.put("/bank-details", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { accountName, accountNumber, bankName, bankCode } = req.body;

    const profile = await Profile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.bankDetails = {
      accountName,
      accountNumber,
      bankName,
      bankCode,
    };

    await profile.save();

    res.status(200).json({
      message: "Bank details updated",
      bankDetails: profile.bankDetails,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/generate-demo-revenue", authMiddleware, async (req, res) => {
  const profile = await Profile.findOne({
    user: req.user.id,
  });

  await Revenue.insertMany([
    {
      owner: profile._id,
      month: "Jan",
      revenue: 50000,
    },
    {
      owner: profile._id,
      month: "Feb",
      revenue: 70000,
    },
    {
      owner: profile._id,
      month: "Mar",
      revenue: 90000,
    },
  ]);

  res.json({
    message: "Demo revenue generated",
  });
});

router.get("/revenue", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const revenue = await Revenue.find({
      owner: profile._id,
    });

    res.status(200).json({
      revenue,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/top-products", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const buildDummyData = (farmerId) => [
      {
        productId: "prod_" + Math.random().toString(36).substring(2, 12),
        productName: "Yellow Maize (Corn)",
        productPrice: 25000,
        imageURL:
          "https://images.unsplash.com/photo-1601593768797-9d8d7a3b8c6b?auto=format&fit=crop&w=800&q=60",
        marketplaceId: "mp_" + Math.random().toString(36).substring(2, 10),
        marketplaceName: "GreenHarvest Agro Market",
        farmerId,
        totalOrders: 312,
        totalRevenue: 7800000,
      },
      {
        productId: "prod_" + Math.random().toString(36).substring(2, 12),
        productName: "Fresh Mangoes (Kent Variety)",
        productPrice: 18000,
        imageURL:
          "https://images.unsplash.com/photo-1605027990121-cbae9a3b1a0b?auto=format&fit=crop&w=800&q=60",
        marketplaceId: "mp_" + Math.random().toString(36).substring(2, 10),
        marketplaceName: "FarmLink Produce Hub",
        farmerId,
        totalOrders: 228,
        totalRevenue: 4104000,
      },
      {
        productId: "prod_" + Math.random().toString(36).substring(2, 12),
        productName: "Fresh Tomatoes (Farm Harvest)",
        productPrice: 12000,
        imageURL:
          "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=60",
        marketplaceId: "mp_" + Math.random().toString(36).substring(2, 10),
        marketplaceName: "AgroConnect Marketplace",
        farmerId,
        totalOrders: 195,
        totalRevenue: 2340000,
      },
      {
        productId: "prod_" + Math.random().toString(36).substring(2, 12),
        productName: "Sunflower Bouquet",
        productPrice: 15000,
        imageURL:
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60",
        marketplaceId: "mp_" + Math.random().toString(36).substring(2, 10),
        marketplaceName: "BloomFields Farm Market",
        farmerId,
        totalOrders: 174,
        totalRevenue: 2610000,
      },
      {
        productId: "prod_" + Math.random().toString(36).substring(2, 12),
        productName: "Cassava Tubers (Fresh Harvest)",
        productPrice: 9000,
        imageURL:
          "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=60",
        marketplaceId: "mp_" + Math.random().toString(36).substring(2, 10),
        marketplaceName: "HarvestGate Agro Store",
        farmerId,
        totalOrders: 143,
        totalRevenue: 1287000,
      },
    ];

    const dummyProducts = buildDummyData(profile._id);

    await TopProduct.insertMany(dummyProducts);

    res.json({
      message: "Top products seeded successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/top-products", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const products = await TopProduct.find({
      farmerId: profile._id,
    }).sort({
      totalRevenue: -1,
    });

    res.json({
      products,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/reviews", authMiddleware, async (req, res) => {
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
});

router.get("/reviews", authMiddleware, async (req, res) => {
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
});

module.exports = { router };
