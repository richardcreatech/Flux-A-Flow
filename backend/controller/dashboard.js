const { Profile } = require("../model/db");

const getDashboard = async (req, res) => {
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
};

module.exports = { getDashboard };
