transporter
  .sendMail({
    to: "richardcreatech@gmail.com",
    subject: "Test Email from Node.js",
    html: "<h1>Hello from Node.js!</h1><p>This is a test email sent using nodemailer.</p>",
  })
  .then(() => {
    console.log("Email sent successfully");
  })
  .catch((err) => {
    console.error("Error sending email:", err);
  });

  // const templatePath = path.join(__dirname, "views", "emailTemplate.ejs");
const templatePath = "./views/emailTemplate.ejs";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "gmail",
  auth: {
    user: "richardthed3veloper@gmail.com",
    pass: "umav qtcf oecg ulem",
  },
});

ejs.renderFile(templatePath, { username: "Richard" }, async (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  await transporter.sendMail({
    from: "richardthed3veloper@gmail.com",
    to: "richardcreatech@gmail.com",
    subject: "Welcome Email",
    html: data,
  });

  
});