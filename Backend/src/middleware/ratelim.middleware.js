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

//  OTP limiter (strict)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests, try later",
});

module.exports = {
  generalLimiter,
  authLimiter,
  otpLimiter,
};





















