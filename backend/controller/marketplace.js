const { Profile } = require("../model/db");
const { Marketplace } = require("../model/db");

const createMarketplace = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMarketplaces = async (req, res) => {
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
};

const deleteMarketplace = async (req, res) => {
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
};

module.exports = {
  createMarketplace,
  getMarketplaces,
  deleteMarketplace,
};
