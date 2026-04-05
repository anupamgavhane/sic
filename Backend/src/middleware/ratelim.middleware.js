const rateLimit = require("express-rate-limit");


//  General limiter (optional)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, try again later",
});

//  Auth limiter (important)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts, please try again later",
});

//  OTP limiter (relaxed for better user experience)
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests, try later",
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter,
};





















