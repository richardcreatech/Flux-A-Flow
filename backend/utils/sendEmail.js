const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: "richardthed3veloper@gmail.com",
    pass: "umav qtcf oecg ulem",
  },
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: "richardthed3veloper@gmail.com",
      to: to,
      subject: subject,
      html: html,
    });
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { sendEmail };
