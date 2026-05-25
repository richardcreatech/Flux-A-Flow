const nodemailer = require("nodemailer");
require("dotenv").config();

// Credentials come from backend/.env (see .env.example).
// Never hardcode the Gmail app password here — it ends up in git history.
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendEmail(to, subject, html) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[sendEmail] SMTP_USER / SMTP_PASS not set — skipping email to",
      to,
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { sendEmail };
