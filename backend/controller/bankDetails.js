const { Profile } = require("../model/db");

const saveBankDetails = async (req, res) => {
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
};

const getBankDetails = async (req, res) => {
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
};

const updateBankDetails = async (req, res) => {
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
};

module.exports = {
  saveBankDetails,
  getBankDetails,
  updateBankDetails,
};
