const { Farmers } = require("../model/db");
const jwt = require("jsonwebtoken");

const sign_in = async (req, res) => {
  let { email, password } = req.body;
 
  password = password.trim();
 
  const farmers = await Farmers.findOne({ email });


  const token = jwt.sign(
    { id: farmers._id, email: farmers.email },
    "my_secret",
    { expiresIn: "1h" },
  );

  res.json({ message: "Signed in successfully", token: token });
}

module.exports = {sign_in}