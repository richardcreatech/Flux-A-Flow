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

module.exports = { router };
