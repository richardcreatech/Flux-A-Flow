const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader); // 👈 ADD

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  console.log("TOKEN:", token); // 👈 ADD

  try {
    const decoded = jwt.verify(token, "my_secret");

    console.log("DECODED:", decoded); // 👈 ADD

    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message); // 👈 ADD
    return res.status(401).json({ message: "Invalid food" });
  }
};

module.exports = { authMiddleware };