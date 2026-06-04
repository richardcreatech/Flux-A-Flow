const express = require("express");
const router = express.Router();

// Middleware and utilities
const { authMiddleware } = require("../middleware/authMiddleware");
const { upload_pic } = require("../middleware/multer");

// Auth controllers
const { sign_in } = require("../controller/sign_in");
const { sign_up } = require("../controller/sign_up");
const { profile } = require("../controller/profile");

// Dashboard controller
const { getDashboard } = require("../controller/dashboard");

// Profile management controllers
const {
  uploadProfile,
  getSocialProfile,
  updateProfile,
  updateProfilePicture,
} = require("../controller/profileManagement");

// Marketplace controllers
const {
  createMarketplace,
  getMarketplaces,
  deleteMarketplace,
} = require("../controller/marketplace");

// Product controllers
const {
  getMarketplaceProducts,
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require("../controller/product");

// Bank details controllers
const {
  saveBankDetails,
  getBankDetails,
  updateBankDetails,
} = require("../controller/bankDetails");

// Revenue controllers
const { generateDemoRevenue, getRevenue } = require("../controller/revenue");

// Top products controllers
const {
  generateTopProducts,
  getTopProducts,
} = require("../controller/topProducts");

// Reviews controllers
const { generateDemoReviews, getReviews } = require("../controller/reviews");

// Auth routes
router.post("/signin", sign_in);
router.post("/signup", sign_up);
router.get("/profile", authMiddleware, profile);

// Dashboard route
router.get("/dashboard", authMiddleware, getDashboard);

// Profile management routes
router.post(
  "/upload-profile",
  authMiddleware,
  upload_pic.single("profile_picture"),
  uploadProfile,
);

router.get("/social-profile", authMiddleware, getSocialProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.patch(
  "/profilePicture",
  authMiddleware,
  upload_pic.single("profilePicture"),
  updateProfilePicture,
);
// Marketplace routes
router.post("/marketplace", authMiddleware, createMarketplace);
router.get("/marketplaces", authMiddleware, getMarketplaces);
router.delete("/marketplace/:id", authMiddleware, deleteMarketplace);

// Product routes
router.get("/marketplace/:id/products", authMiddleware, getMarketplaceProducts);
router.post(
  "/marketplace/:id/product",
  authMiddleware,
  upload_pic.single("imageURL"),
  addProduct,
);
router.get("/all-products", authMiddleware, getAllProducts);
router.delete(
  "/marketplace/:marketId/product/:productId",
  authMiddleware,
  deleteProduct,
);
router.patch(
  "/marketplace/:marketId/product/:productId",
  authMiddleware,
  upload_pic.single("imageURL"),
  updateProduct,
);

// Bank details routes
router.post("/bank-details", authMiddleware, saveBankDetails);
router.get("/bank-details", authMiddleware, getBankDetails);
router.put("/bank-details", authMiddleware, updateBankDetails);

// Revenue routes
router.post("/generate-demo-revenue", authMiddleware, generateDemoRevenue);
router.get("/revenue", authMiddleware, getRevenue);

// Top products routes
router.post("/top-products", authMiddleware, generateTopProducts);
router.get("/top-products", authMiddleware, getTopProducts);

// Reviews routes
router.post("/reviews", authMiddleware, generateDemoReviews);
router.get("/reviews", authMiddleware, getReviews);

module.exports = { router };
