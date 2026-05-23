const { Buyers } = require("../model/db");

const profile = async (req, res) => {
  const user = await Buyers.findById(req.user.id).select("-password");
  res.json({ user });
};

module.exports = { profile };
