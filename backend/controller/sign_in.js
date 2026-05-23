const { Buyers } = require("../model/db");
const jwt = require("jsonwebtoken");

const sign_in = async (req, res) => {
  let { email, password } = req.body;
 
  password = password.trim();
 
  const buyers = await Buyers.findOne({ email });


  const token = jwt.sign(
    { id: buyers._id, email: buyers.email },
    "my_secret",
    { expiresIn: "1h" },
  );

  res.json({ message: "Signed in successfully", token: token });
}

module.exports = {sign_in}