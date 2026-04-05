const express = require('express')
const {registerController,loginController,verifyOtpController,resendOtpController,googleLoginController,logoutController,getMeController}=require('../controllers/auth.controller')
const router = express.Router();
const {
  authLimiter,
  otpLimiter
} = require("../middleware/ratelim.middleware");


router.post('/register',authLimiter,registerController);
router.post('/login',authLimiter,loginController);
router.post("/verify-otp",authLimiter, verifyOtpController);
router.post("/resend-otp",otpLimiter, resendOtpController);
router.post("/google-login", googleLoginController);
router.post("/logout", logoutController);
router.get("/me", getMeController);

module.exports=router