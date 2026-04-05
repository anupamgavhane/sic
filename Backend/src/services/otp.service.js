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
  try {
    const result = await transporter.sendMail({
      to: email,
      subject: "Verify your email - SharingIsCaring",
      text: `Your OTP for SharingIsCaring(SIC) is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP for SharingIsCaring(SIC) is <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`
    });
    console.log("OTP email sent successfully:", result.response);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

module.exports = {
  generateOtp,
  sendOtpEmail
};