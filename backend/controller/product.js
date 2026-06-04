const { Profile } = require("../model/db");
const { Marketplace } = require("../model/db");
const { cloudinary } = require("../utils/cloudinary");

const getMarketplaceProducts = async (req, res) => {
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
};

const addProduct = async (req, res) => {
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
};

const getAllProducts = async (req, res) => {
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
};

const deleteProduct = async (req, res) => {
  try {
    const { marketId, productId } = req.params;

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
};

const updateProduct = async (req, res) => {
  try {
    const { marketId, productId } = req.params;
    const { name, price, quantity } = req.body;

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
};

module.exports = {
  getMarketplaceProducts,
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
};
