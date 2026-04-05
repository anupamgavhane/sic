const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,           // your Gmail
    pass: process.env.EMAIL_PASSWORD   // App Password (NOT real password)
  }
});

module.exports = transporter;