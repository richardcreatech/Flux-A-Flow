const { Buyers } = require("../model/db");
const ejs = require("ejs");
const templatePath = "./views/emailTemplate.ejs";
const { sendEmail } = require("../utils/sendEmail");


const sign_up = async (req, res) => {
  const { email, full_name, password } = req.body;

  if (!email || !full_name || !password) {
    return res.json({ message: "Please fill in all the fields" });
  }

  const new_user = new Buyers({
    email,
    full_name,
    password,
  });

  const find_existing_user = await Buyers.findOne({ email: email });

  if (find_existing_user) {
    return res.json({ error: "User already exists" });
  } else if (!find_existing_user) {
    ejs.renderFile(templatePath, { username: full_name }, async (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      await sendEmail(email, "Welcome to Flux-A-Flow!", data);
    });

    res.json({ message: `Hi! ${full_name}` });
    await new_user.save();
  }
}

module.exports = {sign_up}