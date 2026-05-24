const { Farmers } = require("../model/db");

const profile = async (req, res) => {
  const user = await Farmers.findById(req.user.id).select("-password");
  res.json({ user });
};

module.exports = { profile };
