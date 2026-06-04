const { Profile } = require("../model/db");
const { TopProduct } = require("../model/db");

const generateTopProducts = async (req, res) => {
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
};

const getTopProducts = async (req, res) => {
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
};

module.exports = {
  generateTopProducts,
  getTopProducts,
};
