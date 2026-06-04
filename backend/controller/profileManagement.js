const { Profile } = require("../model/db");
const { cloudinary } = require("../utils/cloudinary");

const uploadProfile = async (req, res) => {
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
};

const getSocialProfile = async (req, res) => {
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
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const { nickname, description, originCountry } = req.body;

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
};

const updateProfilePicture = async (req, res) => {
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
};

module.exports = {
  uploadProfile,
  getSocialProfile,
  updateProfile,
  updateProfilePicture,
};
