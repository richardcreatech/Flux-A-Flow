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

router.post("/signin", sign_in);
router.post("/signup", sign_up);

router.get("/profile", authMiddleware, profile);

router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
      const profile = await Profile.findOne({user: req.user.id}).populate("marketplaces");

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
  },
);

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

module.exports = { router };
