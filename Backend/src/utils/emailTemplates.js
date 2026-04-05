function otpEmailTemplate(otp) {
  return `Your OTP is ${otp}. It will expire in 5 minutes.`;
}

module.exports = { otpEmailTemplate };