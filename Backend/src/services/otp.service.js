const otpGenerator = require("otp-generator");
const transporter = require("../config/mailer");

function generateOtp() {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  });
}

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    text: `Your OTP for SharingIsCaring(SIC) is ${otp}`
  });
}

module.exports = {
  generateOtp,
  sendOtpEmail
};