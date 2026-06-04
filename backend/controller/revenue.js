const { Profile } = require("../model/db");
const { Revenue } = require("../model/db");

const generateDemoRevenue = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    await Revenue.insertMany([
      {
        owner: profile._id,
        month: "Jan",
        revenue: 50000,
      },
      {
        owner: profile._id,
        month: "Feb",
        revenue: 70000,
      },
      {
        owner: profile._id,
        month: "Mar",
        revenue: 90000,
      },
    ]);

    res.json({
      message: "Demo revenue generated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getRevenue = async (req, res) => {
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

    const revenue = await Revenue.find({
      owner: profile._id,
    });

    res.status(200).json({
      revenue,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  generateDemoRevenue,
  getRevenue,
};
